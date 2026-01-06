import { logoutUser } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { sessionToken } = await request.json();

    await logoutUser(sessionToken);
    return NextResponse.json({ message: "Logout successful" });
}