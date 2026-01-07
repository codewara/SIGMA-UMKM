import { logoutUser } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    // Get session token from cookie
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;

    if (!sessionToken) {
        return NextResponse.json({ error: "No session found" }, { status: 401 });
    }

    await logoutUser(sessionToken);

    // Clear the session cookie
    cookieStore.delete("session_token");

    return NextResponse.json({ message: "Logout successful" });
}