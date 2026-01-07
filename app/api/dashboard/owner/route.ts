import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { connectMongo, connectCassandra } from "@/lib/db";

// Get owner dashboard statistics
// RBAC: UMKM_OWNER only
export async function GET() {
    const { user, error } = await requireAuth(["UMKM_OWNER"]);
    if (error || !user) return NextResponse.json({ error: error || "Unauthorized" }, { status: 403 });

    try {
        const mongoDB = await connectMongo();
        const cassandraDB = await connectCassandra();

        // Count total UMKMs owned by this user
        const totalUMKMs = await mongoDB
            .collection("umkm_profiles")
            .countDocuments({ owner_id: user._id, is_deleted: false });

        // Count pending verifications
        const pendingVerifications = await mongoDB
            .collection("umkm_profiles")
            .countDocuments({
                owner_id: user._id,
                "legalitas.status_verifikasi": "PENDING",
                is_deleted: false,
            });

        // Get owned UMKM IDs
        const umkmList = await mongoDB
            .collection("umkm_profiles")
            .find({ owner_id: user._id, is_deleted: false }, { projection: { _id: 1 } })
            .toArray();

        const umkmIds = umkmList.map((u) => u._id.toString());

        // Count flagged financial data across all owned UMKMs
        let flaggedCount = 0;
        for (const umkmId of umkmIds) {
            const currentYear = new Date().getFullYear();
            const query = `
                SELECT COUNT(*) as count
                FROM umkm_financial_log
                WHERE umkm_id = ? AND tahun = ? AND is_flagged = true
                ALLOW FILTERING
            `;
            const result = await cassandraDB.execute(query, [umkmId, currentYear]);
            if (result.rows[0]) {
                flaggedCount += parseInt(result.rows[0].count.toString());
            }
        }

        // Get recent revenues (last 3 months across all owned UMKMs)
        const recentRevenues: any[] = [];
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;

        for (const umkmId of umkmIds) {
            const query = `
                SELECT umkm_id, tahun, bulan, omzet, nama_usaha, tgl_input
                FROM umkm_financial_log
                WHERE umkm_id = ? AND tahun = ?
                ORDER BY bulan DESC
                LIMIT 3
            `;
            const result = await cassandraDB.execute(query, [umkmId, currentYear]);
            recentRevenues.push(...result.rows);
        }

        // Sort by date descending and limit to 10 most recent
        recentRevenues.sort((a, b) => {
            const dateA = new Date(a.tgl_input);
            const dateB = new Date(b.tgl_input);
            return dateB.getTime() - dateA.getTime();
        });

        return NextResponse.json({
            message: "Dashboard statistics retrieved",
            data: {
                totalUMKMs,
                pendingVerifications,
                flaggedData: flaggedCount,
                recentRevenues: recentRevenues.slice(0, 10),
            },
        });
    } catch (err) {
        console.error("Dashboard error:", err);
        return NextResponse.json({ error: "Failed to get dashboard statistics" }, { status: 500 });
    }
}
