import { umkmUpdateSchema } from "@/lib/validation/umkm_profile.schema";
import { connectMongo } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { UUID } from "mongodb";

// get profile umkm by id
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }>}) {
    const { id } = await context.params; 
    const db = await connectMongo();
    const umkmCollection = db.collection("umkm_profiles");

    // @ts-expect-error cast _id to UUID
    const umkm = await umkmCollection.findOne({ _id: new UUID(id) });
    if (!umkm) {
        return NextResponse.json(
            { error: "UMKM not found", id},
            { status: 404 }
        );
    }
    return NextResponse.json({ message: "UMKM returned with 1 data", data: umkm });
}

// update profile umkm
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }>}) {
    try{
        const { id } = await context.params;
        const db = await connectMongo();
        const umkmCollection = db.collection("umkm_profiles");

        const reqBody = await req.json();

        // validasi data
        const parsed = umkmUpdateSchema.partial().parse(reqBody);

        const result = await umkmCollection.findOneAndUpdate(
            // @ts-expect-error cast _id to UUID
            { _id: new UUID(id) },
            { $set: parsed },
            { returnDocument: "after" }
        );
        return NextResponse.json(result!);
    } catch (err) {
        if (err instanceof ZodError) {
            return NextResponse.json({ error: "Validation failed", details: err.issues }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to update UMKM", err}, { status: 500 });
    }
}

// delete profile umkm
export async function DELETE(context: { params: Promise<{ id: string }> }){
    try {
        const { id } = await context.params;
        const db = await connectMongo();
        const collection = db.collection("umkm_profiles");

        // @ts-expect-error cast _id to UUID
        const result = await collection.deleteOne({ _id: new UUID(id) });
        return NextResponse.json({ message: "UMKM Berhasil Dihapus", deletedCount: result.deletedCount }, { status: 200 });
    }
    catch { return NextResponse.json({ error: "Failed to delete UMKM" }, { status: 500 }); }
}