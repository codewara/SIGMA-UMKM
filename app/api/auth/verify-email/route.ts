import { verifyEmail } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const token = request.nextUrl.searchParams.get("token");
        if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

        // Verify Email
        await verifyEmail(token);
        return NextResponse.json({ message: "Email berhasil diverifikasi!" });
    }
    catch { return NextResponse.json({ message: "Token invalid atau kadaluarsa!" }); }
}