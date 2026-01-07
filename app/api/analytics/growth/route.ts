import { connectCassandra, connectMongo } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

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

    // For now, return mock data matching the frontend expectations
    // TODO: Implement actual growth calculation from umkm_financial_log

    if (!user) {
      // Unauthenticated: aggregated growth data
      return NextResponse.json({
        message: "Aggregated growth data",
        data: {
          topGrowers: [
            {
              umkm_id: "example-1",
              nama_usaha: "Industri Contoh",
              growth_rate: 25.5,
              sektor: "Makanan",
            },
          ],
          sectorGrowth: [
            { sektor: "Makanan", growth: 15 },
            { sektor: "Kerajinan", growth: 12 },
          ],
        },
      });
    }

    if (user.role === "ADMIN") {
      // Global scope: all UMKM growth
      return NextResponse.json({
        message: "Admin growth analytics - Global scope",
        data: {
          topGrowers: [],
          sectorGrowth: [],
          trend: "Query growth trends globally",
        },
      });
    }

    if (user.role === "PEJABAT") {
      // Region scope: growth in assigned region
      return NextResponse.json({
        message: "Pejabat growth analytics - Region scope",
        data: {
          topGrowers: [],
          sectorGrowth: [],
          trend: "Query growth trends in assigned region",
        },
      });
    }

    if (user.role === "UMKM_OWNER") {
      // Own scope: growth of own UMKM
      const mongo = await connectMongo();
      const myUmkms = await mongo
        .collection("umkm")
        .find({ owner_id: user._id })
        .toArray();

      return NextResponse.json({
        message: "Owner growth analytics - Own scope",
        data: {
          myUmkms: myUmkms.map((u: any) => ({
            _id: u._id,
            nama_usaha: u.nama_usaha,
          })),
          growth: "Calculate growth from financial logs",
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
      { error: "Failed to fetch growth data" },
      { status: 500 }
    );
  }
}
