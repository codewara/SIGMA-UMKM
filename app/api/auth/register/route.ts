import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/services/auth.service';
import { registerOwnerSchema } from '@/lib/validation/auth.schema';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password, role } = body;

        if (!email || !password) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // Validate role
        const validRoles = ["ADMIN", "PEJABAT", "UMKM_OWNER"];
        if (!role || !validRoles.includes(role)) {
            return NextResponse.json({ error: "Invalid role. Must be ADMIN, PEJABAT, or UMKM_OWNER" }, { status: 400 });
        }

        // UMKM_OWNER requires additional profile fields
        if (role === "UMKM_OWNER") {
            try {
                const parsed = registerOwnerSchema.parse(body);
                const data = await registerUser(
                    parsed.email,
                    parsed.password,
                    "UMKM_OWNER",
                    parsed.profile
                );
                return NextResponse.json({
                    message: "UMKM Owner registered successfully. Please check your email for verification link.",
                    data,
                    role: "UMKM_OWNER"
                }, { status: 201 });
            } catch (err) {
                if (err instanceof ZodError) {
                    return NextResponse.json({ error: "Validation failed", details: err.issues }, { status: 400 });
                }
                throw err;
            }
        }

        // ADMIN & PEJABAT registration (no profile needed)
        const data = await registerUser(email, password, role as "ADMIN" | "PEJABAT");

        return NextResponse.json({
            message: "User registered successfully. Please check your email for verification link.",
            data,
            role
        }, { status: 201 });
    }
    catch (error) {
        if (error instanceof Error && error.message === "USER_EXISTS") {
            return NextResponse.json({ error: "Email already registered" }, { status: 409 });
        }
        return NextResponse.json({ error: "Internal Server Error", errorm: error }, { status: 500 });
    }
}
