import { connectCassandra, connectMongo } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

/**
 * GET /api/analytics/forecast
 * Get forecast/predictions by scope
 * Query params:
 *   - scope: 'global' (admin), 'region' (pejabat), 'own' (owner)
 */
export async function GET(req: NextRequest) {
  const { user } = await requireAuth(["ADMIN", "PEJABAT", "UMKM_OWNER"], true);

  const scope = req.nextUrl.searchParams.get("scope") || "global";

  try {
    const cassandra = await connectCassandra();
    const mongo = await connectMongo();

    // Simple forecast: calculate average growth rate and project next 3 months
    function generateForecast(historicalData: any[]) {
      if (historicalData.length < 3) {
        return [];
      }

      const recentData = historicalData.slice(0, 3);
      const avgOmzet = recentData.reduce((sum, r) => sum + r.omzet, 0) / recentData.length;
      
      // Simple linear trend
      let trend = 0;
      if (historicalData.length >= 6) {
        const older = historicalData.slice(3, 6);
        const avgOlder = older.reduce((sum, r) => sum + r.omzet, 0) / older.length;
        trend = (avgOmzet - avgOlder) / avgOlder;
      }

      const nextMonth = Math.round(avgOmzet * (1 + trend));
      const monthAfter = Math.round(nextMonth * (1 + trend));
      const thirdMonth = Math.round(monthAfter * (1 + trend));

      return [
        { month: 1, predicted_omzet: nextMonth, confidence: 0.75 },
        { month: 2, predicted_omzet: monthAfter, confidence: 0.65 },
        { month: 3, predicted_omzet: thirdMonth, confidence: 0.55 },
      ];
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

    if (!user) {
      // Unauthenticated: aggregated forecast data
      const allUmkms = await mongo
        .collection("umkm_profiles")
        .find({})
        .limit(5)
        .toArray();

      const predictions: any[] = [];

      for (const umkm of allUmkms) {
        const logs = await fetchLogs(umkm._id.toString());

        if (logs.length > 0) {
          const forecast = generateForecast(logs);
          const avgOmzet = logs.reduce((sum, r) => sum + r.omzet, 0) / logs.length;

          predictions.push({
            nama_usaha: umkm.nama_usaha,
            sektor: umkm.sektor,
            current_avg_omzet: Math.round(avgOmzet),
            forecast,
          });
        }
      }

      return NextResponse.json({
        message: "Aggregated forecast data",
        data: { predictions },
      });
    }

    if (user.role === "ADMIN") {
      // Global scope: forecasts for all UMKM
      const allUmkms = await mongo
        .collection("umkm_profiles")
        .find({})
        .toArray();

      const predictions: any[] = [];

      for (const umkm of allUmkms) {
        const logs = await fetchLogs(umkm._id.toString());

        if (logs.length > 0) {
          const forecast = generateForecast(logs);
          const avgOmzet = logs.reduce((sum, r) => sum + r.omzet, 0) / logs.length;

          if (forecast.length > 0) {
            predictions.push({
              nama_usaha: umkm.nama_usaha,
              sektor: umkm.sektor,
              current_avg_omzet: Math.round(avgOmzet),
              forecast: forecast[0], // Next month prediction
            });
          }
        }
      }

      // Sort by predicted growth
      predictions.sort((a, b) => (b.forecast.predicted_omzet - b.current_avg_omzet) - (a.forecast.predicted_omzet - a.current_avg_omzet));

      return NextResponse.json({
        message: "Admin forecast analytics - Global scope",
        data: {
          predictions: predictions.slice(0, 20),
          totalUmkms: allUmkms.length,
        },
      });
    }

    if (user.role === "PEJABAT") {
      // Region scope: forecasts in assigned region
      const allUmkms = await mongo
        .collection("umkm_profiles")
        .find({})
        .toArray();

      const predictions: any[] = [];

      for (const umkm of allUmkms) {
        const logs = await fetchLogs(umkm._id.toString());

        if (logs.length > 0) {
          const forecast = generateForecast(logs);
          const avgOmzet = logs.reduce((sum, r) => sum + r.omzet, 0) / logs.length;

          if (forecast.length > 0) {
            predictions.push({
              nama_usaha: umkm.nama_usaha,
              sektor: umkm.sektor,
              kota: umkm.wilayah?.kota,
              current_avg_omzet: Math.round(avgOmzet),
              forecast: forecast, // Return full array, not just first element
            });
          }
        }
      }

      predictions.sort((a, b) => (b.forecast.predicted_omzet - b.current_avg_omzet) - (a.forecast.predicted_omzet - a.current_avg_omzet));

      return NextResponse.json({
        message: "Pejabat forecast analytics - Region scope",
        data: { 
          predictions: predictions.slice(0, 20),
          totalUmkms: allUmkms.length,
        },
      });
    }

    if (user.role === "UMKM_OWNER") {
      // Own scope: forecast of own UMKM
      const myUmkms = await mongo
        .collection("umkm_profiles")
        .find({ owner_id: user._id })
        .toArray();

      const forecastData: any = {};

      for (const umkm of myUmkms) {
        const logs = await fetchLogs(umkm._id.toString());

        if (logs.length > 0) {
          const forecast = generateForecast(logs);
          const avgOmzet = logs.reduce((sum, r) => sum + r.omzet, 0) / logs.length;

          forecastData[umkm._id] = {
            nama_usaha: umkm.nama_usaha,
            current_avg_omzet: Math.round(avgOmzet),
            historical: logs.slice(0, 12),
            forecast,
          };
        }
      }

      return NextResponse.json({
        message: "Owner forecast analytics - Own scope",
        data: forecastData,
      });
    }

    return NextResponse.json(
      { error: "Invalid scope or role" },
      { status: 400 }
    );
  } catch (err) {
    console.error("Forecast analytics error:", err);
    return NextResponse.json(
      { error: "Failed to fetch forecast data", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
