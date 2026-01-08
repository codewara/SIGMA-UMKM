/**
 * SEED ANALYTICS HISTORY (2024-2026)
 * 
 * Purpose: Generate realistic 3-year financial data for existing UMKMs
 * Run: node scripts/seed-analytics-history.js
 */

const { MongoClient } = require('mongodb');
const cassandra = require('cassandra-driver');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://root:sigma@localhost:27018?authSource=admin';
const CASSANDRA_CONTACT_POINTS = (process.env.CASSANDRA_CONTACT_POINTS || 'localhost:9043').split(',');
const CASSANDRA_KEYSPACE = process.env.CASSANDRA_KEYSPACE || 'sigma_ks';
const CASSANDRA_LOCAL_DATACENTER = process.env.CASSANDRA_LOCAL_DATACENTER || 'datacenter1';

// ============================================================
// CONFIGURATION
// ============================================================

// Seasonal multipliers
const SEASONAL_FACTORS = {
  1: 0.85,   // Januari
  2: 0.90,   // Februari
  3: 0.95,   // Maret
  4: 1.00,   // April
  5: 1.05,   // Mei
  6: 1.10,   // Juni
  7: 1.15,   // Juli
  8: 1.00,   // Agustus
  9: 1.05,   // September
  10: 1.08,  // Oktober
  11: 1.25,  // November
  12: 1.40,  // Desember
};

const MONTHLY_GROWTH_RATE = 0.015; // 1.5% month-over-month

const SECTOR_BASE_REVENUE = {
  'Kuliner': { min: 10000000, max: 50000000 },
  'Fashion': { min: 8000000, max: 40000000 },
  'Kriya': { min: 5000000, max: 30000000 },
  'Jasa': { min: 15000000, max: 60000000 },
  'Lainnya': { min: 7000000, max: 35000000 },
};

const EMPLOYEE_RANGE = { min: 1, max: 10 };

