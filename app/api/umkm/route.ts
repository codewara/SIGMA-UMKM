import { connectMongo } from "@/lib/db";
import { umkmProfileSchema } from "@/lib/validation/umkm_profile.schema";
import { NextRequest, NextResponse } from "next/server";

// ambil list data umkm
export async function GET(req: NextRequest) {
    const db = await connectMongo();

    const umkmCollection = db.collection("umkm_profiles");
    const data = await umkmCollection.find().toArray();

    return NextResponse.json({ message: "UMKM API is working", data });
}

// create (regist) data umkm baru
export async function POST(req: NextRequest) {
    try {
        const db = await connectMongo();
        
        const umkmCollection = db.collection("umkm_profiles");
        const reqBody = await req.json();
    
        // validasi data
        const parsed = umkmProfileSchema.parse(reqBody);
    
        const newUmkm = {
            ...parsed,
            tanggal_bergabung: new Date(),
            summary_terakhir: null,
        }
    
        await umkmCollection.insertOne(newUmkm);
    
        return NextResponse.json(
            { message: "UMKM Berhasil Didaftarkan", data: newUmkm },
            { status: 201}
        );
    } catch (err: any) {
        if (err?.issues) {
            return NextResponse.json(
                { error: "Validation failed", details: err.issues },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to create UMKM" },
            { status: 500 }
        );
  }
}