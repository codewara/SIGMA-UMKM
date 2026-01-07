import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { rejectUMKM } from "@/services/verification.service";
import { rejectionSchema } from "@/lib/validation/auth.schema";
import { ZodError } from "zod";

/**
 * POST /api/verification/[id]/reject
 * Reject UMKM verification with reason
 * 
 * Access: PEJABAT | ADMIN
 * 
 * Body: { reason: "rejection reason (min 10 chars)" }
 * 
 * Response: { message: "UMKM verification rejected" }
 */
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Await params (Next.js 15+)
        const { id } = await params;

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
        const validated = rejectionSchema.parse(body);

        // 3. Reject UMKM
        await rejectUMKM(id, user._id, validated.reason);

        // 4. Return success response
        return NextResponse.json(
            {
                message: "UMKM verification rejected",
                umkm_id: id,
                rejected_by: user.email,
                reason: validated.reason
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

        console.error("Error rejecting UMKM:", error);
        return NextResponse.json(
            { error: "Internal server error", details: error.message },
            { status: 500 }
        );
    }
}
