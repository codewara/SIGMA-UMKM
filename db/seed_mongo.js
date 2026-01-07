/* ======================================================
   PROJECT: SIMBA-UMKM (Sistem Monitoring UMKM - SDG 8)
   FILE: seed_mongo.js
   DESCRIPTION: Schema & Seed Data for MongoDB
   NOTE: _id must match umkm_id in Cassandra
   ====================================================== */

// 1. SELECT DATABASE
// Perintah ini setara dengan 'USE simba_umkm' di SQL
db = db.getSiblingDB('sigma_db');

// 2. CLEANUP (Hapus data lama biar gak duplikat error)
db.umkm_profiles.drop();
db.users.drop();
db.sessions.drop();

// 3. DEFINE SCHEMA & INSERT DATA
// MongoDB tidak butuh "CREATE TABLE", langsung insert saja.
// Struktur ini mencakup Profil, Lokasi (GeoJSON), dan Verifikasi.

db.umkm_profiles.insertMany([
  // === KULINER (4 Data) ===
  {
    "_id": UUID("17b3e4b8-62b2-4d97-b0cf-9da1addab974"), // SYNC: Harus sama dengan Cassandra
    "nama_usaha": "Soto Cak Har",
    "sektor": "Kuliner",
    "tanggal_bergabung": new Date("2023-01-15"),
    "pemilik": {
      "nama": "Haryanto",
      "nik": "3573012202900001",
      "telepon": "081234567890",
      "email": "cakhar@soto.com"
    },
    "lokasi": {
      "type": "Point",
      "coordinates": [112.6426, -7.9466] // [Longitude, Latitude] - Malang
    },
    "wilayah": {
      "kota": "Malang",
      "provinsi": "Jawa Timur",
      "alamat_lengkap": "Jl. Soekarno Hatta No. 12"
    },
    "legalitas": {
      "nib": "1234567890",
      "pirt": "PIRT-2023-001",
      "halal": true
    },
    "summary_terakhir": { // Cache untuk list view
      "omzet_terakhir": 52000000,
      "bulan": 6
    }
  },
  {
    "_id": UUID("95ff4e68-c0ba-40aa-a13d-c5bcfaec5f2b"),
    "nama_usaha": "Kopi Kenangan Mantan",
    "sektor": "Kuliner",
    "tanggal_bergabung": new Date("2023-03-10"),
    "pemilik": {
      "nama": "Bella",
      "nik": "3578015505950002",
      "telepon": "081298765432"
    },
    "lokasi": {
      "type": "Point",
      "coordinates": [112.7521, -7.2575] // Surabaya
    },
    "wilayah": {
      "kota": "Surabaya",
      "provinsi": "Jawa Timur",
      "alamat_lengkap": "Jl. Tunjungan No. 55"
    },
    "legalitas": { "nib": "9876543210", "halal": true },
    "summary_terakhir": { "omzet_terakhir": 18000000, "bulan": 6 }
  },
  {
    "_id": UUID("1f445d1b-858d-4658-b2db-3425c7fceda8"),
    "nama_usaha": "Keripik Buah Batu",
    "sektor": "Kuliner",
    "tanggal_bergabung": new Date("2023-05-20"),
    "pemilik": { "nama": "Slamet", "telepon": "081333444555" },
    "lokasi": {
      "type": "Point",
      "coordinates": [112.5256, -7.8696] // Batu/Malang
    },
    "wilayah": {
      "kota": "Malang",
      "provinsi": "Jawa Timur",
      "alamat_lengkap": "Jl. Diponegoro Batu"
    },
    "legalitas": { "pirt": "PIRT-2023-005", "halal": false },
    "summary_terakhir": { "omzet_terakhir": 15000000, "bulan": 6 }
  },
  {
    "_id": UUID("86c103ca-afcd-43d9-b735-178a8afe4076"),
    "nama_usaha": "Martabak Sultan",
    "sektor": "Kuliner",
    "tanggal_bergabung": new Date("2022-11-11"),
    "pemilik": { "nama": "Raffi", "telepon": "081777888999" },
    "lokasi": {
      "type": "Point",
      "coordinates": [106.8456, -6.2088] // Jakarta
    },
    "wilayah": {
      "kota": "Jakarta",
      "provinsi": "DKI Jakarta",
      "alamat_lengkap": "Jl. Menteng Raya"
    },
    "legalitas": { "nib": "1122334455", "halal": true },
    "summary_terakhir": { "omzet_terakhir": 61000000, "bulan": 6 }
  },

  // === FASHION (3 Data) ===
  {
    "_id": UUID("37fd6395-e5d4-4e78-8920-a911abd96e41"),
    "nama_usaha": "Batik Tulis Madura",
    "sektor": "Fashion",
    "tanggal_bergabung": new Date("2021-08-17"),
    "pemilik": { "nama": "Mahfud", "telepon": "081888999000" },
    "lokasi": {
      "type": "Point",
      "coordinates": [112.7688, -7.2288] // Surabaya (Gudang Pusat)
    },
    "wilayah": {
      "kota": "Surabaya",
      "provinsi": "Jawa Timur"
    },
    "legalitas": { "nib": "5566778899" },
    "summary_terakhir": { "omzet_terakhir": 75000000, "bulan": 6 }
  },
  {
    "_id": UUID("da15948b-8dd8-4d77-87ba-e050fda8cff0"),
    "nama_usaha": "Distro Jaksel",
    "sektor": "Fashion",
    "tanggal_bergabung": new Date("2023-01-01"),
    "pemilik": { "nama": "Kiki", "telepon": "081999000111" },
    "lokasi": {
      "type": "Point",
      "coordinates": [106.8000, -6.2500] // Jakarta Selatan
    },
    "wilayah": {
      "kota": "Jakarta",
      "provinsi": "DKI Jakarta"
    },
    "legalitas": { "nib": "9988776655" },
    "summary_terakhir": { "omzet_terakhir": 112000000, "bulan": 6 }
  },
  {
    "_id": UUID("37d4da44-831b-4534-bd4b-bcdadddbfb26"),
    "nama_usaha": "Sepatu Cibaduyut",
    "sektor": "Fashion",
    "tanggal_bergabung": new Date("2022-05-05"),
    "pemilik": { "nama": "Kang Asep", "telepon": "081222333444" },
    "lokasi": {
      "type": "Point",
      "coordinates": [107.5956, -6.9456] // Bandung
    },
    "wilayah": {
      "kota": "Bandung",
      "provinsi": "Jawa Barat"
    },
    "legalitas": { "nib": "3344556677" },
    "summary_terakhir": { "omzet_terakhir": 45000000, "bulan": 6 }
  },

  // === JASA (2 Data) ===
  {
    "_id": UUID("e5a01f76-3cb8-41b3-bbf0-529fcd9e278d"),
    "nama_usaha": "Laundry Cepat",
    "sektor": "Jasa",
    "tanggal_bergabung": new Date("2024-01-01"),
    "pemilik": { "nama": "Bu Siti", "telepon": "081555666777" },
    "lokasi": {
      "type": "Point",
      "coordinates": [112.6200, -7.9500] // Malang
    },
    "wilayah": {
      "kota": "Malang",
      "provinsi": "Jawa Timur"
    },
    "summary_terakhir": { "omzet_terakhir": 9000000, "bulan": 6 }
  },
  {
    "_id": UUID("89d522e0-3020-425f-8f55-4b6b126b81a2"),
    "nama_usaha": "Barbershop Ganteng",
    "sektor": "Jasa",
    "tanggal_bergabung": new Date("2023-12-12"),
    "pemilik": { "nama": "Doni", "telepon": "081444555666" },
    "lokasi": {
      "type": "Point",
      "coordinates": [112.7400, -7.2600] // Surabaya
    },
    "wilayah": {
      "kota": "Surabaya",
      "provinsi": "Jawa Timur"
    },
    "summary_terakhir": { "omzet_terakhir": 13000000, "bulan": 6 }
  },

  // === KRIYA (1 Data) ===
  {
    "_id": UUID("201697a6-6746-4076-8532-59f49ce9f6d2"),
    "nama_usaha": "Rotan Indah",
    "sektor": "Kriya",
    "tanggal_bergabung": new Date("2020-02-20"),
    "pemilik": { "nama": "Pak Eko", "telepon": "081111222333" },
    "lokasi": {
      "type": "Point",
      "coordinates": [112.6100, -7.9700] // Malang
    },
    "wilayah": {
      "kota": "Malang",
      "provinsi": "Jawa Timur"
    },
    "summary_terakhir": { "omzet_terakhir": 16000000, "bulan": 6 }
  }
]);