const CITY_COORDINATES = {
  'Malang': {
    lat: -7.9466,
    lng: 112.6426,
    bounds: { minLat: -7.98, maxLat: -7.91, minLng: 112.60, maxLng: 112.68 }
  },
  'Surabaya': {
    lat: -7.2575,
    lng: 112.7508,
    bounds: { minLat: -7.30, maxLat: -7.20, minLng: 112.70, maxLng: 112.80 }
  },
  'Jakarta': {
    lat: -6.2088,
    lng: 106.8456,
    bounds: { minLat: -6.35, maxLat: -6.08, minLng: 106.70, maxLng: 106.97 }
  },
  'Bandung': {
    lat: -6.9271,
    lng: 107.6411,
    bounds: { minLat: -6.98, maxLat: -6.88, minLng: 107.55, maxLng: 107.73 }
  },
  'Yogyakarta': {
    lat: -7.7956,
    lng: 110.3695,
    bounds: { minLat: -7.85, maxLat: -7.74, minLng: 110.30, maxLng: 110.43 }
  },
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomCoordinates(kota) {
  const cityData = CITY_COORDINATES[kota] || CITY_COORDINATES['Malang'];
  const { bounds } = cityData;
  
  const lng = randomFloat(bounds.minLng, bounds.maxLng);
  const lat = randomFloat(bounds.minLat, bounds.maxLat);
  
  return [lng, lat];
}

function getBaseRevenue(sektor) {
  const range = SECTOR_BASE_REVENUE[sektor] || SECTOR_BASE_REVENUE['Lainnya'];
  return randomInRange(range.min, range.max);
}

function calculateMonthlyRevenue(baseRevenue, monthIndex, month) {
  const seasonalFactor = SEASONAL_FACTORS[month] || 1.0;
  const growthFactor = Math.pow(1 + MONTHLY_GROWTH_RATE, monthIndex);
  const variability = randomFloat(0.95, 1.05);
  
  return Math.round(baseRevenue * seasonalFactor * growthFactor * variability);
}

function formatProgress(current, total, label) {
  const percentage = ((current / total) * 100).toFixed(1);
  const filled = Math.floor((current / total) * 30);
  const empty = 30 - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  
  process.stdout.write(`\r  ${label}: [${bar}] ${percentage}%`);
}

// ============================================================
// MAIN SEED SCRIPT
// ============================================================

async function seedAnalyticsHistory() {
  let mongoClient = null;
  let cassandraClient = null;

  try {
    console.log('\n📊 ANALYTICS HISTORY SEEDING (2024-2026)');
    console.log('═'.repeat(60));

    // STEP 1: CONNECT TO DATABASES
    console.log('\n🔌 Connecting to databases...');
    
    mongoClient = new MongoClient(MONGO_URI);
    await mongoClient.connect();
    const mongoDb = mongoClient.db('sigma_db');
    const umkmCollection = mongoDb.collection('umkm_profiles');
    console.log('  ✅ MongoDB connected');

    cassandraClient = new cassandra.Client({
      contactPoints: CASSANDRA_CONTACT_POINTS,
      localDataCenter: CASSANDRA_LOCAL_DATACENTER,
      keyspace: CASSANDRA_KEYSPACE,
    });
    await cassandraClient.connect();
    console.log('  ✅ Cassandra connected');

    // STEP 2: FETCH EXISTING UMKMs FROM MONGODB
    console.log('\n📥 Fetching existing UMKMs from MongoDB...');
    const umkms = await umkmCollection.find({
      is_deleted: { $ne: true }
    }).toArray();
    
    console.log(`  ✅ Found ${umkms.length} active UMKMs`);

    if (umkms.length === 0) {
      console.log('\n⚠️  No UMKMs found! Please seed MongoDB first.');
      return;
    }

    // STEP 3: PREPARE DATA STRUCTURES
    console.log('\n🗂️  Preparing data structures...');

    const financialLogs = [];
    const sectorStats = new Map();
    const regionStats = new Map();
    const umkmLatestSummary = new Map();

    console.log('  ✅ Data structures initialized');

    // STEP 4: GENERATE FINANCIAL LOGS (2024-2026)
    console.log('\n💰 Generating financial logs for 36 months...');

    const totalMonths = 36;
    let logCounter = 0;

    for (let monthIndex = 0; monthIndex < totalMonths; monthIndex++) {
      const date = new Date(2024, monthIndex, 1);
      const tahun = date.getFullYear();
      const bulan = date.getMonth() + 1;
      
      formatProgress(monthIndex + 1, totalMonths, 'Generating logs');

      for (const umkm of umkms) {
        const umkmId = String(umkm._id);
        const baseRevenue = getBaseRevenue(umkm.sektor);
        const omzet = calculateMonthlyRevenue(baseRevenue, monthIndex, bulan);
        const karyawan = randomInRange(EMPLOYEE_RANGE.min, EMPLOYEE_RANGE.max);

        const financialLog = {
          umkm_id: cassandra.types.Uuid.fromString(umkmId),
          tahun: tahun,
          bulan: bulan,
          tanggal_input: new Date(),
          omzet: omzet,
          jumlah_karyawan: karyawan,
          catatan: `Auto-generated data for month ${bulan}/${tahun}`,
          nama_usaha: umkm.nama_usaha,
          sektor: umkm.sektor,
          is_flagged: false,
          input_by: null,
        };

        financialLogs.push(financialLog);
        logCounter++;

        const existingSummary = umkmLatestSummary.get(umkmId);
        if (!existingSummary || 
            tahun > existingSummary.year || 
            (tahun === existingSummary.year && bulan > existingSummary.month)) {
          umkmLatestSummary.set(umkmId, { omzet, month: bulan, year: tahun });
        }

        const sectorKey = `${umkm.sektor}/${tahun}/${bulan}`;
        if (sectorStats.has(sectorKey)) {
          const stat = sectorStats.get(sectorKey);
          stat.total_omzet += omzet;
          stat.total_umkm += 1;
        } else {
          sectorStats.set(sectorKey, {
            sektor: umkm.sektor,
            tahun: tahun,
            bulan: bulan,
            total_omzet: omzet,
            total_umkm: 1,
          });
        }

        const regionKey = `${umkm.wilayah.kota}/${tahun}/${bulan}`;
        if (regionStats.has(regionKey)) {
          const stat = regionStats.get(regionKey);
          stat.total_omzet += omzet;
          stat.umkm_aktif += 1;
        } else {
          regionStats.set(regionKey, {
            kota: umkm.wilayah.kota,
            tahun: tahun,
            bulan: bulan,
            total_omzet: omzet,
            umkm_aktif: 1,
          });
        }
      }
    }

    console.log(`\n  ✅ Generated ${logCounter} financial logs`);

    // STEP 5: INSERT FINANCIAL LOGS TO CASSANDRA (BATCHED)
    console.log('\n📤 Inserting financial logs to Cassandra (batched)...');

    const insertQuery = `
      INSERT INTO ${CASSANDRA_KEYSPACE}.umkm_financial_log (
        umkm_id, tahun, bulan, tanggal_input, omzet, jumlah_karyawan,
        catatan, nama_usaha, sektor, is_flagged, input_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const batchSize = 25; // Reduced batch size
    for (let i = 0; i < financialLogs.length; i += batchSize) {
      const batch = financialLogs.slice(i, i + batchSize);
      const queries = batch.map(log => ({
        query: insertQuery,
        params: [
          log.umkm_id,
          log.tahun,
          log.bulan,
          log.tanggal_input,
          log.omzet,
          log.jumlah_karyawan,
          log.catatan,
          log.nama_usaha,
          log.sektor,
          log.is_flagged,
          log.input_by,
        ],
      }));

      try {
        await cassandraClient.batch(queries, { prepare: true, consistency: cassandra.types.consistencies.localOne });
      } catch (e) {
        console.error(`\nBatch insert failed at position ${i}:`, e.message);
        // Retry with single inserts
        for (const query of queries) {
          await cassandraClient.execute(query.query, query.params, { prepare: true, consistency: cassandra.types.consistencies.localOne });
        }
      }
      
      formatProgress(Math.min(i + batchSize, financialLogs.length), financialLogs.length, 'Inserting logs');
    }

    console.log(`\n  ✅ Inserted ${financialLogs.length} financial logs`);

    // STEP 6: INSERT SECTOR STATS TO CASSANDRA
    console.log('\n📊 Inserting sector statistics...');

    const sectorInsertQuery = `
      INSERT INTO ${CASSANDRA_KEYSPACE}.dashboard_sector_stats (
        sektor, tahun, bulan, total_omzet, total_umkm
      ) VALUES (?, ?, ?, ?, ?)
    `;

    const sectorStatsArray = Array.from(sectorStats.values());
    let sectorCounter = 0;

    for (let i = 0; i < sectorStatsArray.length; i += batchSize) {
      const batch = sectorStatsArray.slice(i, i + batchSize);
      const queries = batch.map(stat => ({
        query: sectorInsertQuery,
        params: [
          stat.sektor,
          stat.tahun,
          stat.bulan,
          stat.total_omzet,
          stat.total_umkm,
        ],
      }));

      await cassandraClient.batch(queries, { prepare: true });
      sectorCounter += batch.length;
      formatProgress(sectorCounter, sectorStatsArray.length, 'Sector stats');
    }

    console.log(`\n  ✅ Inserted ${sectorStatsArray.length} sector statistics`);

    // STEP 7: INSERT REGION STATS TO CASSANDRA
    console.log('\n🗺️  Inserting region statistics...');

    const regionInsertQuery = `
      INSERT INTO ${CASSANDRA_KEYSPACE}.dashboard_region_stats (
        kota, tahun, bulan, total_omzet, umkm_aktif
      ) VALUES (?, ?, ?, ?, ?)
    `;

    const regionStatsArray = Array.from(regionStats.values());
    let regionCounter = 0;

    for (let i = 0; i < regionStatsArray.length; i += batchSize) {
      const batch = regionStatsArray.slice(i, i + batchSize);
      const queries = batch.map(stat => ({
        query: regionInsertQuery,
        params: [
          stat.kota,
          stat.tahun,
          stat.bulan,
          stat.total_omzet,
          stat.umkm_aktif,
        ],
      }));

      await cassandraClient.batch(queries, { prepare: true });
      regionCounter += batch.length;
      formatProgress(regionCounter, regionStatsArray.length, 'Region stats');
    }

    console.log(`\n  ✅ Inserted ${regionStatsArray.length} region statistics`);

    // STEP 8: UPDATE MONGODB WITH LATEST SUMMARIES & GEO COORDS
    console.log('\n🔄 Updating MongoDB UMKM summaries and coordinates...');

    for (let i = 0; i < umkms.length; i++) {
      const umkm = umkms[i];
      const umkmId = String(umkm._id);
      const latestSummary = umkmLatestSummary.get(umkmId);

      let coordinates = umkm.lokasi?.coordinates;
      if (!coordinates || coordinates.length !== 2) {
        coordinates = getRandomCoordinates(umkm.wilayah.kota);
      }

      const updateDoc = {
        'lokasi.coordinates': coordinates,
      };

      if (latestSummary) {
        updateDoc['summary_terakhir'] = {
          omzet_terakhir: latestSummary.omzet,
          bulan: latestSummary.month,
          tahun: latestSummary.year,
        };
      }

      await umkmCollection.updateOne(
        { _id: umkm._id },
        { $set: updateDoc }
      );

      formatProgress(i + 1, umkms.length, 'Updating summaries');
    }

    console.log(`\n  ✅ Updated ${umkms.length} UMKM summaries and coordinates`);

    // FINAL SUMMARY
    console.log('\n' + '═'.repeat(60));
    console.log('✅ ANALYTICS HISTORY SEEDING COMPLETED SUCCESSFULLY!');
    console.log('═'.repeat(60));
    console.log('\n📈 Data Generated Summary:');
    console.log(`  • Financial Logs: ${financialLogs.length}`);
    console.log(`  • Sector Statistics: ${sectorStatsArray.length}`);
    console.log(`  • Region Statistics: ${regionStatsArray.length}`);
    console.log(`  • UMKMs Updated: ${umkms.length}`);
    console.log(`  • Time Period: January 2024 - December 2026`);
    console.log('\n📊 Databases Updated:');
    console.log(`  • Cassandra: umkm_financial_log, dashboard_sector_stats, dashboard_region_stats`);
    console.log(`  • MongoDB: umkm_profiles (summary_terakhir, lokasi)`);
    console.log('\n💡 Next Steps:');
    console.log(`  1. Navigate to Admin Dashboard → Analytics → Revenue`);
    console.log(`  2. You should now see rich charts with 3 years of data`);
    console.log(`  3. Try Growth, Heatmap, and Forecast pages too!`);
    console.log('\n');

  } catch (error) {
    console.error('\n❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    if (mongoClient) {
      await mongoClient.close();
      console.log('🔌 MongoDB connection closed');
    }
    if (cassandraClient) {
      await cassandraClient.shutdown();
      console.log('🔌 Cassandra connection closed');
    }
  }
}

seedAnalyticsHistory();
