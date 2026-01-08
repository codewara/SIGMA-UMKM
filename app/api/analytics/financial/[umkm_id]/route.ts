import { connectCassandra, connectMongo } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { umkmFinancialLogSchema } from "@/lib/validation/umkm_financial.schema";
import { UUID } from "mongodb";
import { ZodError } from "zod";
import { requireAuth } from "@/lib/auth";
import { requireOwnership } from "@/lib/rbac-helpers";
import { ObjectId } from "mongodb";

// ambil data finansilal umkm by id umkm
// RBAC: ADMIN, PEJABAT, UMKM_OWNER (own only), Unauthenticated (public data only)
export async function GET(req: NextRequest, context: { params: Promise<{ umkm_id: string }> }) {
    const { user, error } = await requireAuth(["ADMIN", "PEJABAT", "UMKM_OWNER"], true);

    // Unauthenticated users can still see basic financial data (omzet, karyawan, bulan, tahun)
    // No flagging info or sensitive details
    
    if (user && user.role === "UMKM_OWNER") {
        const mongo = await connectMongo();
        const umkm = await mongo.collection("umkm").findOne({ _id: new ObjectId(await context.params.then(p => p.umkm_id)) });
        if (!umkm || umkm.owner_id !== user._id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
    }

    try {
        const { umkm_id } = await context.params;

        // UMKM_OWNER: Check ownership
        if (user && user.role === "UMKM_OWNER") {
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
            SELECT umkm_id, tahun, bulan, omzet, jumlah_karyawan, catatan, tanggal_input, is_flagged, flag_reason
            FROM sigma_ks.umkm_financial_log
            WHERE umkm_id = ? AND tahun = ?
            ORDER BY bulan DESC
        `;

        const financialLog = await db.execute(query, [umkm_id, tahun], { prepare: true });
        
        // Ensure omzet is properly converted to number
        const rows = financialLog.rows.map((row: any) => ({
            umkm_id: row.umkm_id,
            tahun: row.tahun,
            bulan: row.bulan,
            omzet: typeof row.omzet === 'number' ? row.omzet : (row.omzet ? parseInt(row.omzet) : 0),
            jumlah_karyawan: typeof row.jumlah_karyawan === 'number' ? row.jumlah_karyawan : (row.jumlah_karyawan ? parseInt(row.jumlah_karyawan) : 0),
            catatan: row.catatan || null,
            tanggal_input: row.tanggal_input,
            is_flagged: row.is_flagged || false,
            flag_reason: row.flag_reason || null
        }));
        
        return NextResponse.json({ message: "Data log finansial UMKM berhasil diambil", data: rows });
    } catch (err) {
        console.error('Financial API Error:', err);
        return NextResponse.json({ error: "Failed to get UMKM financial data", details: err instanceof Error ? err.message : String(err) }, { status: 500 });
    }
}

// input data finansial umkm
// RBAC: ADMIN & PEJABAT & UMKM_OWNER (own only)
export async function POST(req: NextRequest, context: { params: Promise<{ umkm_id: string }> }) {
    const { user, error } = await requireAuth(["ADMIN", "PEJABAT", "UMKM_OWNER"]);
    if (error) return NextResponse.json({ error }, { status: 403 });

    try {
        const { umkm_id } = await context.params;

        // UMKM_OWNER can only submit for their own UMKM
        if (user?.role === "UMKM_OWNER") {
            const mongo = await connectMongo();
            const umkm = await mongo.collection("umkm").findOne({ _id: new ObjectId(umkm_id) });
            if (!umkm || umkm.owner_id !== user._id) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
            }
        }

        // ambil data mongo
        const mongoDb = await connectMongo();
        const umkmCollection = mongoDb.collection("umkm_profiles");
        
        // @ts-expect-error cast _id to UUID
        const umkm = await umkmCollection.findOne({ _id: new UUID(umkm_id), is_deleted: false });
        if (!umkm) {
            return NextResponse.json({ error: "UMKM tidak ditemukan" }, { status: 404 });
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

        await db.execute(query, [umkm_id, parsed.tahun, parsed.bulan, parsed.omzet, parsed.jumlah_karyawan, umkm.nama_usaha, umkm.sektor, user._id]);

        // input data ke DASHBOARD_SECTOR_STATS
        const sectorStatsQuery = `            
            UPDATE dashboard_sector_stats
            SET
                total_omzet = total_omzet + ?,
                total_umkm  = total_umkm + ?
            WHERE sektor = ?
            AND tahun  = ?
            AND bulan  = ?
            IF EXISTS;
        `;
        await db.execute(sectorStatsQuery, [parsed.omzet, 1, umkm.sektor, parsed.tahun, parsed.bulan]);

        // input data ke DASHBOARD_REGION_STATS
        const regionStatsQuery = `
            UPDATE dashboard_region_stats
            SET
                total_omzet = total_omzet + ?,
                total_umkm  = total_umkm + ?
            WHERE kota = ?
            AND tahun  = ?
            AND bulan  = ?
            IF EXISTS;
        `;
        await db.execute(regionStatsQuery, [parsed.omzet, 1, umkm.wilayah.kota, parsed.tahun, parsed.bulan]);

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

        // ambil data mongo
        const mongoDb = await connectMongo();
        const umkmCollection = mongoDb.collection("umkm_profiles");
        // @ts-expect-error cast _id to UUID
        const umkm = await umkmCollection.findOne({ _id: new UUID(umkm_id), is_deleted: false });
        if (!umkm) {
            return NextResponse.json({ error: "UMKM tidak ditemukan" }, { status: 404 });
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

        await db.execute(query, [parsed.omzet, parsed.jumlah_karyawan, umkm.nama_usaha, umkm.sektor, umkm_id, tahun, bulan]);
        
        // Updating the dashboard stats based on changes is complex and not handled here.
        // In a real application, you would need to recalculate the totals or maintain a log of changes.

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
        // ambil log cassandra sebelum dihapus untuk update dashboard stats
        const selectQuery = `
            SELECT omzet, sektor
            FROM umkm_financial_log
            WHERE umkm_id = ? AND tahun = ? AND bulan = ?
        `;

        const selectResult = await db.execute(selectQuery, [umkm_id, tahun, bulan]);
        const logData = selectResult.rows[0];

        // update dashboard_sector_stats
        if (logData) {
            const sectorStatsUpdateQuery = `
                UPDATE dashboard_sector_stats
                SET
                    total_omzet = total_omzet - ?,
                    jumlah_umkm  = jumlah_umkm - 1
                WHERE sektor = ?
                AND tahun  = ?
                AND bulan  = ?
                IF EXISTS;
            `;
            await db.execute(sectorStatsUpdateQuery, [logData.omzet, logData.sektor, tahun, bulan]);
        }

        // update dashboard_region_stats
        // ambil data mongo
        const mongoDb = await connectMongo();
        const umkmCollection = mongoDb.collection("umkm_profiles");
        // @ts-expect-error cast _id to UUID
        const umkm = await umkmCollection.findOne({ _id: new UUID(umkm_id), is_deleted: false });
        if (umkm && logData) {
            const regionStatsUpdateQuery = `
                UPDATE dashboard_region_stats
                SET
                    total_omzet = total_omzet - ?,
                    jumlah_umkm  = jumlah_umkm - 1
                WHERE kota = ?
                AND tahun  = ?
                AND bulan  = ?
                IF EXISTS;
            `;
            await db.execute(regionStatsUpdateQuery, [logData.omzet, umkm.wilayah.kota, tahun, bulan]);
        }

        // delete log cassandra
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