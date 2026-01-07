/**
 * Pejabat Endpoints Tests
 * Tests endpoints that require PEJABAT role
 */

import { logSection, logTest, log, request, login, logout } from './utils.js';
import { sessions, testData } from './config.js';

export async function testPejabatEndpoints() {
    logSection('3. PEJABAT ENDPOINTS');

    await login('pejabat');
    if (!sessions.pejabat) return;

    // Test current user
    const meResult = await request('/api/auth/me', {
        headers: { 'Cookie': `session_token=${sessions.pejabat}` }
    });
    if (meResult.status === 200 && meResult.data.authenticated && meResult.data.user?.role === 'PEJABAT') {
        logTest('GET /api/auth/me (pejabat)', 'PASS', `- User: ${meResult.data.user.email}`);
    } else {
        logTest('GET /api/auth/me (pejabat)', 'FAIL', `- ${JSON.stringify(meResult.data)}`);
    }

    // Test logout
    const logoutResult = await request('/api/auth/logout', {
        method: 'POST',
        headers: { 'Cookie': `session_token=${sessions.pejabat}` }
    });
    if (logoutResult.status === 200) {
        logTest('POST /api/auth/logout (pejabat)', 'PASS', '- Logged out successfully');
        // Re-login for remaining tests
        await login('pejabat');
    } else {
        logTest('POST /api/auth/logout (pejabat)', 'FAIL');
    }

    // Test UMKM list with status filter
    const pendingUmkms = await request('/api/umkm?status=PENDING', {
        headers: { 'Cookie': `session_token=${sessions.pejabat}` }
    });
    if (pendingUmkms.status === 200) {
        logTest('GET /api/umkm?status=PENDING (pejabat)', 'PASS', `- ${pendingUmkms.data.data.length} pending UMKMs`);
    } else {
        logTest('GET /api/umkm?status=PENDING (pejabat)', 'FAIL');
    }

    // Ensure we have a UMKM ID for financial tests (in case testPublicEndpoints was skipped)
    if (!testData.umkmId) {
        const umkmList = await request('/api/umkm', {
            headers: { 'Cookie': `session_token=${sessions.pejabat}` }
        });
        if (umkmList.status === 200 && umkmList.data.data?.length > 0) {
            testData.umkmId = umkmList.data.data[0]._id;
        }
    }

    // Test financial data retrieval
    if (testData.umkmId) {
        const financeResult = await request(`/api/analytics/financial/${testData.umkmId}?tahun=2024`, {
            headers: { 'Cookie': `session_token=${sessions.pejabat}` }
        });
        if (financeResult.status === 200) {
            const rowCount = financeResult.data.financialLog?.rows?.length || 0;
            logTest('GET /api/analytics/financial/[id] (pejabat)', 'PASS', `- ${rowCount} financial records`);
        } else {
            logTest('GET /api/analytics/financial/[id] (pejabat)', 'FAIL');
        }

        // Test flag financial data
        const flagResult = await request(`/api/financial/${testData.umkmId}/2024/1/flag`, {
            method: 'POST',
            headers: { 'Cookie': `session_token=${sessions.pejabat}` },
            body: JSON.stringify({ reason: 'Test flag - data perlu verifikasi' })
        });
        if (flagResult.status === 200) {
            logTest('POST /api/financial/[id]/[tahun]/[bulan]/flag (pejabat)', 'PASS', '- Data flagged successfully');

            // Test unflag
            const unflagResult = await request(`/api/financial/${testData.umkmId}/2024/1/flag`, {
                method: 'DELETE',
                headers: { 'Cookie': `session_token=${sessions.pejabat}` }
            });
            if (unflagResult.status === 200) {
                logTest('DELETE /api/financial/[id]/[tahun]/[bulan]/flag (pejabat)', 'PASS', '- Flag removed');
            } else {
                logTest('DELETE /api/financial/[id]/[tahun]/[bulan]/flag (pejabat)', 'FAIL');
            }
        } else {
            logTest('POST /api/financial/[id]/[tahun]/[bulan]/flag (pejabat)', 'FAIL', `- ${JSON.stringify(flagResult.data)}`);
        }
    }

    // Test verification workflow
    const verificationList = await request('/api/verification/pending', {
        headers: { 'Cookie': `session_token=${sessions.pejabat}` }
    });
    if (verificationList.status === 200) {
        logTest('GET /api/verification/pending (pejabat)', 'PASS', `- ${verificationList.data.tasks.length} tasks`);
    } else {
        logTest('GET /api/verification/pending (pejabat)', 'FAIL');
    }

    // Test approve & reject workflows - create UMKMs as owner (PENDING status)
    await logout('pejabat');
    await login('owner');

    if (sessions.owner) {
        // Create UMKM for approval testing
        const umkmForApprove = {
            nama_usaha: 'Test UMKM for Approval ' + Date.now(),
            sektor: 'Kuliner',
            pemilik: {
                nama: 'Test Approve Owner',
                telepon: '08111111111'
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

        const createApprove = await request('/api/umkm', {
            method: 'POST',
            headers: { 'Cookie': `session_token=${sessions.owner}` },
            body: JSON.stringify(umkmForApprove)
        });

        // Create UMKM for rejection testing
        const umkmForReject = {
            nama_usaha: 'Test UMKM for Rejection ' + Date.now(),
            sektor: 'Jasa',
            pemilik: {
                nama: 'Test Reject Owner',
                telepon: '08222222222'
            },
            lokasi: {
                type: 'Point',
                coordinates: [110.4000, -7.8000]
            },
            wilayah: {
                kota: 'Yogyakarta',
                provinsi: 'DIY'
            },
            legalitas: {}
        };

        const createReject = await request('/api/umkm', {
            method: 'POST',
            headers: { 'Cookie': `session_token=${sessions.owner}` },
            body: JSON.stringify(umkmForReject)
        });

        // Logout owner, login as pejabat
        await logout('owner');
        await login('pejabat');

        // Test approve
        if (createApprove.status === 201) {
            const approveUmkmId = createApprove.data.data._id;
            const approveResult = await request(`/api/verification/${approveUmkmId}/approve`, {
                method: 'POST',
                headers: { 'Cookie': `session_token=${sessions.pejabat}` },
                body: JSON.stringify({ notes: 'Test approval - data sudah sesuai' })
            });
            if (approveResult.status === 200) {
                logTest('POST /api/verification/[id]/approve (pejabat)', 'PASS', `- Approved: ${umkmForApprove.nama_usaha}`);
            } else {
                logTest('POST /api/verification/[id]/approve (pejabat)', 'FAIL', `- ${JSON.stringify(approveResult.data)}`);
            }

            // Clean up approved UMKM
            await logout('pejabat');
            await login('admin');
            await request(`/api/umkm/${approveUmkmId}`, {
                method: 'DELETE',
                headers: { 'Cookie': `session_token=${sessions.admin}` }
            });
            await logout('admin');
            await login('pejabat');
        } else {
            logTest('POST /api/verification/[id]/approve (pejabat)', 'FAIL', '- Could not create test UMKM for approval');
        }

        // Test reject
        if (createReject.status === 201) {
            const rejectUmkmId = createReject.data.data._id;
            const rejectResult = await request(`/api/verification/${rejectUmkmId}/reject`, {
                method: 'POST',
                headers: { 'Cookie': `session_token=${sessions.pejabat}` },
                body: JSON.stringify({ reason: 'Test rejection - data tidak sesuai kriteria' })
            });
            if (rejectResult.status === 200) {
                logTest('POST /api/verification/[id]/reject (pejabat)', 'PASS', `- Rejected: ${umkmForReject.nama_usaha}`);
            } else {
                logTest('POST /api/verification/[id]/reject (pejabat)', 'FAIL', `- ${JSON.stringify(rejectResult.data)}`);
            }

            // Clean up rejected UMKM
            await logout('pejabat');
            await login('admin');
            await request(`/api/umkm/${rejectUmkmId}`, {
                method: 'DELETE',
                headers: { 'Cookie': `session_token=${sessions.admin}` }
            });
            await logout('admin');
            await login('pejabat');
        } else {
            logTest('POST /api/verification/[id]/reject (pejabat)', 'FAIL', '- Could not create test UMKM for rejection');
        }
    }

    // Test get all financial logs (admin/pejabat privilege)
    const allFinancialResult = await request('/api/analytics/financial', {
        headers: { 'Cookie': `session_token=${sessions.pejabat}` }
    });
    if (allFinancialResult.status === 200) {
        const totalRecords = allFinancialResult.data.financialLogs?.rows?.length || 0;
        logTest('GET /api/analytics/financial (pejabat)', 'PASS', `- ${totalRecords} total financial records`);
    } else {
        logTest('GET /api/analytics/financial (pejabat)', 'FAIL');
    }

    await logout('pejabat');
}