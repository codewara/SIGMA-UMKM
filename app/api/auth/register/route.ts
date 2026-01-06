import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/services/auth.service';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();
        if (!email || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

        // Register User
        const data = await registerUser(email, password);

        return NextResponse.json({ message: "User registered successfully", data }, { status: 201 });
    }
    catch (error) {
        if (error instanceof Error && error.message === "USER_EXISTS") {
            return NextResponse.json({ error: "Email already registered" }, { status: 409 });
        }
        return NextResponse.json({ error: "Internal Server Error", errorm: error }, { status: 500 });
    }
}
