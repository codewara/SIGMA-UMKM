import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/services/auth.service';

export async function POST(request: NextRequest) {
    try {
        const { email, password, role } = await request.json();
        if (!email || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

        // Validate role (ADMIN or PEJABAT only - public users don't need accounts)
        const validRoles = ["ADMIN", "PEJABAT"];
        if (!role || !validRoles.includes(role)) {
            return NextResponse.json({ error: "Invalid role. Must be ADMIN or PEJABAT" }, { status: 400 });
        }
        const userRole = role;

        // Register User
        const data = await registerUser(email, password, userRole);

        return NextResponse.json({ message: "User registered successfully", data, role: userRole }, { status: 201 });
    }
    catch (error) {
        if (error instanceof Error && error.message === "USER_EXISTS") {
            return NextResponse.json({ error: "Email already registered" }, { status: 409 });
        }
        return NextResponse.json({ error: "Internal Server Error", errorm: error }, { status: 500 });
    }
}
