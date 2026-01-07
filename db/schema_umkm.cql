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
DROP TABLE IF EXISTS umkm_financial_log;
CREATE TABLE umkm_financial_log (
    umkm_id uuid,
    tahun int,
    bulan int,
    tgl_input timestamp,
    omzet decimal,
    jumlah_karyawan int,
    nama_usaha text, -- Denormalisasi
    sektor text,     -- Denormalisasi
    
    -- NEW FIELDS FOR FLAGGING --
    is_flagged boolean,       -- True if PEJABAT flags as suspicious
    flag_reason text,         -- "Angka tidak wajar", "Perlu audit"
    flagged_by uuid,          -- ID of PEJABAT who flagged
    flagged_at timestamp,     -- When flagged
    
    -- NEW FIELD FOR AUDIT TRAIL --
    input_by uuid,            -- ID of UMKM_OWNER who input data
    
    PRIMARY KEY ((umkm_id, tahun), bulan)
) WITH CLUSTERING ORDER BY (bulan DESC);

-- Table 2: Sector Stats (Dashboard Agregat Sektor)
-- Partition Key: (sektor, tahun)
DROP TABLE IF EXISTS dashboard_sector_stats;
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
DROP TABLE IF EXISTS dashboard_region_stats;
CREATE TABLE dashboard_region_stats (
    kota text,
    tahun int,
    bulan int,
    total_omzet decimal,
    umkm_aktif int,
    PRIMARY KEY ((kota, tahun), bulan)
) WITH CLUSTERING ORDER BY (bulan ASC);

-- Table 4: AI Analysis Results
DROP TABLE IF EXISTS analysis_umkm_growth;
CREATE TABLE analysis_umkm_growth (
    umkm_id uuid,
    periode text, -- e.g., '2024-Q1'
    growth_rate float,
    status_kesehatan text,
    rekomendasi text,
    PRIMARY KEY (umkm_id, periode)
);

-- Table 5: Login Activity Logs
DROP TABLE IF EXISTS login_logs;
CREATE TABLE login_logs (
    user_id uuid,
    login_time timestamp,
    status text,
    ip_address inet,
    device_info text,
    PRIMARY KEY ((user_id), login_time)
) WITH CLUSTERING ORDER BY (login_time DESC);

-- Table 6: 
DROP TABLE IF EXISTS temp_tokens;
CREATE TABLE temp_tokens (
    token_value uuid PRIMARY KEY,
    user_id uuid,
    purpose text, -- e.g., 'password_reset', 'email_verification'
) WITH default_time_to_live = 900; -- 15 minutes TTL

-- Table 7: Login Attempts Counter
DROP TABLE IF EXISTS login_attempts;
CREATE TABLE login_attempts (
    ip_address inet PRIMARY KEY,
    attempt_count counter
);
-- Table 8: Verification Tasks (for PEJABAT queue)
-- ⚠️ HOT PARTITION WARNING: All PENDING tasks go to same partition
-- Acceptable for prototype (<50 records), but for production use month_year bucketing
DROP TABLE IF EXISTS verification_tasks;
CREATE TABLE verification_tasks (
    umkm_id uuid,
    created_at timestamp,
    nama_usaha text,
    owner_email text,
    status text,  -- PENDING | VERIFIED | REJECTED
    PRIMARY KEY (status, created_at)
) WITH CLUSTERING ORDER BY (created_at DESC);

-- Table 9: Flag Notifications (for UMKM_OWNER notifications)
DROP TABLE IF EXISTS flag_notifications;
CREATE TABLE flag_notifications (
    owner_id uuid,
    created_at timestamp,
    umkm_id uuid,
    bulan int,
    tahun int,
    flag_reason text,
    flagged_by_name text,
    is_read boolean,
    PRIMARY KEY (owner_id, created_at)
) WITH CLUSTERING ORDER BY (created_at DESC);