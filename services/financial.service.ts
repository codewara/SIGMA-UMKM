import { connectCassandra } from "@/lib/db";
import { types as CassandraTypes } from "cassandra-driver";

/**
 * Financial Service
 * Handles revenue logging and flagging operations
 */

export interface RevenueLog {
    umkm_id: string;
    tahun: number;
    bulan: number;
    omzet: number;
    jumlah_karyawan?: number;
    bukti_url?: string;
    input_by: string;
}

export interface FlagNotification {
    owner_id: string;
    umkm_id: string;
    bulan: number;
    tahun: number;
    flag_reason: string;
    flagged_by_name: string;
}

/**
 * Log revenue for a UMKM (by UMKM_OWNER)
 * @param data - Revenue log data
 */
export async function logRevenue(data: RevenueLog): Promise<void> {
    try {
        const cassandra = await connectCassandra();

        // Get UMKM details for denormalization
        const { connectMongo } = await import("@/lib/db");
        const { UUID } = await import("mongodb");
        const mongo = await connectMongo();

        const umkm = await mongo.collection("umkm_profiles").findOne({
            // @ts-expect-error cast to UUID
            _id: new UUID(data.umkm_id)
        });

        if (!umkm) {
            throw new Error("UMKM not found");
        }

        const query = `
      INSERT INTO umkm_financial_log (
        umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan,
        nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by
      ) VALUES (?, ?, ?, toTimestamp(now()), ?, ?, ?, ?, false, null, null, null, ?)
    `;

        await cassandra.execute(query, [
            CassandraTypes.Uuid.fromString(data.umkm_id),
            data.tahun,
            data.bulan,
            data.omzet,
            data.jumlah_karyawan || 0,
            umkm.nama_usaha,
            umkm.sektor,
            CassandraTypes.Uuid.fromString(data.input_by)
        ], { prepare: true });

        // Update MongoDB summary
        await mongo.collection("umkm_profiles").updateOne(
            // @ts-expect-error cast to UUID
            { _id: new UUID(data.umkm_id) },
            {
                $set: {
                    "summary_terakhir.omzet_terakhir": data.omzet,
                    "summary_terakhir.bulan": data.bulan
                }
            }
        );

        console.log(`✅ Revenue logged for UMKM ${data.umkm_id}: ${data.bulan}/${data.tahun}`);

    } catch (error) {
        console.error("Error logging revenue:", error);
        throw error;
    }
}

/**
 * Flag financial data as suspicious (by PEJABAT)
 * @param umkmId - UMKM ID
 * @param tahun - Year
 * @param bulan - Month
 * @param pejabatId - ID of PEJABAT who flagged
 * @param reason - Flag reason
 */
export async function flagFinancialData(
    umkmId: string,
    tahun: number,
    bulan: number,
    pejabatId: any, // Can be UUID object or string
    reason: string
): Promise<void> {
    try {
        const cassandra = await connectCassandra();

        // Convert pejabatId to string if it's a UUID object
        const pejabatIdStr = typeof pejabatId === 'string' ? pejabatId : pejabatId.toString();

        // Update the financial log entry
        const updateQuery = `
      UPDATE umkm_financial_log
      SET is_flagged = true,
          flag_reason = ?,
          flagged_by = ?,
          flagged_at = toTimestamp(now())
      WHERE umkm_id = ? AND tahun = ? AND bulan = ?
    `;

        await cassandra.execute(updateQuery, [
            reason,
            CassandraTypes.Uuid.fromString(pejabatIdStr),
            CassandraTypes.Uuid.fromString(umkmId),
            tahun,
            bulan
        ], { prepare: true });

        // Get owner_id and pejabat name for notification
        const { connectMongo } = await import("@/lib/db");
        const { UUID } = await import("mongodb");
        const mongo = await connectMongo();

        const umkm = await mongo.collection("umkm_profiles").findOne({
            // @ts-expect-error cast to UUID
            _id: new UUID(umkmId)
        });

        const pejabat = await mongo.collection("users").findOne({
            // @ts-expect-error cast to UUID
            _id: new UUID(pejabatIdStr)
        });

        if (umkm?.owner_id && pejabat) {
            // Create notification for owner
            await createFlagNotification({
                owner_id: umkm.owner_id.toString(),
                umkm_id: umkmId,
                bulan,
                tahun,
                flag_reason: reason,
                flagged_by_name: pejabat.email
            });
        }

        console.log(`🚩 Financial data flagged: ${umkmId} - ${bulan}/${tahun}`);

    } catch (error) {
        console.error("Error flagging financial data:", error);
        throw error;
    }
}

/**
 * Remove flag from financial data
 * @param umkmId - UMKM ID
 * @param tahun - Year
 * @param bulan - Month
 */
export async function unflagFinancialData(
    umkmId: string,
    tahun: number,
    bulan: number
): Promise<void> {
    try {
        const cassandra = await connectCassandra();

        const updateQuery = `
      UPDATE umkm_financial_log
      SET is_flagged = false,
          flag_reason = null,
          flagged_by = null,
          flagged_at = null
      WHERE umkm_id = ? AND tahun = ? AND bulan = ?
    `;

        await cassandra.execute(updateQuery, [
            CassandraTypes.Uuid.fromString(umkmId),
            tahun,
            bulan
        ], { prepare: true });

        console.log(`✅ Flag removed: ${umkmId} - ${bulan}/${tahun}`);

    } catch (error) {
        console.error("Error removing flag:", error);
        throw error;
    }
}

/**
 * Create flag notification for UMKM owner
 * @param data - Notification data
 */
export async function createFlagNotification(data: FlagNotification): Promise<void> {
    try {
        const cassandra = await connectCassandra();

        const query = `
      INSERT INTO flag_notifications (
        owner_id, created_at, umkm_id, bulan, tahun,
        flag_reason, flagged_by_name, is_read
      ) VALUES (?, toTimestamp(now()), ?, ?, ?, ?, ?, false)
    `;

        await cassandra.execute(query, [
            CassandraTypes.Uuid.fromString(data.owner_id),
            CassandraTypes.Uuid.fromString(data.umkm_id),
            data.bulan,
            data.tahun,
            data.flag_reason,
            data.flagged_by_name
        ], { prepare: true });

        console.log(`📬 Notification created for owner ${data.owner_id}`);

    } catch (error) {
        console.error("Error creating notification:", error);
        throw error;
    }
}

/**
 * Get notifications for a specific owner
 * @param ownerId - Owner user ID
 * @param unreadOnly - Filter for unread notifications only
 * @returns Array of notifications
 */
export async function getOwnerNotifications(
    ownerId: string,
    unreadOnly: boolean = false
): Promise<any[]> {
    try {
        const cassandra = await connectCassandra();

        let query = `
      SELECT * FROM flag_notifications
      WHERE owner_id = ?
    `;

        if (unreadOnly) {
            query += ` AND is_read = false ALLOW FILTERING`;
        }

        const result = await cassandra.execute(query, [
            CassandraTypes.Uuid.fromString(ownerId)
        ], { prepare: true });

        return result.rows;

    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
    }
}
