/**
 * DELETE /api/admin/users/[id] - Delete user by ID
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { UUID } from 'mongodb';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await requireAuth(['ADMIN']);
    if (error) {
      return NextResponse.json({ error }, { status: 403 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID pengguna diperlukan' },
        { status: 400 }
      );
    }

    console.log('Attempting to delete user with ID:', id);

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

    // Try to parse as UUID, if it fails try as string
    let deleteQuery: any = {};
    try {
      // @ts-expect-error UUID casting
      deleteQuery = { _id: new UUID(id) };
      console.log('Using UUID query:', deleteQuery);
    } catch (err) {
      // If UUID parsing fails, try without UUID wrapper
      console.log('UUID parsing failed, using string query');
      deleteQuery = { _id: id };
    }

    // Delete user
    console.log('Delete query:', deleteQuery);
    const result = await usersCollection.deleteOne(deleteQuery);
    console.log('Delete result:', result);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    // Also delete their sessions
    try {
      // @ts-expect-error UUID casting
      await sessionsCollection.deleteMany({ user_id: new UUID(id) });
    } catch (err) {
      // Ignore session deletion errors
      await sessionsCollection.deleteMany({ user_id: id });
    }

    return NextResponse.json({
      message: 'User berhasil dihapus',
    });
  } catch (error) {
    console.error('DELETE /api/admin/users/[id] error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
