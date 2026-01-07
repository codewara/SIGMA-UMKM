/**
 * Financial Data Management Tests
 * Tests PATCH and DELETE operations on financial logs (admin only)
 */

import { logSection, logTest, log, request, login, logout } from './utils.js';
import { sessions, testData } from './config.js';

export async function testFinancialManagement() {
    logSection('7. FINANCIAL DATA MANAGEMENT');

    await login('admin');
    if (!sessions.admin) return;

    if (testData.umkmId) {
        // Test PATCH financial log (admin only)
        const updateFinanceResult = await request(`/api/analytics/financial/${testData.umkmId}?tahun=2024&bulan=6`, {
            method: 'PATCH',
            headers: { 'Cookie': `session_token=${sessions.admin}` },
            body: JSON.stringify({ jumlah_karyawan: 15 })
        });
        if (updateFinanceResult.status === 200) {
            logTest('PATCH /api/analytics/financial/[id] (admin)', 'PASS', '- Updated financial record');
        } else {
            logTest('PATCH /api/analytics/financial/[id] (admin)', 'FAIL', `- ${JSON.stringify(updateFinanceResult.data)}`);
        }

        // Test DELETE financial log (admin only)
        // Create a test financial entry first
        const testFinanceData = {
            tahun: 2025,
            bulan: 12,
            omzet: 99999999,
            jumlah_karyawan: 1,
            nama_usaha: 'Test Entry',
            sektor: 'Test'
        };

        const createTestFinance = await request(`/api/analytics/financial/${testData.umkmId}`, {
            method: 'POST',
            headers: { 'Cookie': `session_token=${sessions.admin}` },
            body: JSON.stringify(testFinanceData)
        });

        if (createTestFinance.status === 201) {
            // Now delete it
            const deleteFinanceResult = await request(`/api/analytics/financial/${testData.umkmId}?tahun=2025&bulan=12`, {
                method: 'DELETE',
                headers: { 'Cookie': `session_token=${sessions.admin}` }
            });
            if (deleteFinanceResult.status === 200) {
                logTest('DELETE /api/analytics/financial/[id] (admin)', 'PASS', '- Deleted financial record');
            } else {
                logTest('DELETE /api/analytics/financial/[id] (admin)', 'FAIL', `- ${JSON.stringify(deleteFinanceResult.data)}`);
            }
        } else {
            log('  ℹ DELETE /api/analytics/financial/[id] - Skipped (could not create test entry)', 'yellow');
        }
    }

    await logout('admin');
}
