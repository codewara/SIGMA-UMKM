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

    // Extract query parameters
    const statusParam = req.nextUrl.searchParams.get('status');
    const sektorParam = req.nextUrl.searchParams.get('sektor');
    const kotaParam = req.nextUrl.searchParams.get('kota');
    const provinsiParam = req.nextUrl.searchParams.get('provinsi');
    const pageParam = req.nextUrl.searchParams.get('page');
    const limitParam = req.nextUrl.searchParams.get('limit');

    // Pagination setup
    const page = pageParam ? parseInt(pageParam) : 1;
    const limit = limitParam ? parseInt(limitParam) : 0; // 0 = no limit
    const skip = limit > 0 ? (page - 1) * limit : 0;

    // Unauthenticated & UMKM_OWNER: Only show verified UMKMs (basic public info)
    if (!user || user.role === "UMKM_OWNER") {
        const filter: any = { "legalitas.status_verifikasi": "VERIFIED", is_deleted: false };

        // Apply filters
        if (sektorParam) filter.sektor = sektorParam;
        if (kotaParam) filter["wilayah.kota"] = kotaParam;
        if (provinsiParam) filter["wilayah.provinsi"] = provinsiParam;

        let query = umkmCollection.find(filter, {
            projection: {
                nama_usaha: 1,
                sektor: 1,
                "wilayah.kota": 1,
                "wilayah.provinsi": 1,
                "wilayah.alamat_lengkap": 1,
                tanggal_bergabung: 1,
                "legalitas.status_verifikasi": 1
            }
        });

        if (skip > 0) query = query.skip(skip);
        if (limit > 0) query = query.limit(limit);

        const data = await query.toArray();
        return NextResponse.json({ message: "Public UMKM list", data });
    }

    // ADMIN & PEJABAT: Full data with optional filters
    const filter: any = { is_deleted: false };

    if (statusParam && ["PENDING", "VERIFIED", "REJECTED"].includes(statusParam)) {
        filter["legalitas.status_verifikasi"] = statusParam;
    }
    if (sektorParam) filter.sektor = sektorParam;
    if (kotaParam) filter["wilayah.kota"] = kotaParam;
    if (provinsiParam) filter["wilayah.provinsi"] = provinsiParam;

    let query = umkmCollection.find(filter);
    if (skip > 0) query = query.skip(skip);
    if (limit > 0) query = query.limit(limit);

    const data = await query.toArray();
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
