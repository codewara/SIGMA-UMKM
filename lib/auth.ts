import { connectMongo } from "@/lib/db";
import { cookies } from "next/headers";
import { UUID } from "mongodb";
import { UserRole } from "./types";

/**
 * RBAC Implementation for SIGMA-UMKM
 * 
 * Four user roles:
 * - PUBLIC: Unauthenticated, view aggregated data
 * - UMKM_OWNER: Can only view/edit their own UMKMs
 * - PEJABAT: Government official, view UMKMs in region, verify & flag
 * - ADMIN: Full access to all system features
 * 
 * Access matrix defined in ENDPOINTS.md
 */

export interface AuthUser {
    _id: string;
    email: string;
    role: UserRole;
    account_status: string;
    nama?: string;
}

// Get current authenticated user from session
export async function getCurrentUser(): Promise<AuthUser | null> {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("session_token")?.value;

        if (!sessionToken) return null;

        const mongo = await connectMongo();
        const session = await mongo.collection("sessions").findOne({
            // @ts-expect-error cast _id to UUID
            _id: new UUID(sessionToken),
            expires_at: { $gt: new Date() }
        });

        if (!session) return null;

        const user = await mongo.collection("users").findOne({ _id: session.user_id });
        if (!user) return null;

        return {
            _id: user._id.toString(),
            email: user.email,
            role: user.role || "PUBLIC",
            account_status: user.account_status,
            nama: user.nama
        };
    } catch (error) {
        console.error("Error getting current user:", error);
        return null;
    }
}

// Check if user has required role
export function hasRole(user: AuthUser | null, allowedRoles: UserRole[]): boolean {
    if (!user) return false;
    return allowedRoles.includes(user.role);
}

// Middleware to protect routes
// allowPublic: true = allow unauthenticated access (returns user: null)
export async function requireAuth(allowedRoles: UserRole[], allowPublic = false): Promise<{ user: AuthUser | null, error: string | null }> {
    const user = await getCurrentUser();

    // If public access is allowed and no user, allow (for public endpoints)
    if (!user && allowPublic) {
        return { user: null, error: null };
    }

    // If no user and public access not allowed, deny
    if (!user) {
        return { user: null, error: "Authentication required" };
    }

    // Check if user has required role
    if (!hasRole(user, allowedRoles)) {
        return { user, error: `Access denied. Required roles: ${allowedRoles.join(", ")}` };
    }

    return { user, error: null };
}
