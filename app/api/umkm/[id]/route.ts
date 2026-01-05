import { connectMongo } from "@/lib/db";
import { umkmUpdateSchema } from "@/lib/validation/umkm_profile.schema";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

// get profile umkm by id
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }>}) {
    const { id } = await context.params; 
    const db = await connectMongo();

    const umkmCollection = db.collection("umkm_profiles");
    const umkm = await umkmCollection.findOne({ _id: new ObjectId(id) });
    if (!umkm) {
        return NextResponse.json(
            { error: "UMKM not found" },
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
            {_id: new ObjectId(id)},
            { $set: parsed },
            { returnDocument: "after" }
        );
        return NextResponse.json(result!);
    } catch (err: any) {
        if (err?.issues) {
            return NextResponse.json(
                { error: "Validation failed", details: err.issues },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to update UMKM", err},
            { status: 500 }
        );
    }
}

// delete profile umkm
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }){
    try {
        const { id } = await context.params;
        const db = await connectMongo();
        const collection = db.collection("umkm_profiles");

        const result = await collection.deleteOne({_id: new ObjectId(id)});
        return NextResponse.json(
            { message: "UMKM Berhasil Dihapus", deletedCount: result.deletedCount },
            { status: 200 }
        );
    } catch (err: any){
        return NextResponse.json(
            { error: "Failed to delete UMKM" },
            { status: 500 }
        );
    }
}