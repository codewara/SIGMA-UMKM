/**
 * PATCH /api/umkm/[id]/verify - Approve/Reject UMKM verification
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { UUID } from 'mongodb';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { user, error } = await requireAuth(['PEJABAT', 'ADMIN']);
    if (error) {
      return NextResponse.json({ error }, { status: 403 });
    }

    const { action } = await request.json(); // 'approve' or 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Action harus approve atau reject' },
        { status: 400 }
      );
    }

    const db = await connectMongo();
    const umkmCollection = db.collection('umkm_profiles');

    const result = await umkmCollection.updateOne(
      // @ts-expect-error cast _id to UUID
      { _id: new UUID(id) },
      {
        $set: {
          'legalitas.status_verifikasi': action === 'approve' ? 'VERIFIED' : 'REJECTED',
          'legalitas.verified_at': new Date(),
          'legalitas.verified_by': user!.email,
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'UMKM tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: `UMKM ${action === 'approve' ? 'disetujui' : 'ditolak'}`,
    });
  } catch (error) {
    console.error('PATCH /api/umkm/[id]/verify error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
