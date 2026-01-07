/**
 * Seed script to create demo users and test UMKM data
 * Run: ts-node scripts/seed-demo.ts
 */

import { MongoClient, UUID } from 'mongodb';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://root:sigma@localhost:27018?authSource=admin';
const DEMO_PASSWORD = 'demopassword';

// Demo users to seed
const DEMO_USERS = [
    {
        email: 'demo.admin@sigma.com',
        role: 'ADMIN',
        name: 'Admin Demo'
    },
    {
        email: 'demo.pejabat@sigma.com',
        role: 'PEJABAT',
        name: 'Pejabat Demo'
    },
    {
        email: 'demo.owner@sigma.com',
        role: 'UMKM_OWNER',
        name: 'Owner Demo'
    }
];

async function seedDemo() {
    let client: MongoClient | null = null;

    try {
        console.log('🚀 Starting demo seed script...');
        console.log('📍 Connecting to MongoDB:', MONGO_URI);

        client = new MongoClient(MONGO_URI);
        await client.connect();

        const db = client.db('sigma_db');
        const usersCollection = db.collection('users');
        const umkmCollection = db.collection('umkm_profiles');

        console.log('\n📝 Seeding demo users...');

        const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 12);

        for (const demoUser of DEMO_USERS) {
            const userId = uuidv4();
            const existingUser = await usersCollection.findOne({ email: demoUser.email });

            if (existingUser) {
                console.log(`  ✅ User ${demoUser.email} already exists`);
                continue;
            }

            const userDoc = {
                _id: new UUID(userId),
                email: demoUser.email,
                password_hash: hashedPassword,
                role: demoUser.role,
                account_status: 'active',
                created_at: new Date(),
            };

            await usersCollection.insertOne(userDoc);
            console.log(`  ✨ Created ${demoUser.role}: ${demoUser.email}`);

            // If UMKM_OWNER, create a dummy UMKM linked to this user
            if (demoUser.role === 'UMKM_OWNER') {
                const umkmId = uuidv4();
                const existingUMKM = await umkmCollection.findOne({
                    owner_id: userId
                });

                if (!existingUMKM) {
                    const umkmDoc = {
                        _id: umkmId,
                        owner_id: userId,
                        nama_usaha: 'UMKM Demo - Kedai Kopi Sigma',
                        sektor: 'kuliner',
                        tanggal_bergabung: new Date(),
                        verification_status: 'APPROVED',
                        pemilik: {
                            nama: demoUser.name,
                            nik: '3210123456789012',
                            telepon: '081234567890',
                            email: demoUser.email,
                        },
                        lokasi: {
                            type: 'Point',
                            coordinates: [112.7508, -7.2575], // Surabaya coordinates
                        },
                        wilayah: {
                            kota: 'Surabaya',
                            provinsi: 'Jawa Timur',
                            alamat_lengkap: 'Jl. Diponegoro No. 123, Surabaya',
                        },
                        legalitas: {
                            nib: '1234567890123456',
                            pirt: '20.12.3456.567890.012',
                            halal: true,
                        },
                        summary_terakhir: {
                            omzet_terakhir: 50000000,
                            bulan: new Date().getMonth() + 1,
                        },
                    };

                    await umkmCollection.insertOne(umkmDoc);
                    console.log(`  ✨ Created dummy UMKM: ${umkmDoc.nama_usaha} (ID: ${umkmId})`);
                }
            }
        }

        console.log('\n✅ Demo seed completed successfully!');
        console.log('\n📚 Demo Credentials:');
        console.log('-------------------------------------------');
        DEMO_USERS.forEach(user => {
            console.log(`Role: ${user.role.padEnd(15)} | Email: ${user.email.padEnd(30)} | Password: ${DEMO_PASSWORD}`);
        });
        console.log('-------------------------------------------\n');

    } catch (error) {
        console.error('❌ Error during seeding:', error);
        process.exit(1);
    } finally {
        if (client) {
            await client.close();
            console.log('🔌 MongoDB connection closed');
        }
    }
}

seedDemo();
