import { verifyEmail } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const token = request.nextUrl.searchParams.get("token");
        if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

        // Verify Email
        await verifyEmail(token);
        return NextResponse.json({ message: "Email verified successfully" });
    }
    catch (error) {
        if (error instanceof Error && error.message === "INVALID_TOKEN") {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal Server Error", errorm: error }, { status: 500 });
    }
}