import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/services/auth.service';
import { registerOwnerSchema } from '@/lib/validation/auth.schema';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { fullName, NIK, email, phone, password, passwordConfirm } = body;
        if (!fullName || !NIK || !email || !phone || !password || !passwordConfirm) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }
        
        try {
            const parsed = registerOwnerSchema.parse(body);
            const result = await registerUser(
                parsed.fullName,
                parsed.NIK,
                parsed.email,
                parsed.phone,
                parsed.password,
            );
            return NextResponse.json({
                message: "UMKM Owner registered successfully. Please check your email for verification link.",
                data: result, redirect: "/auth/login",
                role: "UMKM_OWNER"
            }, { status: 201 });
        } catch (err) {
            if (err instanceof ZodError) {
                return NextResponse.json({ error: "Validation failed", details: err.issues }, { status: 400 });
            }
            throw err;
        }
    }
    catch (error) {
        if (error instanceof Error && error.message === "USER_EXISTS") {
            return NextResponse.json({ error: "Email already registered" }, { status: 409 });
        }
        return NextResponse.json({ error: "Internal Server Error", errorm: error }, { status: 500 });
    }
}
