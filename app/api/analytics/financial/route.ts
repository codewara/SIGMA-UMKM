import { connectCassandra } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

// ambil semua data finansial umkm (untuk dashboard)
// RBAC: ADMIN & PEJABAT (full), UMUM (aggregated only)
export async function GET(req: NextRequest) {
    const { user } = await requireAuth(["ADMIN", "PEJABAT", "UMUM"]);

    const db = await connectCassandra();

    // UMUM: Return aggregated data only (from dashboard_sector_stats)
    if (!user || user.role === "UMUM") {
        const sectorStats = await db.execute("SELECT * FROM dashboard_sector_stats LIMIT 100");
        return NextResponse.json({
            message: "Public aggregated dashboard data",
            data: sectorStats.rows,
            note: "Aggregated data only for public access"
        });
    }

    // ADMIN & PEJABAT: Full financial data
    const umkmMetric = await db.execute("SELECT * FROM umkm_financial_log LIMIT 100");

    if (!umkmMetric) return NextResponse.json({ error: "No UMKM financial metrics found" }, { status: 404 });
    return NextResponse.json({ message: "Data metrik UMKM berhasil diambil", data: umkmMetric.rows });
}