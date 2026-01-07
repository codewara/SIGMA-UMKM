/**
 * GET /api/umkm/pending - List pending UMKM for verification
 * PATCH /api/umkm/[id]/verify - Approve/Reject UMKM
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { UUID } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(['PEJABAT', 'ADMIN']);
    if (error) {
      return NextResponse.json({ error }, { status: 403 });
    }

    const db = await connectMongo();
    const umkmCollection = db.collection('umkm_profiles');

    // Fetch pending UMKM - look for legalitas.status_verifikasi = PENDING
    const pending = await umkmCollection
      .find({ 
        "legalitas.status_verifikasi": "PENDING",
        is_deleted: { $ne: true }
      })
      .sort({ tanggal_bergabung: -1 })
      .project({
        _id: 1,
        nama_usaha: 1,
        sektor: 1,
        pemilik: 1,
        wilayah: 1,
        tanggal_bergabung: 1,
        legalitas: 1,
        summary_terakhir: 1,
      })
      .toArray();

    return NextResponse.json({ 
      umkm: pending,
      count: pending.length,
      message: `${pending.length} UMKM pending verification`
    });
  } catch (error) {
    console.error('GET /api/umkm/pending error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
