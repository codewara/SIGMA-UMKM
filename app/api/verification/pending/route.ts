import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getPendingVerifications } from "@/services/verification.service";

/**
 * GET /api/verification/pending
 * List all UMKMs with PENDING verification status
 * 
 * Access: PEJABAT | ADMIN
 * 
 * Response:
 * {
 *   tasks: [
 *     {
 *       umkm_id: "uuid",
 *       nama_usaha: "string",
 *       owner_email: "string",
 *       created_at: "timestamp",
 *       status: "PENDING"
 *     }
 *   ]
 * }
 */
export async function GET(req: NextRequest) {
    try {
        // 1. Check authentication & authorization
        const { user, error } = await requireAuth(["ADMIN", "PEJABAT"]);

        if (error) {
            return NextResponse.json(
                { error },
                { status: user ? 403 : 401 }
            );
        }

        // 2. Fetch pending verifications
        const tasks = await getPendingVerifications();

        // 3. Return response
        return NextResponse.json({ tasks }, { status: 200 });

    } catch (error: any) {
        console.error("Error fetching pending verifications:", error);
        return NextResponse.json(
            { error: "Internal server error", details: error.message },
            { status: 500 }
        );
    }
}
