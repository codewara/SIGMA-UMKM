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

    // For now, return mock data matching the frontend expectations
    // TODO: Implement actual revenue aggregation from umkm_financial_log

    if (!user) {
      // Unauthenticated: aggregated revenue data
      return NextResponse.json({
        message: "Aggregated revenue data",
        data: {
          totalRevenue: 500000000,
          byMonth: [],
          bySector: [
            { sektor: "Makanan", revenue: 250000000 },
            { sektor: "Kerajinan", revenue: 150000000 },
          ],
        },
      });
    }

    if (user.role === "ADMIN") {
      // Global scope: all UMKM revenue
      return NextResponse.json({
        message: "Admin revenue analytics - Global scope",
        data: {
          totalRevenue: 0,
          byMonth: [],
          bySector: [],
        },
      });
    }

    if (user.role === "PEJABAT") {
      // Region scope: revenue in assigned region
      return NextResponse.json({
        message: "Pejabat revenue analytics - Region scope",
        data: {
          totalRevenue: 0,
          byMonth: [],
          bySector: [],
        },
      });
    }

    if (user.role === "UMKM_OWNER") {
      // Own scope: revenue of own UMKM
      const mongo = await connectMongo();
      const myUmkms = await mongo
        .collection("umkm")
        .find({ owner_id: user._id })
        .toArray();

      return NextResponse.json({
        message: "Owner revenue analytics - Own scope",
        data: {
          myUmkms: myUmkms.map((u: any) => ({
            _id: u._id,
            nama_usaha: u.nama_usaha,
          })),
          revenue: "Calculate revenue from financial logs",
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
      { error: "Failed to fetch revenue data" },
      { status: 500 }
    );
  }
}
