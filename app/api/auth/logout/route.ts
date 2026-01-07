import { logoutUser } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get('session_token')?.value;
        
        if (sessionToken) {
            await logoutUser(sessionToken);
        }
        
        // Clear session cookie
        const response = NextResponse.json({ message: "Logout successful" });
        response.cookies.set('session_token', '', { maxAge: 0, path: '/' });
        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ message: "Logout successful" });
    }
}