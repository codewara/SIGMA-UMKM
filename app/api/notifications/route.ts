import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getOwnerNotifications } from "@/services/financial.service";

// Get notifications for UMKM_OWNER
// RBAC: UMKM_OWNER only
export async function GET(req: NextRequest) {
    const { user, error } = await requireAuth(["UMKM_OWNER"]);
    if (error || !user) return NextResponse.json({ error: error || "Unauthorized" }, { status: 403 });

    try {
        const unreadOnly = req.nextUrl.searchParams.get("unread") === "true";

        const notifications = await getOwnerNotifications(user._id, unreadOnly);

        return NextResponse.json({
            message: "Notifications retrieved",
            data: notifications,
            count: notifications.length,
        });
    } catch (err) {
        return NextResponse.json({ error: "Failed to get notifications" }, { status: 500 });
    }
}
