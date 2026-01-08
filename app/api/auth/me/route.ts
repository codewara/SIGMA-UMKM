import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json({ authenticated: false, user: null });
    }

    return NextResponse.json({
        authenticated: true,
        user: {
            _id: user._id,
            email: user.email,
            username: user.email.split('@')[0] || user.email,
            role: user.role,
            account_status: user.account_status
        }
    });
}
