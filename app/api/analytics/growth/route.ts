import { connectCassandra, connectMongo } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { UUID } from "mongodb";

/**
 * GET /api/analytics/growth
 * Get growth metrics by scope
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
      // Unauthenticated: aggregated growth data
      const allUmkms = await mongo.collection("umkm_profiles").find({}).toArray();
      
      return NextResponse.json({
        message: "Aggregated growth data",
        data: {
          totalUmkms: allUmkms.length,
          topGrowers: [],
          sectorGrowth: [],
        },
      });
    }

    // Helper function to fetch and sort financial logs
    const fetchLogs = async (umkmId: string) => {
      const logs: any[] = [];
      for (let tahun = 2024; tahun <= 2026; tahun++) {
        const query = `
          SELECT bulan, omzet
          FROM sigma_ks.umkm_financial_log
          WHERE umkm_id = ? AND tahun = ?
        `;
        const result = await cassandra.execute(query, [umkmId, tahun], { prepare: true });
        logs.push(...result.rows.map((r: any) => ({ ...r, omzet: Number(r.omzet) || 0, tahun })));
      }
      return logs.sort((a, b) => b.tahun - a.tahun || b.bulan - a.bulan);
    };

    if (user.role === "ADMIN") {
      // Global scope: all UMKM growth
      const allUmkms = await mongo.collection("umkm_profiles").find({}).toArray();
      
      const growthData: any[] = [];
      
      // Calculate growth for each UMKM
      for (const umkm of allUmkms) {
        const logs = await fetchLogs(umkm._id.toString());
        
        if (logs.length >= 2) {
          const latest = logs[0];
          const previous = logs[Math.min(11, logs.length - 1)]; // 12 months ago or oldest
          
          const growthRate = ((latest.omzet - previous.omzet) / previous.omzet) * 100;
          
          growthData.push({
            nama_usaha: umkm.nama_usaha,
            sektor: umkm.sektor,
            growth_rate: Math.round(growthRate * 10) / 10,
            latest_omzet: latest.omzet,
          });
        }
      }
      
      // Sort by growth rate
      growthData.sort((a, b) => b.growth_rate - a.growth_rate);
      
      // Group by sector
      const sectorGrowth: { [key: string]: any } = {};
      for (const data of growthData) {
        if (!sectorGrowth[data.sektor]) {
          sectorGrowth[data.sektor] = { growth_rates: [], count: 0 };
        }
        sectorGrowth[data.sektor].growth_rates.push(data.growth_rate);
        sectorGrowth[data.sektor].count++;
      }
      
      const sectorAvg = Object.entries(sectorGrowth).map(([sektor, data]: any) => ({
        sektor,
        avg_growth: Math.round((data.growth_rates.reduce((a: number, b: number) => a + b) / data.growth_rates.length) * 10) / 10,
        umkm_count: data.count,
      }));

      return NextResponse.json({
        message: "Admin growth analytics - Global scope",
        data: {
          totalUmkms: allUmkms.length,
          topGrowers: growthData.slice(0, 10),
          sectorGrowth: sectorAvg,
        },
      });
    }

    if (user.role === "PEJABAT") {
      // Region scope: growth in assigned region
      const allUmkms = await mongo.collection("umkm_profiles").find({}).toArray();
      
      const growthData: any[] = [];
      
      for (const umkm of allUmkms) {
        const logs = await fetchLogs(umkm._id.toString());
        
        if (logs.length >= 2) {
          const latest = logs[0];
          const previous = logs[Math.min(11, logs.length - 1)];
          
          const growthRate = ((latest.omzet - previous.omzet) / previous.omzet) * 100;
          
          growthData.push({
            nama_usaha: umkm.nama_usaha,
            sektor: umkm.sektor,
            kota: umkm.wilayah?.kota,
            growth_rate: Math.round(growthRate * 10) / 10,
          });
        }
      }
      
      growthData.sort((a, b) => b.growth_rate - a.growth_rate);
      
      // Calculate sector averages
      const sectorGrowth: { [key: string]: any } = {};
      for (const data of growthData) {
        if (!sectorGrowth[data.sektor]) {
          sectorGrowth[data.sektor] = { growth_rates: [], count: 0 };
        }
        sectorGrowth[data.sektor].growth_rates.push(data.growth_rate);
        sectorGrowth[data.sektor].count++;
      }
      
      const sectorAvg = Object.entries(sectorGrowth).map(([sektor, data]: any) => ({
        sektor,
        avg_growth: Math.round((data.growth_rates.reduce((a: number, b: number) => a + b) / data.growth_rates.length) * 10) / 10,
        umkm_count: data.count,
      }));

      return NextResponse.json({
        message: "Pejabat growth analytics - Region scope",
        data: {
          totalUmkms: allUmkms.length,
          topGrowers: growthData.slice(0, 10),
          sectorGrowth: sectorAvg,
        },
      });
    }

    if (user.role === "UMKM_OWNER") {
      // Own scope: growth of own UMKM
      // @ts-expect-error cast user._id to UUID for comparison
      const myUmkms = await mongo
        .collection("umkm_profiles")
        .find({ owner_id: new UUID(user._id) })
        .toArray();

      const growthData: any = {};

      for (const umkm of myUmkms) {
        const logs = await fetchLogs(umkm._id.toString());
        
        if (logs.length >= 2) {
          const latest = logs[0];
          const previous = logs[Math.min(11, logs.length - 1)];
          
          const growthRate = ((latest.omzet - previous.omzet) / previous.omzet) * 100;
          
          growthData[umkm._id] = {
            nama_usaha: umkm.nama_usaha,
            sektor: umkm.sektor,
            growth_rate: Math.round(growthRate * 10) / 10,
            latest_omzet: latest.omzet,
            logs: logs.slice(0, 12),
          };
        }
      }

      return NextResponse.json({
        message: "Owner growth analytics - Own scope",
        data: {
          totalUmkms: Object.keys(growthData).length,
          topGrowers: Object.values(growthData),
          sectorGrowth: [],
        },
      });
    }

    return NextResponse.json(
      { error: "Invalid scope or role" },
      { status: 400 }
    );
  } catch (err) {
    console.error("Growth analytics error:", err);
    return NextResponse.json(
      { error: "Failed to fetch growth data", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
