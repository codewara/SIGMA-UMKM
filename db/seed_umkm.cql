/* ======================================================
   PROJECT: SIMBA-UMKM (Sistem Monitoring UMKM - SDG 8)
   FILE: seed_umkm.cql
   DESCRIPTION: Full Dummy Data (Jan - Juni 2024)
   SCENARIO: Tren kenaikan saat Lebaran (April)
   ====================================================== */

USE sigma_ks;

-- ======================================================
-- 1. TABLE: UMKM_FINANCIAL_LOG (DETAIL TRANSAKSI)
-- ======================================================

-- === [KULINER] UMKM_001: Soto Cak Har (Malang) - TREND: NAIK STABIL ===
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (17b3e4b8-62b2-4d97-b0cf-9da1addab974, 2024, 1, toTimestamp(now()), 45000000, 6, 'Soto Cak Har', 'Kuliner', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (17b3e4b8-62b2-4d97-b0cf-9da1addab974, 2024, 2, toTimestamp(now()), 48000000, 6, 'Soto Cak Har', 'Kuliner', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (17b3e4b8-62b2-4d97-b0cf-9da1addab974, 2024, 3, toTimestamp(now()), 55000000, 7, 'Soto Cak Har', 'Kuliner', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (17b3e4b8-62b2-4d97-b0cf-9da1addab974, 2024, 4, toTimestamp(now()), 90000000, 9, 'Soto Cak Har', 'Kuliner', false, null, null, null, null); -- LEBARAN
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (17b3e4b8-62b2-4d97-b0cf-9da1addab974, 2024, 5, toTimestamp(now()), 50000000, 7, 'Soto Cak Har', 'Kuliner', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (17b3e4b8-62b2-4d97-b0cf-9da1addab974, 2024, 6, toTimestamp(now()), 52000000, 7, 'Soto Cak Har', 'Kuliner', false, null, null, null, null);

-- === [KULINER] UMKM_002: Kopi Kenangan Mantan (Surabaya) - TREND: TURUN ===
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (95ff4e68-c0ba-40aa-a13d-c5bcfaec5f2b, 2024, 1, toTimestamp(now()), 30000000, 4, 'Kopi Kenangan Mantan', 'Kuliner', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (95ff4e68-c0ba-40aa-a13d-c5bcfaec5f2b, 2024, 2, toTimestamp(now()), 28000000, 4, 'Kopi Kenangan Mantan', 'Kuliner', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (95ff4e68-c0ba-40aa-a13d-c5bcfaec5f2b, 2024, 3, toTimestamp(now()), 25000000, 3, 'Kopi Kenangan Mantan', 'Kuliner', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (95ff4e68-c0ba-40aa-a13d-c5bcfaec5f2b, 2024, 4, toTimestamp(now()), 35000000, 3, 'Kopi Kenangan Mantan', 'Kuliner', false, null, null, null, null); -- EFEK LIBUR
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (95ff4e68-c0ba-40aa-a13d-c5bcfaec5f2b, 2024, 5, toTimestamp(now()), 20000000, 3, 'Kopi Kenangan Mantan', 'Kuliner', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (95ff4e68-c0ba-40aa-a13d-c5bcfaec5f2b, 2024, 6, toTimestamp(now()), 18000000, 2, 'Kopi Kenangan Mantan', 'Kuliner', false, null, null, null, null);

-- === [KULINER] UMKM_003: Keripik Buah Batu (Malang) - TREND: MUSIMAN ===
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (1f445d1b-858d-4658-b2db-3425c7fceda8, 2024, 1, toTimestamp(now()), 15000000, 5, 'Keripik Buah Batu', 'Kuliner', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (1f445d1b-858d-4658-b2db-3425c7fceda8, 2024, 2, toTimestamp(now()), 18000000, 5, 'Keripik Buah Batu', 'Kuliner', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (1f445d1b-858d-4658-b2db-3425c7fceda8, 2024, 3, toTimestamp(now()), 25000000, 6, 'Keripik Buah Batu', 'Kuliner', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (1f445d1b-858d-4658-b2db-3425c7fceda8, 2024, 4, toTimestamp(now()), 50000000, 10, 'Keripik Buah Batu', 'Kuliner', false, null, null, null, null); -- OLEH OLEH LEBARAN
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (1f445d1b-858d-4658-b2db-3425c7fceda8, 2024, 5, toTimestamp(now()), 20000000, 5, 'Keripik Buah Batu', 'Kuliner', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (1f445d1b-858d-4658-b2db-3425c7fceda8, 2024, 6, toTimestamp(now()), 15000000, 5, 'Keripik Buah Batu', 'Kuliner', false, null, null, null, null);

-- === [KULINER] UMKM_004: Martabak Sultan (Jakarta) - TREND: FLAT TINGGI ===
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (86c103ca-afcd-43d9-b735-178a8afe4076, 2024, 1, toTimestamp(now()), 60000000, 4, 'Martabak Sultan', 'Kuliner', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (86c103ca-afcd-43d9-b735-178a8afe4076, 2024, 2, toTimestamp(now()), 62000000, 4, 'Martabak Sultan', 'Kuliner', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (86c103ca-afcd-43d9-b735-178a8afe4076, 2024, 3, toTimestamp(now()), 65000000, 4, 'Martabak Sultan', 'Kuliner', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (86c103ca-afcd-43d9-b735-178a8afe4076, 2024, 4, toTimestamp(now()), 80000000, 6, 'Martabak Sultan', 'Kuliner', false, null, null, null, null); -- BUKA PUASA
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (86c103ca-afcd-43d9-b735-178a8afe4076, 2024, 5, toTimestamp(now()), 60000000, 4, 'Martabak Sultan', 'Kuliner', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (86c103ca-afcd-43d9-b735-178a8afe4076, 2024, 6, toTimestamp(now()), 61000000, 4, 'Martabak Sultan', 'Kuliner', false, null, null, null, null);

-- === [FASHION] UMKM_005: Batik Tulis Madura (Surabaya) - TREND: LEBARAN HYPE ===
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (37fd6395-e5d4-4e78-8920-a911abd96e41, 2024, 1, toTimestamp(now()), 75000000, 10, 'Batik Tulis Madura', 'Fashion', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (37fd6395-e5d4-4e78-8920-a911abd96e41, 2024, 2, toTimestamp(now()), 80000000, 10, 'Batik Tulis Madura', 'Fashion', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (37fd6395-e5d4-4e78-8920-a911abd96e41, 2024, 3, toTimestamp(now()), 120000000, 15, 'Batik Tulis Madura', 'Fashion', false, null, null, null, null); -- PROMO RAMADHAN
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (37fd6395-e5d4-4e78-8920-a911abd96e41, 2024, 4, toTimestamp(now()), 180000000, 20, 'Batik Tulis Madura', 'Fashion', false, null, null, null, null); -- BOM LEBARAN
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (37fd6395-e5d4-4e78-8920-a911abd96e41, 2024, 5, toTimestamp(now()), 70000000, 10, 'Batik Tulis Madura', 'Fashion', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (37fd6395-e5d4-4e78-8920-a911abd96e41, 2024, 6, toTimestamp(now()), 75000000, 10, 'Batik Tulis Madura', 'Fashion', false, null, null, null, null);

-- === [FASHION] UMKM_006: Distro Jaksel (Jakarta) - TREND: STABIL ===
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (da15948b-8dd8-4d77-87ba-e050fda8cff0, 2024, 1, toTimestamp(now()), 120000000, 15, 'Distro Jaksel', 'Fashion', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (da15948b-8dd8-4d77-87ba-e050fda8cff0, 2024, 2, toTimestamp(now()), 115000000, 15, 'Distro Jaksel', 'Fashion', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (da15948b-8dd8-4d77-87ba-e050fda8cff0, 2024, 3, toTimestamp(now()), 130000000, 15, 'Distro Jaksel', 'Fashion', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (da15948b-8dd8-4d77-87ba-e050fda8cff0, 2024, 4, toTimestamp(now()), 160000000, 18, 'Distro Jaksel', 'Fashion', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (da15948b-8dd8-4d77-87ba-e050fda8cff0, 2024, 5, toTimestamp(now()), 110000000, 15, 'Distro Jaksel', 'Fashion', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (da15948b-8dd8-4d77-87ba-e050fda8cff0, 2024, 6, toTimestamp(now()), 112000000, 15, 'Distro Jaksel', 'Fashion', false, null, null, null, null);

-- === [FASHION] UMKM_007: Sepatu Cibaduyut (Bandung) - TREND: NAIK PERLAHAN ===
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (37d4da44-831b-4534-bd4b-bcdadddbfb26, 2024, 1, toTimestamp(now()), 35000000, 5, 'Sepatu Cibaduyut', 'Fashion', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (37d4da44-831b-4534-bd4b-bcdadddbfb26, 2024, 2, toTimestamp(now()), 38000000, 6, 'Sepatu Cibaduyut', 'Fashion', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (37d4da44-831b-4534-bd4b-bcdadddbfb26, 2024, 3, toTimestamp(now()), 40000000, 6, 'Sepatu Cibaduyut', 'Fashion', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (37d4da44-831b-4534-bd4b-bcdadddbfb26, 2024, 4, toTimestamp(now()), 55000000, 8, 'Sepatu Cibaduyut', 'Fashion', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (37d4da44-831b-4534-bd4b-bcdadddbfb26, 2024, 5, toTimestamp(now()), 42000000, 6, 'Sepatu Cibaduyut', 'Fashion', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (37d4da44-831b-4534-bd4b-bcdadddbfb26, 2024, 6, toTimestamp(now()), 45000000, 6, 'Sepatu Cibaduyut', 'Fashion', false, null, null, null, null);

-- === [JASA] UMKM_008: Laundry Cepat (Malang) - TREND: STABIL RENDAH ===
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (e5a01f76-3cb8-41b3-bbf0-529fcd9e278d, 2024, 1, toTimestamp(now()), 8000000, 2, 'Laundry Cepat', 'Jasa', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (e5a01f76-3cb8-41b3-bbf0-529fcd9e278d, 2024, 2, toTimestamp(now()), 8500000, 2, 'Laundry Cepat', 'Jasa', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (e5a01f76-3cb8-41b3-bbf0-529fcd9e278d, 2024, 3, toTimestamp(now()), 9000000, 2, 'Laundry Cepat', 'Jasa', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (e5a01f76-3cb8-41b3-bbf0-529fcd9e278d, 2024, 4, toTimestamp(now()), 7000000, 2, 'Laundry Cepat', 'Jasa', false, null, null, null, null); -- LIBUR KARYAWAN PULANG
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (e5a01f76-3cb8-41b3-bbf0-529fcd9e278d, 2024, 5, toTimestamp(now()), 10000000, 3, 'Laundry Cepat', 'Jasa', false, null, null, null, null); -- CUCIAN NUMPUK BALIK MUDIK
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (e5a01f76-3cb8-41b3-bbf0-529fcd9e278d, 2024, 6, toTimestamp(now()), 9000000, 2, 'Laundry Cepat', 'Jasa', false, null, null, null, null);

-- === [JASA] UMKM_009: Barbershop Ganteng (Surabaya) - TREND: NAIK JELANG LEBARAN ===
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (89d522e0-3020-425f-8f55-4b6b126b81a2, 2024, 1, toTimestamp(now()), 12000000, 3, 'Barbershop Ganteng', 'Jasa', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (89d522e0-3020-425f-8f55-4b6b126b81a2, 2024, 2, toTimestamp(now()), 13000000, 3, 'Barbershop Ganteng', 'Jasa', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (89d522e0-3020-425f-8f55-4b6b126b81a2, 2024, 3, toTimestamp(now()), 15000000, 3, 'Barbershop Ganteng', 'Jasa', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (89d522e0-3020-425f-8f55-4b6b126b81a2, 2024, 4, toTimestamp(now()), 25000000, 4, 'Barbershop Ganteng', 'Jasa', false, null, null, null, null); -- POTONG RAMBUT SEBELUM SHOLAT IED
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (89d522e0-3020-425f-8f55-4b6b126b81a2, 2024, 5, toTimestamp(now()), 12000000, 3, 'Barbershop Ganteng', 'Jasa', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (89d522e0-3020-425f-8f55-4b6b126b81a2, 2024, 6, toTimestamp(now()), 13000000, 3, 'Barbershop Ganteng', 'Jasa', false, null, null, null, null);

-- === [KRIYA] UMKM_010: Rotan Indah (Malang) - TREND: TURUN ===
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (201697a6-6746-4076-8532-59f49ce9f6d2, 2024, 1, toTimestamp(now()), 20000000, 8, 'Rotan Indah', 'Kriya', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (201697a6-6746-4076-8532-59f49ce9f6d2, 2024, 2, toTimestamp(now()), 18000000, 7, 'Rotan Indah', 'Kriya', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (201697a6-6746-4076-8532-59f49ce9f6d2, 2024, 3, toTimestamp(now()), 15000000, 6, 'Rotan Indah', 'Kriya', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (201697a6-6746-4076-8532-59f49ce9f6d2, 2024, 4, toTimestamp(now()), 12000000, 5, 'Rotan Indah', 'Kriya', false, null, null, null, null); -- SEPI PEMINAT
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (201697a6-6746-4076-8532-59f49ce9f6d2, 2024, 5, toTimestamp(now()), 15000000, 5, 'Rotan Indah', 'Kriya', false, null, null, null, null);
INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES (201697a6-6746-4076-8532-59f49ce9f6d2, 2024, 6, toTimestamp(now()), 16000000, 5, 'Rotan Indah', 'Kriya', false, null, null, null, null);


-- ======================================================
-- 2. TABLE: DASHBOARD_SECTOR_STATS (AGREGASI)
-- ======================================================
-- Data ini hasil penjumlahan kasar dari data di atas agar grafik sinkron

-- SEKTOR KULINER (UMKM 001, 002, 003, 004)
INSERT INTO dashboard_sector_stats (sektor, tahun, bulan, total_omzet, total_umkm) VALUES ('Kuliner', 2024, 1, 150000000, 4);
INSERT INTO dashboard_sector_stats (sektor, tahun, bulan, total_omzet, total_umkm) VALUES ('Kuliner', 2024, 2, 156000000, 4);
INSERT INTO dashboard_sector_stats (sektor, tahun, bulan, total_omzet, total_umkm) VALUES ('Kuliner', 2024, 3, 170000000, 4);
INSERT INTO dashboard_sector_stats (sektor, tahun, bulan, total_omzet, total_umkm) VALUES ('Kuliner', 2024, 4, 255000000, 4); -- Peak April
INSERT INTO dashboard_sector_stats (sektor, tahun, bulan, total_omzet, total_umkm) VALUES ('Kuliner', 2024, 5, 150000000, 4);
INSERT INTO dashboard_sector_stats (sektor, tahun, bulan, total_omzet, total_umkm) VALUES ('Kuliner', 2024, 6, 146000000, 4);

-- SEKTOR FASHION (UMKM 005, 006, 007)
INSERT INTO dashboard_sector_stats (sektor, tahun, bulan, total_omzet, total_umkm) VALUES ('Fashion', 2024, 1, 230000000, 3);
INSERT INTO dashboard_sector_stats (sektor, tahun, bulan, total_omzet, total_umkm) VALUES ('Fashion', 2024, 2, 233000000, 3);
INSERT INTO dashboard_sector_stats (sektor, tahun, bulan, total_omzet, total_umkm) VALUES ('Fashion', 2024, 3, 290000000, 3);
INSERT INTO dashboard_sector_stats (sektor, tahun, bulan, total_omzet, total_umkm) VALUES ('Fashion', 2024, 4, 395000000, 3); -- Peak April
INSERT INTO dashboard_sector_stats (sektor, tahun, bulan, total_omzet, total_umkm) VALUES ('Fashion', 2024, 5, 222000000, 3);
INSERT INTO dashboard_sector_stats (sektor, tahun, bulan, total_omzet, total_umkm) VALUES ('Fashion', 2024, 6, 232000000, 3);

-- SEKTOR JASA (UMKM 008, 009)
INSERT INTO dashboard_sector_stats (sektor, tahun, bulan, total_omzet, total_umkm) VALUES ('Jasa', 2024, 1, 20000000, 2);
INSERT INTO dashboard_sector_stats (sektor, tahun, bulan, total_omzet, total_umkm) VALUES ('Jasa', 2024, 2, 21500000, 2);
INSERT INTO dashboard_sector_stats (sektor, tahun, bulan, total_omzet, total_umkm) VALUES ('Jasa', 2024, 3, 24000000, 2);
INSERT INTO dashboard_sector_stats (sektor, tahun, bulan, total_omzet, total_umkm) VALUES ('Jasa', 2024, 4, 32000000, 2); -- Peak April
INSERT INTO dashboard_sector_stats (sektor, tahun, bulan, total_omzet, total_umkm) VALUES ('Jasa', 2024, 5, 22000000, 2);
INSERT INTO dashboard_sector_stats (sektor, tahun, bulan, total_omzet, total_umkm) VALUES ('Jasa', 2024, 6, 22000000, 2);

-- SEKTOR KRIYA (UMKM 010)
INSERT INTO dashboard_sector_stats (sektor, tahun, bulan, total_omzet, total_umkm) VALUES ('Kriya', 2024, 1, 20000000, 1);
INSERT INTO dashboard_sector_stats (sektor, tahun, bulan, total_omzet, total_umkm) VALUES ('Kriya', 2024, 2, 18000000, 1);
INSERT INTO dashboard_sector_stats (sektor, tahun, bulan, total_omzet, total_umkm) VALUES ('Kriya', 2024, 3, 15000000, 1);
INSERT INTO dashboard_sector_stats (sektor, tahun, bulan, total_omzet, total_umkm) VALUES ('Kriya', 2024, 4, 12000000, 1);
INSERT INTO dashboard_sector_stats (sektor, tahun, bulan, total_omzet, total_umkm) VALUES ('Kriya', 2024, 5, 15000000, 1);
INSERT INTO dashboard_sector_stats (sektor, tahun, bulan, total_omzet, total_umkm) VALUES ('Kriya', 2024, 6, 16000000, 1);


-- ======================================================
-- 3. TABLE: DASHBOARD_REGION_STATS (AGREGASI)
-- ======================================================

-- MALANG (UMKM 001, 003, 008, 010)
INSERT INTO dashboard_region_stats (kota, tahun, bulan, total_omzet, umkm_aktif) VALUES ('Malang', 2024, 1, 88000000, 4);
INSERT INTO dashboard_region_stats (kota, tahun, bulan, total_omzet, umkm_aktif) VALUES ('Malang', 2024, 2, 92500000, 4);
INSERT INTO dashboard_region_stats (kota, tahun, bulan, total_omzet, umkm_aktif) VALUES ('Malang', 2024, 3, 104000000, 4);
INSERT INTO dashboard_region_stats (kota, tahun, bulan, total_omzet, umkm_aktif) VALUES ('Malang', 2024, 4, 159000000, 4); -- Peak
INSERT INTO dashboard_region_stats (kota, tahun, bulan, total_omzet, umkm_aktif) VALUES ('Malang', 2024, 5, 95000000, 4);
INSERT INTO dashboard_region_stats (kota, tahun, bulan, total_omzet, umkm_aktif) VALUES ('Malang', 2024, 6, 92000000, 4);

-- SURABAYA (UMKM 002, 005, 009)
INSERT INTO dashboard_region_stats (kota, tahun, bulan, total_omzet, umkm_aktif) VALUES ('Surabaya', 2024, 1, 117000000, 3);
INSERT INTO dashboard_region_stats (kota, tahun, bulan, total_omzet, umkm_aktif) VALUES ('Surabaya', 2024, 2, 121000000, 3);
INSERT INTO dashboard_region_stats (kota, tahun, bulan, total_omzet, umkm_aktif) VALUES ('Surabaya', 2024, 3, 160000000, 3);
INSERT INTO dashboard_region_stats (kota, tahun, bulan, total_omzet, umkm_aktif) VALUES ('Surabaya', 2024, 4, 240000000, 3); -- Peak
INSERT INTO dashboard_region_stats (kota, tahun, bulan, total_omzet, umkm_aktif) VALUES ('Surabaya', 2024, 5, 102000000, 3);
INSERT INTO dashboard_region_stats (kota, tahun, bulan, total_omzet, umkm_aktif) VALUES ('Surabaya', 2024, 6, 106000000, 3);

-- JAKARTA (UMKM 004, 006)
INSERT INTO dashboard_region_stats (kota, tahun, bulan, total_omzet, umkm_aktif) VALUES ('Jakarta', 2024, 1, 180000000, 2);
INSERT INTO dashboard_region_stats (kota, tahun, bulan, total_omzet, umkm_aktif) VALUES ('Jakarta', 2024, 2, 177000000, 2);
INSERT INTO dashboard_region_stats (kota, tahun, bulan, total_omzet, umkm_aktif) VALUES ('Jakarta', 2024, 3, 195000000, 2);
INSERT INTO dashboard_region_stats (kota, tahun, bulan, total_omzet, umkm_aktif) VALUES ('Jakarta', 2024, 4, 240000000, 2); -- Peak
INSERT INTO dashboard_region_stats (kota, tahun, bulan, total_omzet, umkm_aktif) VALUES ('Jakarta', 2024, 5, 170000000, 2);
INSERT INTO dashboard_region_stats (kota, tahun, bulan, total_omzet, umkm_aktif) VALUES ('Jakarta', 2024, 6, 173000000, 2);

-- BANDUNG (UMKM 007)
INSERT INTO dashboard_region_stats (kota, tahun, bulan, total_omzet, umkm_aktif) VALUES ('Bandung', 2024, 1, 35000000, 1);
INSERT INTO dashboard_region_stats (kota, tahun, bulan, total_omzet, umkm_aktif) VALUES ('Bandung', 2024, 2, 38000000, 1);
INSERT INTO dashboard_region_stats (kota, tahun, bulan, total_omzet, umkm_aktif) VALUES ('Bandung', 2024, 3, 40000000, 1);
INSERT INTO dashboard_region_stats (kota, tahun, bulan, total_omzet, umkm_aktif) VALUES ('Bandung', 2024, 4, 55000000, 1); -- Peak
INSERT INTO dashboard_region_stats (kota, tahun, bulan, total_omzet, umkm_aktif) VALUES ('Bandung', 2024, 5, 42000000, 1);
INSERT INTO dashboard_region_stats (kota, tahun, bulan, total_omzet, umkm_aktif) VALUES ('Bandung', 2024, 6, 45000000, 1);


-- ======================================================
-- 4. TABLE: ANALYSIS_UMKM_GROWTH (HASIL AI / PREDIKSI)
-- ======================================================

-- Data Quarter 1 (Evaluasi Jan-Mar)
INSERT INTO analysis_umkm_growth (umkm_id, periode, growth_rate, status_kesehatan, rekomendasi) VALUES (17b3e4b8-62b2-4d97-b0cf-9da1addab974, '2024-Q1', 22.0, 'Sangat Sehat', 'Pertahankan kualitas jelang lebaran');
INSERT INTO analysis_umkm_growth (umkm_id, periode, growth_rate, status_kesehatan, rekomendasi) VALUES (95ff4e68-c0ba-40aa-a13d-c5bcfaec5f2b, '2024-Q1', -16.0, 'Waspada', 'Perlu inovasi menu baru');
INSERT INTO analysis_umkm_growth (umkm_id, periode, growth_rate, status_kesehatan, rekomendasi) VALUES (37fd6395-e5d4-4e78-8920-a911abd96e41, '2024-Q1', 60.0, 'Sangat Sehat', 'Stok barang harus ditambah');
INSERT INTO analysis_umkm_growth (umkm_id, periode, growth_rate, status_kesehatan, rekomendasi) VALUES (201697a6-6746-4076-8532-59f49ce9f6d2, '2024-Q1', -25.0, 'Kritis', 'Perlu bantuan pemasaran digital');

-- Data Quarter 2 (Evaluasi Apr-Jun)
INSERT INTO analysis_umkm_growth (umkm_id, periode, growth_rate, status_kesehatan, rekomendasi) VALUES (17b3e4b8-62b2-4d97-b0cf-9da1addab974, '2024-Q2', 5.0, 'Stabil', 'Antisipasi penurunan pasca lebaran');
INSERT INTO analysis_umkm_growth (umkm_id, periode, growth_rate, status_kesehatan, rekomendasi) VALUES (37fd6395-e5d4-4e78-8920-a911abd96e41, '2024-Q2', -10.0, 'Normalisasi', 'Simpan profit untuk modal putaran depan');