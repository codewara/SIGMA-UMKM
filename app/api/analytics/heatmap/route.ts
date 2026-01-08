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

    if (!user) {
      // Unauthenticated: aggregated heatmap data
      const allUmkms = await mongo
        .collection("umkm_profiles")
        .find({ "lokasi.coordinates": { $exists: true } })
        .toArray();

      // Group by kota
      const byCity: { [key: string]: number } = {};
      for (const umkm of allUmkms) {
        const city = umkm.wilayah?.kota || "Unknown";
        byCity[city] = (byCity[city] || 0) + 1;
      }

      return NextResponse.json({
        message: "Aggregated heatmap data",
        data: {
          totalUmkms: allUmkms.length,
          byCity: Object.entries(byCity).map(([city, count]) => ({ city, count })),
          umkms: allUmkms.slice(0, 50).map((u: any) => ({
            nama: u.nama_usaha,
            lat: u.lokasi?.coordinates[1],
            lng: u.lokasi?.coordinates[0],
            sektor: u.sektor,
          })),
        },
      });
    }

    if (user.role === "ADMIN") {
      // Global scope: heatmap of all regions
      const allUmkms = await mongo
        .collection("umkm_profiles")
        .find({})
        .toArray();

      // Group by kota
      const byCity: { [key: string]: any } = {};
      const umkmsWithLocation: any[] = [];
      
      for (const umkm of allUmkms) {
        const city = umkm.wilayah?.kota || "Unknown";
        
        if (!byCity[city]) {
          byCity[city] = {
            count: 0,
            lat: umkm.lokasi?.coordinates[1] || 0,
            lng: umkm.lokasi?.coordinates[0] || 0,
          };
        }
        byCity[city].count++;
        
        if (umkm.lokasi?.coordinates) {
          umkmsWithLocation.push({
            nama_usaha: umkm.nama_usaha,
            sektor: umkm.sektor,
            kota: city,
            lat: umkm.lokasi.coordinates[1],
            lng: umkm.lokasi.coordinates[0],
          });
        }
      }

      return NextResponse.json({
        message: "Admin heatmap - Global scope",
        data: {
          totalUmkms: allUmkms.length,
          umkmsWithLocation: umkmsWithLocation.length,
          clusters: Object.entries(byCity).map(([city, data]: any) => ({
            city,
            count: data.count,
            lat: data.lat,
            lng: data.lng,
          })),
          umkms: umkmsWithLocation.slice(0, 100),
        },
      });
    }

    if (user.role === "PEJABAT") {
      // Region scope: heatmap of assigned region
      const allUmkms = await mongo
        .collection("umkm_profiles")
        .find({})
        .toArray();

      const umkmsWithLocation: any[] = [];
      const byCity: { [key: string]: any } = {};
      
      for (const umkm of allUmkms) {
        const city = umkm.wilayah?.kota || "Unknown";
        
        if (!byCity[city]) {
          byCity[city] = {
            count: 0,
            lat: umkm.lokasi?.coordinates[1] || 0,
            lng: umkm.lokasi?.coordinates[0] || 0,
          };
        }
        byCity[city].count++;
        
        if (umkm.lokasi?.coordinates) {
          umkmsWithLocation.push({
            nama_usaha: umkm.nama_usaha,
            sektor: umkm.sektor,
            kota: city,
            lat: umkm.lokasi.coordinates[1],
            lng: umkm.lokasi.coordinates[0],
          });
        }
      }

      return NextResponse.json({
        message: "Pejabat heatmap - Region scope",
        data: {
          totalUmkms: allUmkms.length,
          umkmsWithLocation: umkmsWithLocation.length,
          clusters: Object.entries(byCity).map(([city, data]: any) => ({
            city,
            count: data.count,
            lat: data.lat,
            lng: data.lng,
          })),
          umkms: umkmsWithLocation.slice(0, 100),
        },
      });
    }

    if (user.role === "UMKM_OWNER") {
      // Own scope: competitor map around own location
      const myUmkms = await mongo
        .collection("umkm_profiles")
        .find({ owner_id: user._id })
        .toArray();

      if (myUmkms.length === 0) {
        return NextResponse.json({
          message: "No UMKM found",
          data: { clusters: [], totalUmkms: 0, myUmkms: [], competitors: [] },
        });
      }

      const myLocations = myUmkms.filter(u => u.lokasi?.coordinates).map(u => ({
        _id: u._id,
        nama_usaha: u.nama_usaha,
        lat: u.lokasi.coordinates[1],
        lng: u.lokasi.coordinates[0],
      }));

      if (myLocations.length === 0) {
        return NextResponse.json({
          message: "Location not set",
          data: { clusters: [], totalUmkms: 0, myUmkms: [], competitors: [] },
        });
      }

      // Find competitors near first UMKM location
      const myLocation = myUmkms[0].lokasi?.coordinates;
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
          owner_id: { $ne: user._id },
        })
        .limit(20)
        .toArray();

      // Group competitors by city
      const byCity: { [key: string]: any } = {};
      for (const competitor of competitors) {
        const city = competitor.wilayah?.kota || "Unknown";
        
        if (!byCity[city]) {
          byCity[city] = {
            count: 0,
            lat: competitor.lokasi?.coordinates[1] || 0,
            lng: competitor.lokasi?.coordinates[0] || 0,
          };
        }
        byCity[city].count++;
      }

      return NextResponse.json({
        message: "Owner heatmap - Competitor map",
        data: {
          totalUmkms: competitors.length,
          clusters: Object.entries(byCity).map(([city, data]: any) => ({
            city,
            count: data.count,
            lat: data.lat,
            lng: data.lng,
          })),
          myUmkms: myLocations,
          competitors: competitors.map((c: any) => ({
            nama_usaha: c.nama_usaha,
            sektor: c.sektor,
            kota: c.wilayah?.kota,
            lat: c.lokasi?.coordinates[1],
            lng: c.lokasi?.coordinates[0],
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
      { error: "Failed to fetch heatmap data", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
