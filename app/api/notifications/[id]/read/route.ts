import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { connectCassandra } from "@/lib/db";

// Mark notification as read
// RBAC: UMKM_OWNER only
export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { user, error } = await requireAuth(["UMKM_OWNER"]);
    if (error || !user) return NextResponse.json({ error: error || "Unauthorized" }, { status: 403 });

    try {
        const { id } = await context.params;
        const timestamp = new Date(parseInt(id)); // id is timestamp in ms

        const db = await connectCassandra();
        const query = `
            UPDATE flag_notifications
            SET is_read = true
            WHERE owner_id = ? AND created_at = ?
        `;

        await db.execute(query, [user._id, timestamp]);

        return NextResponse.json({
            message: "Notification marked as read",
        });
    } catch (err) {
        return NextResponse.json({ error: "Failed to mark notification as read" }, { status: 500 });
    }
}
