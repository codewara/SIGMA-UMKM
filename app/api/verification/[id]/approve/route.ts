import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { approveUMKM } from "@/services/verification.service";
import { verificationDecisionSchema } from "@/lib/validation/auth.schema";
import { ZodError } from "zod";

/**
 * POST /api/verification/[id]/approve
 * Approve UMKM verification
 * 
 * Access: PEJABAT | ADMIN
 * 
 * Body: { notes?: "optional approval notes" }
 * 
 * Response: { message: "UMKM verified successfully" }
 */
export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // 1. Check authentication & authorization
        const { user, error } = await requireAuth(["ADMIN", "PEJABAT"]);

        if (error) {
            return NextResponse.json(
                { error },
                { status: user ? 403 : 401 }
            );
        }

        if (!user) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        // 2. Validate request body
        const body = await req.json();
        const validated = verificationDecisionSchema.parse(body);

        // 3. Approve UMKM
        await approveUMKM(params.id, user._id, validated.notes);

        // 4. Return success response
        return NextResponse.json(
            {
                message: "UMKM verified successfully",
                umkm_id: params.id,
                verified_by: user.email
            },
            { status: 200 }
        );

    } catch (error: any) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: "Validation error", details: error.issues },
                { status: 400 }
            );
        }

        console.error("Error approving UMKM:", error);
        return NextResponse.json(
            { error: "Internal server error", details: error.message },
            { status: 500 }
        );
    }
}
