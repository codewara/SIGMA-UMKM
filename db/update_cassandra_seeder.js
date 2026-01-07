#!/usr/bin/env node

/**
 * Cassandra Seeder Updater
 * 
 * This script updates all INSERT statements in seed_umkm.cql
 * to include the new fields: is_flagged, flag_reason, flagged_by, flagged_at, input_by
 * 
 * Run this script to automatically update the Cassandra seeder:
 * node update_cassandra_seeder.js
 */

const fs = require('fs');
const path = require('path');

const seedFilePath = path.join(__dirname, 'seed_umkm.cql');

// Read the file
let content = fs.readFileSync(seedFilePath, 'utf8');

// Pattern to match existing INSERT statements for umkm_financial_log
const pattern = /INSERT INTO umkm_financial_log \(umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor\) VALUES/g;

// Replacement with new fields
const replacement = 'INSERT INTO umkm_financial_log (umkm_id, tahun, bulan, tgl_input, omzet, jumlah_karyawan, nama_usaha, sektor, is_flagged, flag_reason, flagged_by, flagged_at, input_by) VALUES';

// Replace all occurrences
content = content.replace(pattern, replacement);

// Now update all VALUES clauses to include new field values
// Pattern: VALUES (...existing 8 values...);
const valuesPattern = /VALUES \(([^)]+)\);/g;

content = content.replace(valuesPattern, (match, values) => {
    // Check if it's already updated (contains more than 8 values)
    const valueCount = values.split(',').length;

    if (valueCount === 8) {
        // Add new fields: is_flagged, flag_reason, flagged_by, flagged_at, input_by
        return `VALUES (${values}, false, null, null, null, null);`;
    }

    // Already updated, return as is
    return match;
});

// Write back to file
fs.writeFileSync(seedFilePath, content, 'utf8');

console.log('✅ Cassandra seeder updated successfully!');
console.log('   File: db/seed_umkm.cql');
console.log('   New fields added: is_flagged, flag_reason, flagged_by, flagged_at, input_by');
