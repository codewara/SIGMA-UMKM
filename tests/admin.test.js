/**
 * Admin Endpoints Tests
 * Tests endpoints that require ADMIN role
 */

import { logSection, logTest, request, login, logout } from './utils.js';
import { sessions, testData } from './config.js';

export async function testAdminEndpoints() {
    logSection('2. ADMIN ENDPOINTS');

    await login('admin');
    if (!sessions.admin) return;

    // Test UMKM list (full data)
    const listResult = await request('/api/umkm', {
        headers: { 'Cookie': `session_token=${sessions.admin}` }
    });
    if (listResult.status === 200) {
        logTest('GET /api/umkm (admin)', 'PASS', `- ${listResult.data.data.length} UMKMs with full data`);
    } else {
        logTest('GET /api/umkm (admin)', 'FAIL');
    }

    // Test create UMKM
    const newUmkm = {
        nama_usaha: 'Test UMKM ' + Date.now(),
        sektor: 'Kuliner',
        pemilik: {
            nama: 'Test Owner',
            telepon: '08123456789'
        },
        lokasi: {
            type: 'Point',
            coordinates: [110.3695, -7.7956]
        },
        wilayah: {
            kota: 'Yogyakarta',
            provinsi: 'DIY'
        },
        legalitas: {}
    };

    const createResult = await request('/api/umkm', {
        method: 'POST',
        headers: { 'Cookie': `session_token=${sessions.admin}` },
        body: JSON.stringify(newUmkm)
    });

    if (createResult.status === 201) {
        testData.createdUmkmId = createResult.data.data._id;
        logTest('POST /api/umkm (admin)', 'PASS', `- Created UMKM: ${createResult.data.data.nama_usaha}`);
    } else {
        logTest('POST /api/umkm (admin)', 'FAIL', `- ${JSON.stringify(createResult.data)}`);
    }

    // Test update UMKM
    if (testData.createdUmkmId) {
        // Check if ID is valid UUID format (not ObjectId)
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(testData.createdUmkmId);

        if (isUUID) {
            const updateResult = await request(`/api/umkm/${testData.createdUmkmId}`, {
                method: 'PATCH',
                headers: { 'Cookie': `session_token=${sessions.admin}` },
                body: JSON.stringify({ nama_usaha: 'Updated Test UMKM' })
            });

            if (updateResult.status === 200) {
                logTest('PATCH /api/umkm/[id] (admin)', 'PASS', '- Updated UMKM name');
            } else {
                logTest('PATCH /api/umkm/[id] (admin)', 'FAIL', `- ${JSON.stringify(updateResult.data)}`);
            }
        } else {
            logTest('PATCH /api/umkm/[id] (admin)', 'FAIL', '- Created UMKM has invalid UUID format (MongoDB ObjectId)');
        }
    }

    // Test verification endpoints
    const pendingResult = await request('/api/verification/pending', {
        headers: { 'Cookie': `session_token=${sessions.admin}` }
    });
    if (pendingResult.status === 200) {
        logTest('GET /api/verification/pending (admin)', 'PASS', `- ${pendingResult.data.tasks.length} pending verifications`);
    } else {
        logTest('GET /api/verification/pending (admin)', 'FAIL');
    }

    await logout('admin');
}
