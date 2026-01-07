import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware for RBAC Route Protection
 * Verifies session and redirects to appropriate page based on role
 * 
 * Supported Roles:
 * - ADMIN: System administration
 * - PEJABAT: Government official (auditor & verifier)
 * - UMKM_OWNER: Business owner
 * 
 * Note: Minimal logic to avoid edge runtime limitations
 * Full validation happens in API routes & page components
 */

const PUBLIC_ROUTES = [
    '/',
    '/peta',
    '/katalog',
    '/auth/login',
    '/auth/register',
    '/demo', // Demo mode for testing
];

const PROTECTED_ROUTES = [
    '/dashboard',
];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public routes without auth
    if (PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'))) {
        return NextResponse.next();
    }

    // Check if trying to access protected route
    if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
        const sessionToken = request.cookies.get('session_token')?.value;

        if (!sessionToken) {
            // No session, redirect to login
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }

        // Session exists, allow access
        // Full validation happens in the page/API layers
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|public).*)',
    ],
};
