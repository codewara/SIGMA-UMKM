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

    // For now, return mock data matching the frontend expectations
    // TODO: Implement actual ML-based forecasting from historical financial logs

    if (!user) {
      // Unauthenticated: aggregated forecast data
      return NextResponse.json({
        message: "Aggregated forecast data",
        data: {
          predictions: [
            {
              umkm_id: "example-1",
              nama_usaha: "Industri Contoh",
              predicted_revenue: 100000000,
              confidence: 0.85,
            },
          ],
        },
      });
    }

    if (user.role === "ADMIN") {
      // Global scope: forecasts for all UMKM
      return NextResponse.json({
        message: "Admin forecast analytics - Global scope",
        data: {
          predictions: [],
          trend: "Query AI predictions for all UMKMs",
        },
      });
    }

    if (user.role === "PEJABAT") {
      // Region scope: forecasts in assigned region
      return NextResponse.json({
        message: "Pejabat forecast analytics - Region scope",
        data: {
          predictions: [],
          trend: "Query AI predictions for regional UMKMs",
        },
      });
    }

    if (user.role === "UMKM_OWNER") {
      // Own scope: forecast of own UMKM
      const mongo = await connectMongo();
      const myUmkms = await mongo
        .collection("umkm")
        .find({ owner_id: user._id })
        .toArray();

      return NextResponse.json({
        message: "Owner forecast analytics - Own scope",
        data: {
          myUmkms: myUmkms.map((u: any) => ({
            _id: u._id,
            nama_usaha: u.nama_usaha,
          })),
          forecast: "Generate AI forecast from historical data",
        },
      });
    }

    return NextResponse.json(
      { error: "Invalid scope or role" },
      { status: 400 }
    );
  } catch (err) {
    console.error("Forecast analytics error:", err);
    return NextResponse.json(
      { error: "Failed to fetch forecast data" },
      { status: 500 }
    );
  }
}
