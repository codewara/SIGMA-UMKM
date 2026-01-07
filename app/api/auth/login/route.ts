import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/services/auth.service';
import { connectMongo } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();
        if (!email || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        
        // Get IP and user-agent from headers
        const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
        const userAgent = request.headers.get('user-agent') || 'unknown';
        // Authenticate User
        const result = await authenticateUser(email, password, ip, userAgent);

        if (!result) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        
        // Get user role to determine redirect
        const db = await connectMongo();
        const user = await db.collection('users').findOne({ email });
        
        let redirect = '/';
        if (user?.role === 'ADMIN') {
            redirect = '/dashboard/admin';
        } else if (user?.role === 'PEJABAT') {
            redirect = '/dashboard/pejabat';
        } else if (user?.role === 'UMKM_OWNER') {
            redirect = '/dashboard/owner';
        }
        
        return NextResponse.json({ message: "Login successful", data: result, redirect }, { status: 200 } );
    }
    catch (error) {
        if (error instanceof Error && error.message === "TOO_MANY_ATTEMPTS") {
            return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
        }
        return NextResponse.json({ error: "Internal Server Error", err: error }, { status: 500 });
    }
}