// 4. CREATE INDEXING (PENTING!)
// Index GeoSpatial agar fitur "Cari UMKM Terdekat" di Peta berfungsi
db.umkm_profiles.createIndex({ "lokasi": "2dsphere" });

// Index untuk filter dashboard agar cepat
db.umkm_profiles.createIndex({ "sektor": 1, "wilayah.kota": 1 });

print("✅ UMKM Profiles: 10 documents inserted.");

// ============================================================
// 5. SEED USER ACCOUNTS (ADMIN & PEJABAT)
// ============================================================
// Password hashes from generate_password_hashes.js

db.users.insertMany([
  {
    "_id": UUID("a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d"),
    "email": "admin@sigma-umkm.com",
    "password_hash": "$2b$12$f9KiMzOwK9U9cvreTR/IbuMLLhyJzNUg7Ya2VdlJD5iapqn2kIaP6",
    "role": "ADMIN",
    "account_status": "active",
    "created_at": new Date("2024-01-01T08:00:00Z")
  },
  {
    "_id": UUID("b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e"),
    "email": "pejabat@sigma-umkm.com",
    "password_hash": "$2b$12$E6b6L9dQZVdylbEUafhcd.IYbHgHCAg8PBfoLCNy2N8XXJjnuAc06",
    "role": "PEJABAT",
    "account_status": "active",
    "created_at": new Date("2024-01-01T08:00:00Z")
  },
  {
    "_id": UUID("c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f"),
    "email": "owner@sigma-umkm.com",
    "password_hash": "$2b$12$5d3VtHZKpN2Yq8R9xL1Mm.9K7bJ4cF2sX3wP6mD8nQ1eYaZ0TuCGa",
    "role": "UMKM_OWNER",
    "account_status": "active",
    "created_at": new Date("2024-01-01T08:00:00Z")
  },
  {
    "_id": UUID("d4e5f6a7-b8c9-7d8e-1f2a-3b4c5d6e7f8a"),
    "email": "owner2@sigma-umkm.com",
    "password_hash": "$2b$12$9mL2oK1pJ3iH4uG5fE6tD.8C7bX0vW9yZ2aS1rQ0pO9nM8lK7jI6",
    "role": "UMKM_OWNER",
    "account_status": "active",
    "created_at": new Date("2024-01-01T08:00:00Z")
  }
]);

// Index untuk email lookup (unique)
db.users.createIndex({ "email": 1 }, { unique: true });

// Index untuk session cleanup (TTL)
db.sessions.createIndex({ "expires_at": 1 }, { expireAfterSeconds: 0 });

print("✅ Users: 4 accounts created (ADMIN, PEJABAT, UMKM_OWNER x2).");
print("📧 Login Credentials:");
print("   ADMIN       → admin@sigma-umkm.com : admin123");
print("   PEJABAT     → pejabat@sigma-umkm.com : pejabat123");
print("   UMKM_OWNER  → owner@sigma-umkm.com : owner123");
print("   UMKM_OWNER  → owner2@sigma-umkm.com : owner123");
print("");
print("SEED MONGODB SUCCESS: All data inserted.");