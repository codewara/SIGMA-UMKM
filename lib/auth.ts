import { connectMongo } from "@/lib/db";
import { cookies } from "next/headers";
import { UUID } from "mongodb";

/**
 * RBAC Implementation for SIGMA-UMKM
 * 
 * Three user roles:
 * - ADMIN: Full access (manage UMKM, edit/delete, view all)
 * - PEJABAT: Government official (input revenue, view full data)
 * - UMUM: Public/unauthenticated (aggregated data only)
 * 
 * Access matrix defined in README.md
 */

export type UserRole = "ADMIN" | "PEJABAT" | "UMUM";

export interface AuthUser {
    _id: string;
    email: string;
    role: UserRole;
    account_status: string;
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
            role: user.role || "UMUM",
            account_status: user.account_status
        };
    } catch (error) {
        console.error("Error getting current user:", error);
        return null;
    }
}

// Check if user has required role
export function hasRole(user: AuthUser | null, allowedRoles: UserRole[]): boolean {
    if (!user) return allowedRoles.includes("UMUM");
    return allowedRoles.includes(user.role);
}

// Middleware to protect routes
export async function requireAuth(allowedRoles: UserRole[]): Promise<{ user: AuthUser | null, error: string | null }> {
    const user = await getCurrentUser();

    // If UMUM is allowed and no user is logged in, allow
    if (!user && allowedRoles.includes("UMUM")) {
        return { user: null, error: null };
    }

    // If no user and UMUM not allowed, deny
    if (!user) {
        return { user: null, error: "Authentication required" };
    }

    // Check if user has required role
    if (!hasRole(user, allowedRoles)) {
        return { user, error: `Access denied. Required roles: ${allowedRoles.join(", ")}` };
    }

    return { user, error: null };
}
