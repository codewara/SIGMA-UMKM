/**
 * Extended Admin Tests
 * Tests admin-specific endpoints not covered in basic admin tests
 */

import { logSection, logTest, log, request, login, logout } from './utils.js';
import { sessions, testData } from './config.js';

export async function testAdminExtended() {
    logSection('9. ADMIN EXTENDED TESTS');

    await login('admin');
    if (!sessions.admin) return;

    // Test admin viewing own profile
    const meResult = await request('/api/auth/me', {
        headers: { 'Cookie': `session_token=${sessions.admin}` }
    });
    if (meResult.status === 200 && meResult.data.authenticated && meResult.data.user?.role === 'ADMIN') {
        logTest('GET /api/auth/me (admin)', 'PASS', `- User: ${meResult.data.user.email}`);
    } else {
        logTest('GET /api/auth/me (admin)', 'FAIL', `- ${JSON.stringify(meResult.data)}`);
    }

    // Test admin logout
    const logoutResult = await request('/api/auth/logout', {
        method: 'POST',
        headers: { 'Cookie': `session_token=${sessions.admin}` }
    });
    if (logoutResult.status === 200) {
        logTest('POST /api/auth/logout (admin)', 'PASS', '- Logged out successfully');
        // Re-login for remaining tests
        await login('admin');
    } else {
        logTest('POST /api/auth/logout (admin)', 'FAIL');
    }

    // Test admin viewing UMKM detail
    if (testData.umkmId) {
        const detailResult = await request(`/api/umkm/${testData.umkmId}`, {
            headers: { 'Cookie': `session_token=${sessions.admin}` }
        });
        if (detailResult.status === 200) {
            logTest('GET /api/umkm/[id] (admin)', 'PASS', `- Retrieved: ${detailResult.data.data.nama_usaha}`);
        } else {
            logTest('GET /api/umkm/[id] (admin)', 'FAIL');
        }
    }

    // Test admin viewing all financial logs
    const allFinancialResult = await request('/api/analytics/financial', {
        headers: { 'Cookie': `session_token=${sessions.admin}` }
    });
    if (allFinancialResult.status === 200) {
        const totalRecords = allFinancialResult.data.financialLogs?.rows?.length || 0;
        logTest('GET /api/analytics/financial (admin)', 'PASS', `- ${totalRecords} total financial records`);
    } else {
        logTest('GET /api/analytics/financial (admin)', 'FAIL');
    }

    // Test admin viewing financial logs with specific month
    if (testData.umkmId) {
        const specificMonthResult = await request(`/api/analytics/financial/${testData.umkmId}?tahun=2024&bulan=6`, {
            headers: { 'Cookie': `session_token=${sessions.admin}` }
        });
        if (specificMonthResult.status === 200) {
            logTest('GET /api/analytics/financial/[id]?tahun=2024&bulan=6 (admin)', 'PASS', '- Retrieved specific month data');
        } else {
            logTest('GET /api/analytics/financial/[id]?tahun=2024&bulan=6 (admin)', 'FAIL');
        }
    }

    // Test admin flagging financial data
    if (testData.umkmId) {
        const flagResult = await request(`/api/financial/${testData.umkmId}/2024/5/flag`, {
            method: 'POST',
            headers: { 'Cookie': `session_token=${sessions.admin}` },
            body: JSON.stringify({ reason: 'Admin test flag - data verification needed' })
        });
        if (flagResult.status === 200) {
            logTest('POST /api/financial/[id]/[tahun]/[bulan]/flag (admin)', 'PASS', '- Data flagged by admin');

            // Test admin unflagging
            const unflagResult = await request(`/api/financial/${testData.umkmId}/2024/5/flag`, {
                method: 'DELETE',
                headers: { 'Cookie': `session_token=${sessions.admin}` }
            });
            if (unflagResult.status === 200) {
                logTest('DELETE /api/financial/[id]/[tahun]/[bulan]/flag (admin)', 'PASS', '- Flag removed by admin');
            } else {
                logTest('DELETE /api/financial/[id]/[tahun]/[bulan]/flag (admin)', 'FAIL');
            }
        } else {
            logTest('POST /api/financial/[id]/[tahun]/[bulan]/flag (admin)', 'FAIL', `- ${JSON.stringify(flagResult.data)}`);
        }
    }

    // Test admin approving verification
    const pendingVerifications = await request('/api/verification/pending', {
        headers: { 'Cookie': `session_token=${sessions.admin}` }
    });

    if (pendingVerifications.status === 200 && pendingVerifications.data.tasks.length > 0) {
        const pendingId = pendingVerifications.data.tasks[0].umkm_id;

        const approveResult = await request(`/api/verification/${pendingId}/approve`, {
            method: 'POST',
            headers: { 'Cookie': `session_token=${sessions.admin}` },
            body: JSON.stringify({ notes: 'Admin approval test' })
        });
        if (approveResult.status === 200) {
            logTest('POST /api/verification/[id]/approve (admin)', 'PASS', '- Verified by admin');
        } else {
            logTest('POST /api/verification/[id]/approve (admin)', 'FAIL', `- ${JSON.stringify(approveResult.data)}`);
        }
    } else {
        log('  ℹ POST /api/verification/[id]/approve (admin) - Skipped (no pending verifications)', 'yellow');
    }

    // Note: Notifications are UMKM_OWNER only - admin doesn't have access
    log('  ℹ GET /api/notifications (admin) - Skipped (notifications are UMKM_OWNER only)', 'yellow');

    await logout('admin');
}
