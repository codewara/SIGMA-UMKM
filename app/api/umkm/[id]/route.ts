import { umkmUpdateSchema } from "@/lib/validation/umkm_profile.schema";
import { connectMongo } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { UUID } from "mongodb";
import { requireAuth } from "@/lib/auth";
import { requireOwnership } from "@/lib/rbac-helpers";

// get profile umkm by id
// RBAC: ADMIN, PEJABAT, UMKM_OWNER (own only), Unauthenticated (verified only)
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { user } = await requireAuth(["ADMIN", "PEJABAT", "UMKM_OWNER"], true);

    const { id } = await context.params;
    const db = await connectMongo();
    const umkmCollection = db.collection("umkm_profiles");

    // @ts-expect-error cast _id to UUID
    const umkm = await umkmCollection.findOne({ _id: new UUID(id), is_deleted: false });
    if (!umkm) {
        return NextResponse.json(
            { error: "UMKM not found", id },
            { status: 404 }
        );
    }

    // Unauthenticated: Only verified UMKMs (no contact info)
    if (!user) {
        if (umkm.legalitas?.status_verifikasi !== "VERIFIED") {
            return NextResponse.json({ error: "UMKM not found" }, { status: 404 });
        }
        const restricted = {
            _id: umkm._id,
            nama_usaha: umkm.nama_usaha,
            sektor: umkm.sektor,
            wilayah: umkm.wilayah,
            lokasi: umkm.lokasi,
            summary_terakhir: umkm.summary_terakhir
        };
        return NextResponse.json({ message: "UMKM public view", data: restricted });
    }

    // UMKM_OWNER: Check ownership
    if (user.role === "UMKM_OWNER") {
        const isOwner = await requireOwnership(user._id, id);
        if (!isOwner) {
            return NextResponse.json({ error: "You don't own this UMKM" }, { status: 403 });
        }
    }

    // ADMIN, PEJABAT, UMKM_OWNER (own): Full data
    return NextResponse.json({ message: "UMKM full data", data: umkm });
}

// update profile umkm
// RBAC: ADMIN, UMKM_OWNER (own only)
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { user, error } = await requireAuth(["ADMIN", "UMKM_OWNER"]);
    if (error || !user) return NextResponse.json({ error: error || "Unauthorized" }, { status: 403 });

    try {
        const { id } = await context.params;
        const db = await connectMongo();
        const umkmCollection = db.collection("umkm_profiles");

        // UMKM_OWNER: Check ownership
        if (user.role === "UMKM_OWNER") {
            const isOwner = await requireOwnership(user._id, id);
            if (!isOwner) {
                return NextResponse.json({ error: "You don't own this UMKM" }, { status: 403 });
            }
        }

        let reqBody;
        try {
            const text = await req.text();
            reqBody = text ? JSON.parse(text) : {};
        } catch (e) {
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        // UMKM_OWNER cannot change verification status
        if (user.role === "UMKM_OWNER" && reqBody.legalitas?.status_verifikasi) {
            delete reqBody.legalitas.status_verifikasi;
        }

        // validasi data
        const parsed = umkmUpdateSchema.partial().parse(reqBody);

        const result = await umkmCollection.findOneAndUpdate(
            // @ts-expect-error cast _id to UUID
            { _id: new UUID(id) },
            { $set: parsed },
            { returnDocument: "after" }
        );

        if (!result) {
            return NextResponse.json({ error: "UMKM not found" }, { status: 404 });
        }

        return NextResponse.json(result);
    } catch (err) {
        if (err instanceof ZodError) {
            return NextResponse.json({ error: "Validation failed", details: err.issues }, { status: 400 });
        }
        console.error("Error updating UMKM:", err);
        return NextResponse.json({ error: "Failed to update UMKM" }, { status: 500 });
    }
}

// delete profile umkm
// RBAC: ADMIN (hard delete), UMKM_OWNER (soft delete, own only)
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { user, error } = await requireAuth(["ADMIN", "UMKM_OWNER"]);
    if (error || !user) return NextResponse.json({ error: error || "Unauthorized" }, { status: 403 });

    try {
        const { id } = await context.params;
        const db = await connectMongo();
        const collection = db.collection("umkm_profiles");

        // UMKM_OWNER: Check ownership and soft delete
        if (user.role === "UMKM_OWNER") {
            const isOwner = await requireOwnership(user._id, id);
            if (!isOwner) {
                return NextResponse.json({ error: "You don't own this UMKM" }, { status: 403 });
            }

            // Soft delete
            const result = await collection.findOneAndUpdate(
                // @ts-expect-error cast _id to UUID
                { _id: new UUID(id) },
                { $set: { is_deleted: true, deleted_at: new Date() } },
                { returnDocument: "after" }
            );

            if (!result) {
                return NextResponse.json({ error: "UMKM not found" }, { status: 404 });
            }

            return NextResponse.json({ message: "UMKM marked as deleted", data: result }, { status: 200 });
        }

        // ADMIN: Hard delete
        // @ts-expect-error cast _id to UUID
        const result = await collection.deleteOne({ _id: new UUID(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "UMKM not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "UMKM permanently deleted", deletedCount: result.deletedCount }, { status: 200 });
    } catch (err) {
        console.error("Error deleting UMKM:", err);
        return NextResponse.json({ error: "Failed to delete UMKM" }, { status: 500 });
    }
}