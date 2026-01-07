/**
 * GET /api/admin/users - List all PEJABAT users
 * POST /api/admin/users - Create new PEJABAT user
 * DELETE /api/admin/users/[id] - Delete user
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { UUID } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(['ADMIN']);
    if (error) {
      return NextResponse.json({ error }, { status: 403 });
    }

    const db = await connectMongo();
    const usersCollection = db.collection('users');

    // Fetch all PEJABAT users
    const pejabats = await usersCollection
      .find({ role: 'PEJABAT' })
      .project({ password_hash: 0 }) // Don't expose password
      .sort({ created_at: -1 })
      .toArray();

    return NextResponse.json({ users: pejabats });
  } catch (error) {
    console.error('GET /api/admin/users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(['ADMIN']);
    if (error) {
      return NextResponse.json({ error }, { status: 403 });
    }

    const body = await request.json();
    const { email, password, nama, wilayah } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password diperlukan' },
        { status: 400 }
      );
    }

    const db = await connectMongo();
    const usersCollection = db.collection('users');

    // Check if email already exists
    const existing = await usersCollection.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = {
      _id: new UUID(uuidv4()),
      email,
      password_hash: passwordHash,
      role: 'PEJABAT',
      account_status: 'active',
      nama: nama || email.split('@')[0],
      wilayah: wilayah || null,
      created_at: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    return NextResponse.json(
      {
        message: 'User berhasil dibuat',
        user: {
          _id: newUser._id,
          email: newUser.email,
          nama: newUser.nama,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/admin/users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
