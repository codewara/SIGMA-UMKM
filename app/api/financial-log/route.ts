import { NextRequest, NextResponse } from 'next/server';
import { connectCassandra, connectMongo } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { umkmFinancialLogSchema } from '@/lib/validation/umkm_financial.schema';
import { ZodError } from 'zod';
import { UUID } from 'mongodb';

export async function POST(req: NextRequest) {
    try {
        // Check authentication - only OWNER role can POST
        const { user, error: authError } = await requireAuth(['UMKM_OWNER'], false);
        if (authError) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { umkm_id, tahun, bulan, omzet, jumlah_karyawan, catatan } = body;

        // Validate input
        try {
            umkmFinancialLogSchema.parse({
                tahun,
                bulan,
                omzet,
                jumlah_karyawan,
            });
        } catch (err) {
            if (err instanceof ZodError) {
                return NextResponse.json(
                    { error: err.errors[0]?.message || 'Validasi gagal' },
                    { status: 400 }
                );
            }
        }

        // Check ownership of UMKM
        const mongo = await connectMongo();
        // @ts-expect-error cast _id to UUID
        const umkm = await mongo.collection('umkm_profiles').findOne({ _id: new UUID(umkm_id) });
        if (!umkm || umkm.owner_id.toString() !== user._id.toString()) {
            return NextResponse.json({ error: 'Access denied: Not your UMKM' }, { status: 403 });
        }

        // Connect to Cassandra
        const cassandra = await connectCassandra();
        const timestamp = new Date();

        // Insert into Cassandra
        const query = `
            INSERT INTO sigma_ks.umkm_financial_log 
            (umkm_id, tahun, bulan, omzet, jumlah_karyawan, tanggal_input, is_flagged)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        await cassandra.execute(query, [
            umkm_id,
            tahun,
            bulan,
            omzet,
            jumlah_karyawan,
            timestamp,
            false
        ], { prepare: true });

        return NextResponse.json(
            {
                message: 'Laporan keuangan berhasil disimpan',
                data: {
                    umkm_id,
                    tahun,
                    bulan,
                    omzet,
                    jumlah_karyawan,
                    tanggal_input: timestamp,
                    is_flagged: false
                }
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error in financial log POST:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Gagal menyimpan laporan' },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        // Check authentication
        const { user, error: authError } = await requireAuth(['UMKM_OWNER', 'PEJABAT', 'ADMIN'], false);
        if (authError) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const umkm_id = searchParams.get('umkm_id');
        const tahun = searchParams.get('tahun') || new Date().getFullYear().toString();

        if (!umkm_id) {
            return NextResponse.json({ error: 'UMKM ID is required' }, { status: 400 });
        }

        // UMKM_OWNER: Check ownership
        if (user.role === 'UMKM_OWNER') {
            const mongo = await connectMongo();
            // @ts-expect-error cast _id to UUID
            const umkm = await mongo.collection('umkm_profiles').findOne({ _id: new UUID(umkm_id) });
            if (!umkm || umkm.owner_id.toString() !== user._id.toString()) {
                return NextResponse.json({ error: 'Access denied: Not your UMKM' }, { status: 403 });
            }
        }

        // Connect to Cassandra
        const cassandra = await connectCassandra();

        // Query financial logs by UMKM and year
        const query = `
            SELECT umkm_id, tahun, bulan, omzet, jumlah_karyawan, tanggal_input, is_flagged, flag_reason, catatan
            FROM sigma_ks.umkm_financial_log
            WHERE umkm_id = ? AND tahun = ?
            ORDER BY bulan DESC
        `;

        const result = await cassandra.execute(query, [umkm_id, parseInt(tahun)], { prepare: true });

        const logs = result.rows.map(row => ({
            umkm_id: row.umkm_id,
            tahun: row.tahun,
            bulan: row.bulan,
            omzet: row.omzet,
            jumlah_karyawan: row.jumlah_karyawan,
            catatan: row.catatan,
            tanggal_input: row.tanggal_input,
            is_flagged: row.is_flagged,
            flag_reason: row.flag_reason
        }));

        return NextResponse.json({
            logs,
            count: logs.length,
            message: 'Success'
        });
    } catch (error) {
        console.error('Error in financial log GET:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Gagal mengambil data' },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest) {
    try {
        // Check authentication - only PEJABAT and ADMIN can flag
        const { user, error: authError } = await requireAuth(['PEJABAT', 'ADMIN'], false);
        if (authError) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await req.json();
        const { umkm_id, tahun, bulan, is_flagged, flag_reason } = body;

        if (!umkm_id || !tahun || !bulan) {
            return NextResponse.json(
                { error: 'UMKM ID, tahun, and bulan are required' },
                { status: 400 }
            );
        }

        // Connect to Cassandra
        const cassandra = await connectCassandra();

        // Update flag status in Cassandra
        const query = `
            UPDATE sigma_ks.umkm_financial_log
            SET is_flagged = ?, flag_reason = ?, flagged_at = ?
            WHERE umkm_id = ? AND tahun = ? AND bulan = ?
        `;

        await cassandra.execute(query, [
            is_flagged,
            flag_reason || null,
            new Date(),
            umkm_id,
            tahun,
            bulan
        ], { prepare: true });

        return NextResponse.json({
            message: 'Flag status updated successfully',
            data: {
                umkm_id,
                tahun,
                bulan,
                is_flagged,
                flag_reason
            }
        });
    } catch (error) {
        console.error('Error in financial log PATCH:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Gagal memperbarui status' },
            { status: 500 }
        );
    }
}
