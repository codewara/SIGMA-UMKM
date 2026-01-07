import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { flagFinancialData, unflagFinancialData } from "@/services/financial.service";
import { flagDataSchema } from "@/lib/validation/financial.schema";
import { ZodError } from "zod";

// Flag suspicious financial data
// RBAC: PEJABAT, ADMIN only
export async function POST(
    req: NextRequest,
    context: { params: Promise<{ umkm_id: string; tahun: string; bulan: string }> }
) {
    const { user, error } = await requireAuth(["ADMIN", "PEJABAT"]);
    if (error || !user) return NextResponse.json({ error: error || "Unauthorized" }, { status: 403 });

    try {
        const { umkm_id, tahun, bulan } = await context.params;
        const body = await req.json();

        // Validate flag reason
        const parsed = flagDataSchema.parse(body);

        await flagFinancialData(
            umkm_id,
            parseInt(tahun),
            parseInt(bulan),
            user._id,
            parsed.reason
        );

        return NextResponse.json({
            message: "Data berhasil di-flag",
            flagged_by: user.email,
        });
    } catch (err) {
        if (err instanceof ZodError) {
            return NextResponse.json({ error: "Validation failed", details: err.issues }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to flag data" }, { status: 500 });
    }
}

// Remove flag from financial data
// RBAC: PEJABAT, ADMIN only
export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ umkm_id: string; tahun: string; bulan: string }> }
) {
    const { user, error } = await requireAuth(["ADMIN", "PEJABAT"]);
    if (error) return NextResponse.json({ error }, { status: 403 });

    try {
        const { umkm_id, tahun, bulan } = await context.params;

        await unflagFinancialData(umkm_id, parseInt(tahun), parseInt(bulan));

        return NextResponse.json({
            message: "Flag berhasil dihapus",
        });
    } catch (err) {
        return NextResponse.json({ error: "Failed to remove flag" }, { status: 500 });
    }
}
