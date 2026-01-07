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

    // Fetch pending UMKM
    const pending = await umkmCollection
      .find({ status: 'PENDING' })
      .sort({ created_at: -1 })
      .toArray();

    return NextResponse.json({ umkm: pending });
  } catch (error) {
    console.error('GET /api/umkm/pending error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
