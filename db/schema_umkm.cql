/* ======================================================
   PROJECT: SIMBA-UMKM (Sistem Monitoring UMKM - SDG 8)
   FILE: schema_umkm.cql
   DESCRIPTION: Structure Definition (Keyspace & Tables)
   ====================================================== */

-- 1. SETUP KEYSPACE
CREATE KEYSPACE IF NOT EXISTS sigma_ks 
WITH replication = {
    'class': 'SimpleStrategy', 
    'replication_factor': 1
};

USE sigma_ks;

-- 2. CREATE TABLES

-- Table 1: Financial Log (Detail Transaksi)
-- Partition Key: (umkm_id, tahun) -> Data 1 tahun kumpul jadi satu
-- Clustering Key: bulan DESC -> Data terbaru paling atas
CREATE TABLE umkm_financial_log (
    umkm_id uuid,
    tahun int,
    bulan int,
    tgl_input timestamp,
    omzet decimal,
    jumlah_karyawan int,
    nama_usaha text, -- Denormalisasi
    sektor text,     -- Denormalisasi
    PRIMARY KEY ((umkm_id, tahun), bulan)
) WITH CLUSTERING ORDER BY (bulan DESC);

-- Table 2: Sector Stats (Dashboard Agregat Sektor)
-- Partition Key: (sektor, tahun)
CREATE TABLE dashboard_sector_stats (
    sektor text,
    tahun int,
    bulan int,
    total_omzet decimal,
    total_umkm int,
    PRIMARY KEY ((sektor, tahun), bulan)
) WITH CLUSTERING ORDER BY (bulan ASC);

-- Table 3: Region Stats (Dashboard Agregat Wilayah)
-- Partition Key: (kota, tahun)
CREATE TABLE dashboard_region_stats (
    kota text,
    tahun int,
    bulan int,
    total_omzet decimal,
    umkm_aktif int,
    PRIMARY KEY ((kota, tahun), bulan)
) WITH CLUSTERING ORDER BY (bulan ASC);

-- Table 4: AI Analysis Results
CREATE TABLE analysis_umkm_growth (
    umkm_id uuid,
    periode text, -- e.g., '2024-Q1'
    growth_rate float,
    status_kesehatan text,
    rekomendasi text,
    PRIMARY KEY (umkm_id, periode)
);

-- Table 5: Login Activity Logs
CREATE TABLE login_logs (
    user_id uuid,
    login_time timestamp,
    status text,
    ip_address inet,
    device_info text,
    PRIMARY KEY ((user_id), login_time)
) WITH CLUSTERING ORDER BY (login_time DESC);

-- Table 6: 
CREATE TABLE temp_tokens (
    token_value uuid PRIMARY KEY,
    user_id uuid,
    purpose text, -- e.g., 'password_reset', 'email_verification'
) WITH default_time_to_live = 900; -- 15 minutes TTL

-- Table 7: Login Attempts Counter
CREATE TABLE login_attempts (
    ip_address inet PRIMARY KEY,
    attempt_count counter
);
