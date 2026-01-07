import { umkmProfileSchema } from "@/lib/validation/umkm_profile.schema";
import { connectMongo } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { requireAuth } from "@/lib/auth";

// ambil list data umkm
// RBAC: ADMIN, PEJABAT (full), UMUM (restricted - without sensitive data)
export async function GET() {
    const { user, error } = await requireAuth(["ADMIN", "PEJABAT", "UMUM"]);

    const db = await connectMongo();
    const umkmCollection = db.collection("umkm_profiles");

    // UMUM: Only show basic info
    if (!user || user.role === "UMUM") {
        const data = await umkmCollection
            .find({}, { projection: { nama_usaha: 1, sektor: 1, "wilayah.kota": 1 } })
            .toArray();
        return NextResponse.json({ message: "Public UMKM list", data });
    }

    // ADMIN & PEJABAT: Full data
    const data = await umkmCollection.find().toArray();
    return NextResponse.json({ message: "UMKM list", data, user: { role: user.role, email: user.email } });
}

// create (regist) data umkm baru
// RBAC: ADMIN only
export async function POST(req: NextRequest) {
    const { user, error } = await requireAuth(["ADMIN"]);
    if (error) return NextResponse.json({ error }, { status: 403 });

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
        return NextResponse.json({ message: "UMKM Berhasil Didaftarkan", data: newUmkm }, { status: 201 });
    } catch (err) {
        if (err instanceof ZodError) {
            return NextResponse.json({ error: "Validation failed", details: err.issues }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to create UMKM" }, { status: 500 });
    }
}
