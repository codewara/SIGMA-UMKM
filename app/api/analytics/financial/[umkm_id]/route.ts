import { connectCassandra, connectMongo } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { umkmFinancialLogSchema } from "@/lib/validation/umkm_financial.schema";
import { ZodError } from "zod";
import { requireAuth } from "@/lib/auth";
import { requireOwnership } from "@/lib/rbac-helpers";

// ambil data finansilal umkm by id umkm
// RBAC: ADMIN, PEJABAT, UMKM_OWNER (own only)
export async function GET(req: NextRequest, context: { params: Promise<{ umkm_id: string }> }) {
    const { user, error } = await requireAuth(["ADMIN", "PEJABAT", "UMKM_OWNER"]);
    if (error || !user) return NextResponse.json({ error: error || "Unauthorized" }, { status: 403 });

    try {
        const { umkm_id } = await context.params;

        // UMKM_OWNER: Check ownership
        if (user.role === "UMKM_OWNER") {
            const isOwner = await requireOwnership(user._id, umkm_id);
            if (!isOwner) {
                return NextResponse.json({ error: "You don't own this UMKM" }, { status: 403 });
            }
        }

        const tahunParam = req.nextUrl.searchParams.get('tahun');
        const tahun = tahunParam ? parseInt(tahunParam, 10) : new Date().getFullYear();
        if (Number.isNaN(tahun)) {
            return NextResponse.json({ error: "Parameter 'tahun' tidak valid" }, { status: 400 });
        }

        const db = await connectCassandra();
        const query = `
            SELECT umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, 
                   nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by
            FROM umkm_financial_log 
            WHERE umkm_id = ? AND tahun = ?
            ORDER BY bulan DESC
        `;

        const financialLog = await db.execute(query, [umkm_id, tahun]);
        return NextResponse.json({ message: "Data log finansial UMKM berhasil diambil", financialLog });
    } catch (err) {
        return NextResponse.json({ error: "Failed to get UMKM financial data", err }, { status: 500 });
    }
}

// input data finansial umkm
// RBAC: ADMIN, PEJABAT, UMKM_OWNER (own only)
export async function POST(req: NextRequest, context: { params: Promise<{ umkm_id: string }> }) {
    const { user, error } = await requireAuth(["ADMIN", "PEJABAT", "UMKM_OWNER"]);
    if (error || !user) return NextResponse.json({ error: error || "Unauthorized" }, { status: 403 });

    try {
        const { umkm_id } = await context.params;

        // UMKM_OWNER: Check ownership
        if (user.role === "UMKM_OWNER") {
            const isOwner = await requireOwnership(user._id, umkm_id);
            if (!isOwner) {
                return NextResponse.json({ error: "You don't own this UMKM" }, { status: 403 });
            }
        }

        // validasi data
        const reqBody = await req.json();
        const parsed = umkmFinancialLogSchema.parse(reqBody);

        const db = await connectCassandra();
        const query = `
            INSERT INTO umkm_financial_log (
                umkm_id, tahun, bulan, omzet, jumlah_karyawan, nama_usaha, sektor, 
                tgl_input, is_flagged, flag_reason, flagged_by, flagged_at, input_by
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, toTimestamp(now()), false, null, null, null, ?)
        `;

        await db.execute(query, [
            umkm_id,
            parsed.tahun,
            parsed.bulan,
            parsed.omzet,
            parsed.jumlah_karyawan,
            parsed.nama_usaha,
            parsed.sektor,
            user._id // input_by
        ]);

        return NextResponse.json({ message: "Data log finansial UMKM berhasil ditambahkan", data: parsed }, { status: 201 });
    } catch (err) {
        if (err instanceof ZodError) {
            return NextResponse.json({ error: "Validation failed", details: err.issues }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to create UMKM financial log", err }, { status: 500 });
    }
}

// update data finansial umkm
// RBAC: ADMIN only
export async function PATCH(req: NextRequest, context: { params: Promise<{ umkm_id: string }> }) {
    const { user, error } = await requireAuth(["ADMIN"]);
    if (error) return NextResponse.json({ error }, { status: 403 });

    try {
        const { umkm_id } = await context.params;
        const tahunParam = req.nextUrl.searchParams.get('tahun');
        const bulanParam = req.nextUrl.searchParams.get('bulan');
        const tahun = tahunParam ? parseInt(tahunParam, 10) : null;
        const bulan = bulanParam ? parseInt(bulanParam, 10) : null;
        if (tahun === null || bulan === null || Number.isNaN(tahun) || Number.isNaN(bulan)) {
            return NextResponse.json(
                { error: "Parameter 'tahun' dan 'bulan' harus disediakan dan valid" },
                { status: 400 }
            )
        }

        // validasi data
        const reqBody = await req.json();
        const parsed = umkmFinancialLogSchema.partial().parse(reqBody);

        const db = await connectCassandra();
        const query = `
            UPDATE umkm_financial_log
            SET omzet = ?, jumlah_karyawan = ?, nama_usaha = ?, sektor = ?
            WHERE umkm_id = ? AND tahun = ? AND bulan = ?
        `;

        await db.execute(query, [parsed.omzet, parsed.jumlah_karyawan, parsed.nama_usaha, parsed.sektor, umkm_id, tahun, bulan]);
        return NextResponse.json({ message: "Data log finansial UMKM berhasil diupdate", data: parsed });
    } catch (err) {
        if (err instanceof ZodError) {
            return NextResponse.json({ error: "Validation failed", details: err.issues }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to update UMKM financial log", err }, { status: 500 });
    }
}

// delete data finansial umkm
// RBAC: ADMIN only
export async function DELETE(req: NextRequest, context: { params: Promise<{ umkm_id: string }> }) {
    const { user, error } = await requireAuth(["ADMIN"]);
    if (error) return NextResponse.json({ error }, { status: 403 });

    try {
        const { umkm_id } = await context.params;
        const tahunParam = req.nextUrl.searchParams.get('tahun');
        const bulanParam = req.nextUrl.searchParams.get('bulan');
        const tahun = tahunParam ? parseInt(tahunParam, 10) : null;
        const bulan = bulanParam ? parseInt(bulanParam, 10) : null;
        if (tahun === null || bulan === null || Number.isNaN(tahun) || Number.isNaN(bulan)) {
            return NextResponse.json(
                { error: "Parameter 'tahun' dan 'bulan' harus disediakan dan valid" },
                { status: 400 }
            )
        }

        const db = await connectCassandra();
        const query = `
            DELETE FROM umkm_financial_log
            WHERE umkm_id = ? AND tahun = ? AND bulan = ?
        `;

        await db.execute(query, [umkm_id, tahun, bulan]);
        return NextResponse.json({ message: "Data log finansial UMKM berhasil dihapus" });
    } catch (err) {
        return NextResponse.json({ error: "Failed to delete UMKM financial log", err }, { status: 500 });
    }
}