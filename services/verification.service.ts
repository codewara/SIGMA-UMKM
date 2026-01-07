import { connectMongo, connectCassandra } from "@/lib/db";
import { UUID } from "mongodb";

/**
 * Verification Service
 * Handles UMKM verification workflow for PEJABAT and ADMIN roles
 */

export interface VerificationTask {
    umkm_id: string;
    created_at: Date;
    nama_usaha: string;
    owner_email: string;
    status: string;
}

/**
 * Get all pending verification tasks
 * @returns Array of pending UMKMs waiting for verification
 */
export async function getPendingVerifications(): Promise<VerificationTask[]> {
    try {
        const mongo = await connectMongo();

        // Find all UMKMs with PENDING status
        const pendingUMKMs = await mongo.collection("umkm_profiles")
            .find({
                "legalitas.status_verifikasi": "PENDING",
                is_deleted: { $ne: true }
            })
            .sort({ tanggal_bergabung: -1 })
            .toArray();

        // Get owner emails
        const tasks: VerificationTask[] = [];
        for (const umkm of pendingUMKMs) {
            let ownerEmail = "N/A";

            if (umkm.owner_id) {
                const owner = await mongo.collection("users").findOne({ _id: umkm.owner_id });
                if (owner) {
                    ownerEmail = owner.email;
                }
            }

            tasks.push({
                umkm_id: umkm._id.toString(),
                created_at: umkm.tanggal_bergabung || new Date(),
                nama_usaha: umkm.nama_usaha,
                owner_email: ownerEmail,
                status: "PENDING"
            });
        }

        return tasks;
    } catch (error) {
        console.error("Error fetching pending verifications:", error);
        throw error;
    }
}

/**
 * Approve UMKM verification
 * @param umkmId - UMKM ID to approve
 * @param pejabatId - ID of PEJABAT/ADMIN who approved
 * @param notes - Optional notes
 */
export async function approveUMKM(
    umkmId: string,
    pejabatId: string,
    notes?: string
): Promise<void> {
    try {
        const mongo = await connectMongo();
        const cassandra = await connectCassandra();

        // Update MongoDB: Set status to VERIFIED
        const result = await mongo.collection("umkm_profiles").updateOne(
            // @ts-expect-error cast to UUID
            { _id: new UUID(umkmId) },
            {
                $set: {
                    "legalitas.status_verifikasi": "VERIFIED",
                    // @ts-expect-error cast to UUID
                    "legalitas.verified_by": new UUID(pejabatId),
                    "legalitas.tanggal_verifikasi": new Date(),
                    "legalitas.rejection_reason": null
                }
            }
        );

        if (result.matchedCount === 0) {
            throw new Error("UMKM not found");
        }

        // Update Cassandra verification_tasks (if exists)
        // Note: In prototype, we might skip Cassandra tracking
        // For full implementation, insert to Cassandra here

        // TODO: Send email notification to owner
        console.log(`✅ UMKM ${umkmId} approved by ${pejabatId}`);

    } catch (error) {
        console.error("Error approving UMKM:", error);
        throw error;
    }
}

/**
 * Reject UMKM verification
 * @param umkmId - UMKM ID to reject
 * @param pejabatId - ID of PEJABAT/ADMIN who rejected
 * @param reason - Rejection reason
 */
export async function rejectUMKM(
    umkmId: string,
    pejabatId: string,
    reason: string
): Promise<void> {
    try {
        const mongo = await connectMongo();

        // Update MongoDB: Set status to REJECTED
        const result = await mongo.collection("umkm_profiles").updateOne(
            // @ts-expect-error cast to UUID
            { _id: new UUID(umkmId) },
            {
                $set: {
                    "legalitas.status_verifikasi": "REJECTED",
                    // @ts-expect-error cast to UUID
                    "legalitas.verified_by": new UUID(pejabatId),
                    "legalitas.tanggal_verifikasi": new Date(),
                    "legalitas.rejection_reason": reason
                }
            }
        );

        if (result.matchedCount === 0) {
            throw new Error("UMKM not found");
        }

        // TODO: Send email notification to owner with rejection reason
        console.log(`❌ UMKM ${umkmId} rejected by ${pejabatId}: ${reason}`);

    } catch (error) {
        console.error("Error rejecting UMKM:", error);
        throw error;
    }
}

/**
 * Send verification result email to owner
 * @param toEmail - Owner email address
 * @param status - Verification status (VERIFIED or REJECTED)
 * @param umkmName - Name of the UMKM
 * @param reason - Rejection reason (if rejected)
 */
export async function sendVerificationEmail(
    toEmail: string,
    status: "VERIFIED" | "REJECTED",
    umkmName: string,
    reason?: string
): Promise<void> {
    // TODO: Implement email sending using mailer.ts
    // For prototype, just log
    console.log(`📧 Email to ${toEmail}: UMKM "${umkmName}" is ${status}`);
    if (reason) {
        console.log(`   Reason: ${reason}`);
    }
}
