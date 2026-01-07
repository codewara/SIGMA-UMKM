/**
 * UMKM Owner Endpoints Tests
 * Tests endpoints that require UMKM_OWNER role
 */

import { logSection, logTest, log, request, login, logout } from './utils.js';
import { sessions } from './config.js';

export async function testOwnerEndpoints() {
    logSection('4. UMKM_OWNER ENDPOINTS');

    await login('owner');
    if (!sessions.owner) return;

    // Test current user with profile
    const meResult = await request('/api/auth/me', {
        headers: { 'Cookie': `session_token=${sessions.owner}` }
    });
    if (meResult.status === 200 && meResult.data.authenticated && meResult.data.user?.role === 'UMKM_OWNER') {
        logTest('GET /api/auth/me (owner)', 'PASS', `- User: ${meResult.data.user.email}`);
    } else {
        logTest('GET /api/auth/me (owner)', 'FAIL', `- ${JSON.stringify(meResult.data)}`);
    }

    // Test owner UMKM list (filtered by ownership)
    const ownedUmkms = await request('/api/umkm', {
        headers: { 'Cookie': `session_token=${sessions.owner}` }
    });
    if (ownedUmkms.status === 200) {
        logTest('GET /api/umkm (owner)', 'PASS', `- ${ownedUmkms.data.data.length} owned UMKMs`);

        // Use first owned UMKM for testing
        if (ownedUmkms.data.data.length > 0) {
            const ownedUmkmId = ownedUmkms.data.data[0]._id;

            // Test get owned UMKM detail
            const detailResult = await request(`/api/umkm/${ownedUmkmId}`, {
                headers: { 'Cookie': `session_token=${sessions.owner}` }
            });
            if (detailResult.status === 200) {
                logTest('GET /api/umkm/[id] (owner)', 'PASS', `- Retrieved: ${detailResult.data.data.nama_usaha}`);
            } else {
                logTest('GET /api/umkm/[id] (owner)', 'FAIL');
            }

            // Test update owned UMKM
            const updateResult = await request(`/api/umkm/${ownedUmkmId}`, {
                method: 'PATCH',
                headers: { 'Cookie': `session_token=${sessions.owner}` },
                body: JSON.stringify({
                    pemilik: {
                        nama: 'Updated Owner Name',
                        telepon: '08123456789'
                    }
                })
            });
            if (updateResult.status === 200) {
                logTest('PATCH /api/umkm/[id] (owner)', 'PASS', '- Updated own UMKM');
            } else {
                logTest('PATCH /api/umkm/[id] (owner)', 'FAIL', `- ${JSON.stringify(updateResult.data)}`);
            }

            // Test financial data retrieval
            const financeResult = await request(`/api/analytics/financial/${ownedUmkmId}?tahun=2024`, {
                headers: { 'Cookie': `session_token=${sessions.owner}` }
            });
            if (financeResult.status === 200) {
                const rowCount = financeResult.data.financialLog?.rows?.length || 0;
                logTest('GET /api/analytics/financial/[id] (owner)', 'PASS', `- ${rowCount} financial records`);
            } else {
                logTest('GET /api/analytics/financial/[id] (owner)', 'FAIL');
            }

            // Test log revenue
            const revenueData = {
                tahun: 2026,
                bulan: 1,
                omzet: 50000000,
                jumlah_karyawan: 5,
                nama_usaha: ownedUmkms.data.data[0].nama_usaha,
                sektor: ownedUmkms.data.data[0].sektor
            };

            const revenueResult = await request(`/api/analytics/financial/${ownedUmkmId}`, {
                method: 'POST',
                headers: { 'Cookie': `session_token=${sessions.owner}` },
                body: JSON.stringify(revenueData)
            });
            if (revenueResult.status === 201) {
                logTest('POST /api/analytics/financial/[id] (owner)', 'PASS', '- Revenue logged successfully');
            } else {
                logTest('POST /api/analytics/financial/[id] (owner)', 'FAIL', `- ${JSON.stringify(revenueResult.data)}`);
            }
        }
    } else {
        logTest('GET /api/umkm (owner)', 'FAIL');
    }

    // Test owner dashboard
    const dashboardResult = await request('/api/dashboard/owner', {
        headers: { 'Cookie': `session_token=${sessions.owner}` }
    });
    if (dashboardResult.status === 200) {
        const stats = dashboardResult.data.data;
        logTest('GET /api/dashboard/owner (owner)', 'PASS',
            `- ${stats.totalUMKMs} UMKMs, ${stats.pendingVerifications} pending, ${stats.flaggedData} flagged`);
    } else {
        logTest('GET /api/dashboard/owner (owner)', 'FAIL', `- ${JSON.stringify(dashboardResult.data)}`);
    }

    // Test notifications - Create a notification by flagging financial data
    const notifTestUmkmId = '17b3e4b8-62b2-4d97-b0cf-9da1addab974'; // Owner's existing UMKM

    // Step 1: Log financial data as owner
    const testFinanceData = {
        tahun: 2025,
        bulan: 12,
        omzet: 75000000,
        jumlah_karyawan: 10,
        nama_usaha: 'Test for Notification',
        sektor: 'Test'
    };

    const createFinanceResult = await request(`/api/analytics/financial/${notifTestUmkmId}`, {
        method: 'POST',
        headers: { 'Cookie': `session_token=${sessions.owner}` },
        body: JSON.stringify(testFinanceData)
    });

    if (createFinanceResult.status === 201) {
        log('  ℹ Created financial record for notification test', 'blue');

        // Step 2: Logout owner, login as pejabat to flag the data
        await logout('owner');
        await login('pejabat');

        const flagForNotif = await request(`/api/financial/${notifTestUmkmId}/2025/12/flag`, {
            method: 'POST',
            headers: { 'Cookie': `session_token=${sessions.pejabat}` },
            body: JSON.stringify({ reason: 'Test notification - data needs verification' })
        });

        if (flagForNotif.status === 200) {
            log('  ℹ Flagged financial data (should create notification)', 'blue');
        } else {
            log(`  ⚠ Failed to flag data: ${JSON.stringify(flagForNotif.data)}`, 'yellow');
        }

        // Step 3: Logout pejabat, login back as owner
        await logout('pejabat');
        await login('owner');

        // Wait a moment for notification to be created
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Step 4: Check notifications
        const notifResult = await request('/api/notifications', {
            headers: { 'Cookie': `session_token=${sessions.owner}` }
        });

        console.log('\n🔍 DEBUG - Notification response:', JSON.stringify(notifResult.data, null, 2));

        if (notifResult.status === 200) {
            logTest('GET /api/notifications (owner)', 'PASS', `- ${notifResult.data.count} notifications`);

            // Test mark as read - notifications are in data.data (not data.notifications)
            if (notifResult.data.data && notifResult.data.data.length > 0) {
                const unreadNotif = notifResult.data.data.find(n => !n.is_read);

                console.log('🔍 DEBUG - Found notifications:', notifResult.data.data.length);
                console.log('🔍 DEBUG - Unread notification:', unreadNotif ? 'Found' : 'None');

                if (unreadNotif) {
                    // Use created_at as notification ID (Cassandra clustering key)
                    const notifId = unreadNotif.created_at;
                    console.log('🔍 DEBUG - Marking notification as read, ID:', notifId);

                    const markReadResult = await request(`/api/notifications/${notifId}/read`, {
                        method: 'PATCH',
                        headers: { 'Cookie': `session_token=${sessions.owner}` }
                    });

                    console.log('🔍 DEBUG - Mark read result:', JSON.stringify(markReadResult.data, null, 2));

                    if (markReadResult.status === 200) {
                        logTest('PATCH /api/notifications/[id]/read (owner)', 'PASS', '- Notification marked as read');
                    } else {
                        logTest('PATCH /api/notifications/[id]/read (owner)', 'FAIL', `- ${JSON.stringify(markReadResult.data)}`);
                    }
                } else {
                    logTest('PATCH /api/notifications/[id]/read (owner)', 'FAIL', '- No unread notifications found after flagging');
                }
            } else {
                logTest('PATCH /api/notifications/[id]/read (owner)', 'FAIL', '- No notifications found after flagging');
            }
        } else {
            logTest('GET /api/notifications (owner)', 'FAIL', `- ${JSON.stringify(notifResult.data)}`);
        }

        // Cleanup: Unflag the test data
        await logout('owner');
        await login('pejabat');
        await request(`/api/financial/${notifTestUmkmId}/2025/12/flag`, {
            method: 'DELETE',
            headers: { 'Cookie': `session_token=${sessions.pejabat}` }
        });
        await logout('pejabat');
        await login('owner');
        log('  ℹ Cleaned up test financial flag', 'blue');
    } else {
        logTest('GET /api/notifications (owner)', 'FAIL', '- Could not create test financial data');
    }

    await logout('owner');
}
