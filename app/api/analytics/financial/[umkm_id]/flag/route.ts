/**
 * PATCH /api/analytics/financial/[umkm_id]/flag - Toggle flag status on financial log
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectCassandra } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { umkm_id: string } }
) {
  try {
    const { user, error } = await requireAuth(['PEJABAT', 'ADMIN']);
    if (error || !user) {
      return NextResponse.json({ error }, { status: 403 });
    }

    // Get tahun/bulan from query params or body
    const searchParams = request.nextUrl.searchParams;
    let tahun = parseInt(searchParams.get('tahun') || '');
    let bulan = parseInt(searchParams.get('bulan') || '');
    
    // Fall back to body if not in query
    if (!tahun || !bulan) {
      const body = await request.json();
      tahun = body.tahun || tahun;
      bulan = body.bulan || bulan;
    }

    if (!tahun || !bulan) {
      return NextResponse.json(
        { error: 'Tahun dan bulan diperlukan' },
        { status: 400 }
      );
    }

    const cassandra = await connectCassandra();
    const query = `
      UPDATE sigma_ks.umkm_financial_log
      SET is_flagged = ?, flagged_at = ?, flagged_by = ?
      WHERE umkm_id = ? AND tahun = ? AND bulan = ?
    `;

    await cassandra.execute(query, [
      true,
      new Date(),
      user.email,
      params.umkm_id,
      tahun,
      bulan,
    ]);

    return NextResponse.json({
      message: 'Data ditandai sebagai mencurigakan',
    });
  } catch (error) {
    console.error('PATCH flag error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
