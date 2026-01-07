/**
 * DELETE /api/admin/users/[id] - Delete user by ID
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { UUID } from 'mongodb';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, error } = await requireAuth(['ADMIN']);
    if (error) {
      return NextResponse.json({ error }, { status: 403 });
    }

    const { id } = params;

    const db = await connectMongo();
    const usersCollection = db.collection('users');
    const sessionsCollection = db.collection('sessions');

    // Prevent deleting self
    if (user._id.toString() === id) {
      return NextResponse.json(
        { error: 'Tidak bisa menghapus akun sendiri' },
        { status: 400 }
      );
    }

    // Delete user
    // @ts-expect-error UUID casting
    const result = await usersCollection.deleteOne({ _id: new UUID(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    // Also delete their sessions
    // @ts-expect-error UUID casting
    await sessionsCollection.deleteMany({ user_id: new UUID(id) });

    return NextResponse.json({
      message: 'User berhasil dihapus',
    });
  } catch (error) {
    console.error('DELETE /api/admin/users/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
