import { connectMongo } from "@/lib/db";
import { UUID } from "mongodb";

/**
 * RBAC Helper Functions for SIGMA-UMKM
 * 
 * These helpers handle ownership checks and IDOR (Insecure Direct Object Reference) prevention.
 * 
 * Security Best Practice:
 * - Role checks happen in requireAuth() (lib/auth.ts)
 * - Ownership checks happen in route handlers using these helpers
 * - Never mix role and ownership logic in middleware
 */

/**
 * Check if a user owns a specific UMKM
 * 
 * @param userId - User ID to check ownership
 * @param umkmId - UMKM ID to verify ownership
 * @returns Promise<boolean> - True if user owns the UMKM
 */
export async function requireOwnership(
    userId: string,
    umkmId: string
): Promise<boolean> {
    try {
        const mongo = await connectMongo();
        const umkm = await mongo.collection("umkm_profiles").findOne({
            // @ts-expect-error cast to UUID
            _id: new UUID(umkmId),
            is_deleted: { $ne: true } // Exclude soft-deleted UMKMs
        });

        if (!umkm) return false;

        return umkm.owner_id?.toString() === userId;
    } catch (error) {
        console.error("Error checking ownership:", error);
        return false;
    }
}

/**
 * Get all UMKMs owned by a specific user
 * 
 * @param userId - User ID to fetch UMKMs for
 * @param includeDeleted - Whether to include soft-deleted UMKMs
 * @returns Promise<any[]> - Array of UMKM documents
 */
export async function getOwnedUMKMs(
    userId: string,
    includeDeleted = false
): Promise<any[]> {
    try {
        const mongo = await connectMongo();
        const filter: any = {
            // @ts-expect-error cast to UUID
            owner_id: new UUID(userId)
        };

        if (!includeDeleted) {
            filter.is_deleted = { $ne: true };
        }

        return await mongo.collection("umkm_profiles")
            .find(filter)
            .toArray();
    } catch (error) {
        console.error("Error fetching owned UMKMs:", error);
        return [];
    }
}

/**
 * Check if user can modify a specific financial log entry
 * This checks if the UMKM belongs to the user
 * 
 * @param userId - User ID to check
 * @param umkmId - UMKM ID associated with the financial log
 * @returns Promise<boolean> - True if user can modify
 */
export async function canModifyFinancialLog(
    userId: string,
    umkmId: string
): Promise<boolean> {
    return requireOwnership(userId, umkmId);
}

/**
 * Get UMKM with verification status check
 * Returns null if UMKM doesn't exist or is soft-deleted
 * 
 * @param umkmId - UMKM ID to fetch
 * @returns Promise<any | null> - UMKM document or null
 */
export async function getUMKMById(umkmId: string): Promise<any | null> {
    try {
        const mongo = await connectMongo();
        const umkm = await mongo.collection("umkm_profiles").findOne({
            // @ts-expect-error cast to UUID
            _id: new UUID(umkmId),
            is_deleted: { $ne: true }
        });

        return umkm;
    } catch (error) {
        console.error("Error fetching UMKM:", error);
        return null;
    }
}

/**
 * Check if UMKM is verified (status_verifikasi === 'VERIFIED')
 * 
 * @param umkmId - UMKM ID to check
 * @returns Promise<boolean> - True if verified
 */
export async function isUMKMVerified(umkmId: string): Promise<boolean> {
    const umkm = await getUMKMById(umkmId);
    return umkm?.legalitas?.status_verifikasi === "VERIFIED";
}
