import { connectCassandra, connectMongo } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

/**
 * GET /api/analytics/heatmap
 * Get geographic heatmap data by scope
 * Query params:
 *   - scope: 'global' (admin), 'region' (pejabat), 'own' (owner)
 */
export async function GET(req: NextRequest) {
  const { user } = await requireAuth(["ADMIN", "PEJABAT", "UMKM_OWNER"], true);

  const scope = req.nextUrl.searchParams.get("scope") || "global";

  try {
    const mongo = await connectMongo();

    // For now, return mock data matching the frontend expectations
    // TODO: Aggregate geospatial data from umkm_profiles with lokasi GeoJSON

    if (!user) {
      // Unauthenticated: aggregated heatmap data
      return NextResponse.json({
        message: "Aggregated heatmap data",
        data: {
          clusters: [
            {
              lat: -7.9466,
              lng: 112.6426,
              intensity: 5,
              count: 25,
            },
          ],
        },
      });
    }

    if (user.role === "ADMIN") {
      // Global scope: heatmap of all regions
      const allUmkms = await mongo
        .collection("umkm_profiles")
        .find({})
        .toArray();

      return NextResponse.json({
        message: "Admin heatmap - Global scope",
        data: {
          umkms: allUmkms.length,
          clusters: "Aggregate by region/city",
        },
      });
    }

    if (user.role === "PEJABAT") {
      // Region scope: heatmap of assigned region
      // TODO: Get pejabat's assigned region from user profile
      return NextResponse.json({
        message: "Pejabat heatmap - Region scope",
        data: {
          region: "Assigned region",
          clusters: "Aggregate by sub-district/kecamatan",
        },
      });
    }

    if (user.role === "UMKM_OWNER") {
      // Own scope: competitor map around own location
      const mongo = await connectMongo();
      const myUmkms = await mongo
        .collection("umkm_profiles")
        .find({ owner_id: user._id })
        .toArray();

      if (myUmkms.length === 0) {
        return NextResponse.json({
          message: "No UMKM found",
          data: { competitors: [] },
        });
      }

      // Find competitors near first UMKM location
      const myLocation = myUmkms[0].lokasi?.coordinates;
      if (!myLocation) {
        return NextResponse.json({
          message: "Location not set",
          data: { competitors: [] },
        });
      }

      const competitors = await mongo
        .collection("umkm_profiles")
        .find({
          lokasi: {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: myLocation,
              },
              $maxDistance: 5000, // 5km radius
            },
          },
          owner_id: { $ne: user._id }, // exclude own
        })
        .limit(20)
        .toArray();

      return NextResponse.json({
        message: "Owner heatmap - Competitor map",
        data: {
          myLocation: myLocation,
          competitors: competitors.map((c: any) => ({
            _id: c._id,
            nama_usaha: c.nama_usaha,
            sektor: c.sektor,
            lokasi: c.lokasi,
          })),
        },
      });
    }

    return NextResponse.json(
      { error: "Invalid scope or role" },
      { status: 400 }
    );
  } catch (err) {
    console.error("Heatmap analytics error:", err);
    return NextResponse.json(
      { error: "Failed to fetch heatmap data" },
      { status: 500 }
    );
  }
}
