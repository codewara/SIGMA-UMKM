import { connectCassandra, connectMongo } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

/**
 * GET /api/analytics/revenue
 * Get revenue metrics by scope
 * Query params:
 *   - scope: 'global' (admin), 'region' (pejabat), 'own' (owner)
 */
export async function GET(req: NextRequest) {
  const { user } = await requireAuth(["ADMIN", "PEJABAT", "UMKM_OWNER"], true);

  const scope = req.nextUrl.searchParams.get("scope") || "global";

  try {
    const cassandra = await connectCassandra();
    const mongo = await connectMongo();

    if (!user) {
      // Unauthenticated: aggregated revenue data
      const allUmkms = await mongo.collection("umkm_profiles").find({}).toArray();
      
      const byMonth: { [key: string]: number } = {};
      let totalRevenue = 0;

      // Fetch all financial logs for all UMKMs
      for (const umkm of allUmkms) {
        for (let tahun = 2024; tahun <= 2026; tahun++) {
          const query = `
            SELECT bulan, omzet
            FROM sigma_ks.umkm_financial_log
            WHERE umkm_id = ? AND tahun = ?
          `;
          const result = await cassandra.execute(query, [umkm._id.toString(), tahun], { prepare: true });
          
          for (const row of result.rows) {
            const omzetValue = Number(row.omzet) || 0; // Ensure it's a number
            const key = `${tahun}-${row.bulan}`;
            byMonth[key] = (byMonth[key] || 0) + omzetValue;
            totalRevenue += omzetValue;
          }
        }
      }

      const byMonthArray = Object.entries(byMonth)
        .map(([key, omzet]) => {
          const [tahun, bulan] = key.split('-').map(Number);
          return { tahun, bulan, omzet };
        })
        .sort((a, b) => b.tahun - a.tahun || b.bulan - a.bulan)
        .slice(0, 12);

      return NextResponse.json({
        message: "Aggregated revenue data",
        data: {
          totalRevenue,
          byMonth: byMonthArray,
        },
      });
    }

    if (user.role === "ADMIN") {
      // Global scope: all UMKM revenue
      const allUmkms = await mongo.collection("umkm_profiles").find({}).toArray();
      
      const byMonth: { [key: string]: number } = {};
      const bySector: { [key: string]: number } = {};
      let totalRevenue = 0;

      // Fetch all financial logs
      for (const umkm of allUmkms) {
        for (let tahun = 2024; tahun <= 2026; tahun++) {
          const query = `
            SELECT bulan, omzet
            FROM sigma_ks.umkm_financial_log
            WHERE umkm_id = ? AND tahun = ?
          `;
          const result = await cassandra.execute(query, [umkm._id.toString(), tahun], { prepare: true });
          
          for (const row of result.rows) {
            const omzetValue = Number(row.omzet) || 0;
            const key = `${tahun}-${row.bulan}`;
            byMonth[key] = (byMonth[key] || 0) + omzetValue;
            bySector[umkm.sektor] = (bySector[umkm.sektor] || 0) + omzetValue;
            totalRevenue += omzetValue;
          }
        }
      }

      const byMonthArray = Object.entries(byMonth)
        .map(([key, omzet]) => {
          const [tahun, bulan] = key.split('-').map(Number);
          return { tahun, bulan, omzet };
        })
        .sort((a, b) => b.tahun - a.tahun || b.bulan - a.bulan);

      return NextResponse.json({
        message: "Admin revenue analytics - Global scope",
        data: {
          totalRevenue,
          umkmCount: allUmkms.length,
          byMonth: byMonthArray.slice(0, 12),
          bySector: Object.entries(bySector).map(([sektor, revenue]) => ({ sektor, revenue })),
        },
      });
    }

    if (user.role === "PEJABAT") {
      // Region scope: revenue in assigned region
      const allUmkms = await mongo.collection("umkm_profiles").find({}).toArray();
      
      const byMonth: { [key: string]: number } = {};
      const bySector: { [key: string]: number } = {};
      let totalRevenue = 0;

      // Fetch all financial logs
      for (const umkm of allUmkms) {
        for (let tahun = 2024; tahun <= 2026; tahun++) {
          const query = `
            SELECT bulan, omzet
            FROM sigma_ks.umkm_financial_log
            WHERE umkm_id = ? AND tahun = ?
          `;
          const result = await cassandra.execute(query, [umkm._id.toString(), tahun], { prepare: true });
          
          for (const row of result.rows) {
            const omzetValue = Number(row.omzet) || 0;
            const key = `${tahun}-${row.bulan}`;
            byMonth[key] = (byMonth[key] || 0) + omzetValue;
            bySector[umkm.sektor] = (bySector[umkm.sektor] || 0) + omzetValue;
            totalRevenue += omzetValue;
          }
        }
      }

      const byMonthArray = Object.entries(byMonth)
        .map(([key, omzet]) => {
          const [tahun, bulan] = key.split('-').map(Number);
          return { tahun, bulan, omzet };
        })
        .sort((a, b) => b.tahun - a.tahun || b.bulan - a.bulan);

      return NextResponse.json({
        message: "Pejabat revenue analytics - Region scope",
        data: {
          totalRevenue,
          umkmCount: allUmkms.length,
          byMonth: byMonthArray.slice(0, 12),
          bySector: Object.entries(bySector).map(([sektor, revenue]) => ({ sektor, revenue })),
        },
      });
    }

    if (user.role === "UMKM_OWNER") {
      // Own scope: revenue of own UMKM
      const myUmkms = await mongo
        .collection("umkm_profiles")
        .find({ owner_id: user._id })
        .toArray();

      const revenueData: any = {};
      const byMonth: { [key: string]: number } = {};
      let totalRevenue = 0;
      
      for (const umkm of myUmkms) {
        for (let tahun = 2024; tahun <= 2026; tahun++) {
          const query = `
            SELECT bulan, omzet
            FROM sigma_ks.umkm_financial_log
            WHERE umkm_id = ? AND tahun = ?
          `;
          const result = await cassandra.execute(query, [umkm._id.toString(), tahun], { prepare: true });
          
          for (const row of result.rows) {
            const omzetValue = Number(row.omzet) || 0;
            const key = `${tahun}-${row.bulan}`;
            byMonth[key] = (byMonth[key] || 0) + omzetValue;
            totalRevenue += omzetValue;
          }
        }
      }

      const byMonthArray = Object.entries(byMonth)
        .map(([key, omzet]) => {
          const [tahun, bulan] = key.split('-').map(Number);
          return { tahun, bulan, omzet };
        })
        .sort((a, b) => b.tahun - a.tahun || b.bulan - a.bulan);

      return NextResponse.json({
        message: "Owner revenue analytics - Own scope",
        data: {
          totalRevenue,
          byMonth: byMonthArray.slice(0, 12),
        },
      });
    }

    return NextResponse.json(
      { error: "Invalid scope or role" },
      { status: 400 }
    );
  } catch (err) {
    console.error("Revenue analytics error:", err);
    return NextResponse.json(
      { error: "Failed to fetch revenue data", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
