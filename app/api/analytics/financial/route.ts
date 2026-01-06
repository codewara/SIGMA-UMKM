import { connectCassandra } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// ambil semua data finansial umkm
export async function GET(req: NextRequest) {
    const db = await connectCassandra();

    const umkmMetric = await db.execute("SELECT * FROM umkm_financial_log");
    
    if (!umkmMetric) return NextResponse.json({ error: "No UMKM financial metrics found" },{ status: 404 });
    return NextResponse.json({ message: "Data metrik UMKM berhasil diambil", umkmMetric });
}