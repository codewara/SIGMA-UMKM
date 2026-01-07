/**
 * Extended Pejabat Tests
 * Tests PEJABAT role's ability to input revenue (critical feature)
 */

import { logSection, logTest, log, request, login, logout } from './utils.js';
import { sessions, testData } from './config.js';

export async function testPejabatExtended() {
    logSection('10. PEJABAT EXTENDED TESTS (Revenue Input)');

    await login('pejabat');
    if (!sessions.pejabat) return;

    // Ensure we have a UMKM ID
    if (!testData.umkmId) {
        const umkmList = await request('/api/umkm', {
            headers: { 'Cookie': `session_token=${sessions.pejabat}` }
        });
        if (umkmList.status === 200 && umkmList.data.data?.length > 0) {
            testData.umkmId = umkmList.data.data[0]._id;
        }
    }

    // CRITICAL TEST: Pejabat inputting monthly revenue
    if (testData.umkmId) {
        const revenueData = {
            tahun: 2026,
            bulan: 1,
            omzet: 85000000,
            jumlah_karyawan: 12,
            nama_usaha: 'Test UMKM',
            sektor: 'Kuliner'
        };

        const revenueResult = await request(`/api/analytics/financial/${testData.umkmId}`, {
            method: 'POST',
            headers: { 'Cookie': `session_token=${sessions.pejabat}` },
            body: JSON.stringify(revenueData)
        });
        if (revenueResult.status === 201) {
            logTest('POST /api/analytics/financial/[id] (pejabat)', 'PASS', '✓ PEJABAT CAN INPUT REVENUE (Critical Feature)');
        } else {
            logTest('POST /api/analytics/financial/[id] (pejabat)', 'FAIL', `- ${JSON.stringify(revenueResult.data)}`);
        }

        // Test pejabat viewing UMKM detail
        const detailResult = await request(`/api/umkm/${testData.umkmId}`, {
            headers: { 'Cookie': `session_token=${sessions.pejabat}` }
        });
        if (detailResult.status === 200) {
            logTest('GET /api/umkm/[id] (pejabat)', 'PASS', `- Retrieved: ${detailResult.data.data.nama_usaha}`);
        } else {
            logTest('GET /api/umkm/[id] (pejabat)', 'FAIL');
        }

        // Test pejabat viewing specific month financial data
        const specificMonthResult = await request(`/api/analytics/financial/${testData.umkmId}?tahun=2024&bulan=3`, {
            headers: { 'Cookie': `session_token=${sessions.pejabat}` }
        });
        if (specificMonthResult.status === 200) {
            logTest('GET /api/analytics/financial/[id]?tahun=2024&bulan=3 (pejabat)', 'PASS', '- Retrieved specific month');
        } else {
            logTest('GET /api/analytics/financial/[id]?tahun=2024&bulan=3 (pejabat)', 'FAIL');
        }
    }

    // Note: Notifications are UMKM_OWNER only - pejabat doesn't have access
    log('  ℹ GET /api/notifications (pejabat) - Skipped (notifications are UMKM_OWNER only)', 'yellow');

    await logout('pejabat');
}
