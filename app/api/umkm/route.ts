import { umkmProfileSchema } from "@/lib/validation/umkm_profile.schema";
import { connectMongo } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { requireAuth } from "@/lib/auth";
import { UUID } from "mongodb";

// ambil list data umkm
// RBAC: ADMIN, PEJABAT, UMKM_OWNER (filtered by owner), Unauthenticated (verified only)
export async function GET(req: NextRequest) {
    const { user, error } = await requireAuth(["ADMIN", "PEJABAT", "UMKM_OWNER"], true);

    const db = await connectMongo();
    const umkmCollection = db.collection("umkm_profiles");

    // Unauthenticated: Only show verified UMKMs (basic info)
    if (!user) {
        const data = await umkmCollection
            .find(
                { "legalitas.status_verifikasi": "VERIFIED", is_deleted: false },
                { projection: { nama_usaha: 1, sektor: 1, "wilayah.kota": 1 } }
            )
            .toArray();
        return NextResponse.json({ message: "Public UMKM list", data });
    }

    // UMKM_OWNER: Only their own UMKMs
    if (user.role === "UMKM_OWNER") {
        const data = await umkmCollection
            .find({ owner_id: user._id, is_deleted: false })
            .toArray();
        return NextResponse.json({ message: "Your UMKM list", data });
    }

    // ADMIN & PEJABAT: Full data with optional status filter
    const statusParam = req.nextUrl.searchParams.get('status');
    const filter: any = { is_deleted: false };
    if (statusParam && ["PENDING", "VERIFIED", "REJECTED"].includes(statusParam)) {
        filter["legalitas.status_verifikasi"] = statusParam;
    }

    const data = await umkmCollection.find(filter).toArray();
    return NextResponse.json({ message: "UMKM list", data, user: { role: user.role, email: user.email } });
}

// create (regist) data umkm baru
// RBAC: ADMIN, UMKM_OWNER
export async function POST(req: NextRequest) {
    const { user, error } = await requireAuth(["ADMIN", "UMKM_OWNER"]);
    if (error || !user) return NextResponse.json({ error: error || "Unauthorized" }, { status: 403 });

    try {
        const db = await connectMongo();
        const umkmCollection = db.collection("umkm_profiles");
        const reqBody = await req.json();

        // validasi data
        const parsed = umkmProfileSchema.parse(reqBody);

        // Generate UUID for _id
        const newId = new UUID();

        // Set ownership and verification status based on role
        const newUmkm = {
            // @ts-expect-error cast _id to UUID
            _id: newId,
            ...parsed,
            owner_id: user.role === "UMKM_OWNER" ? user._id : parsed.owner_id || null,
            legalitas: {
                ...parsed.legalitas,
                status_verifikasi: user.role === "UMKM_OWNER" ? "PENDING" : "VERIFIED",
            },
            is_deleted: false,
            deleted_at: null,
            tanggal_bergabung: new Date(),
            summary_terakhir: null,
        };

        await umkmCollection.insertOne(newUmkm);
        return NextResponse.json({ message: "UMKM Berhasil Didaftarkan", data: newUmkm }, { status: 201 });
    } catch (err) {
        if (err instanceof ZodError) {
            return NextResponse.json({ error: "Validation failed", details: err.issues }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to create UMKM" }, { status: 500 });
    }
}
