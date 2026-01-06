import { connectCassandra, connectMongo } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const type = req.nextUrl.searchParams.get("type") || "default";
    if (type === "mongo") {
        const db = await connectMongo();
        const umkmCollection = db.collection("umkm_profiles");
        const data = await umkmCollection.find().toArray();
        return NextResponse.json({ message: "API is working", dbName: db.databaseName, data });
    }
    if (type === "cassandra") {
        const db = await connectCassandra();
        const query = "SELECT * FROM umkm_financial_log";
        const data = await db.execute(query);
        return NextResponse.json({ message: "API is working", ksName: db.keyspace, data: data.rows });
    }
    return NextResponse.json({ message: "API is working" });
}