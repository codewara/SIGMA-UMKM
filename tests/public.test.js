/**
 * Public Endpoints Tests
 * Tests endpoints that don't require authentication
 */

import { logSection, logTest, request } from './utils.js';
import { testData } from './config.js';

export async function testPublicEndpoints() {
    logSection('1. PUBLIC ENDPOINTS (No Auth Required)');

    // Test public UMKM list
    const { data, status } = await request('/api/umkm');
    if (status === 200 && data.data) {
        logTest('GET /api/umkm (public)', 'PASS', `- Found ${data.data.length} verified UMKMs`);
        if (data.data.length > 0) {
            testData.umkmId = data.data[0]._id;
        }
    } else {
        logTest('GET /api/umkm (public)', 'FAIL');
    }

    // Test public UMKM detail
    if (testData.umkmId) {
        const result = await request(`/api/umkm/${testData.umkmId}`);
        if (result.status === 200) {
            logTest('GET /api/umkm/[id] (public)', 'PASS', `- Retrieved: ${result.data.data.nama_usaha}`);
        } else {
            logTest('GET /api/umkm/[id] (public)', 'FAIL');
        }
    }

    // Test database connection
    const testResult = await request('/api/test');
    if (testResult.status === 200) {
        logTest('GET /api/test', 'PASS', '- MongoDB & Cassandra connected');
    } else {
        logTest('GET /api/test', 'FAIL');
    }
}
