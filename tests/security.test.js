/**
 * Security & Ownership Protection Tests
 * Tests RBAC, authentication, and ownership validation
 */

import { logSection, logTest, log, request, login, logout } from './utils.js';
import { sessions, testData } from './config.js';

export async function testOwnershipProtection() {
    logSection('5. OWNERSHIP PROTECTION & SECURITY');

    await login('owner');
    if (!sessions.owner) return;

    // Try to access another user's UMKM
    if (testData.createdUmkmId) {
        const unauthorizedAccess = await request(`/api/umkm/${testData.createdUmkmId}`, {
            headers: { 'Cookie': `session_token=${sessions.owner}` }
        });

        // Should fail if this UMKM is not owned by owner
        if (unauthorizedAccess.status === 403 || unauthorizedAccess.status === 404) {
            logTest('Ownership check', 'PASS', '- Cannot access non-owned UMKM ✓');
        } else if (unauthorizedAccess.status === 200) {
            log('⚠ Warning: Accessed UMKM that should be protected', 'yellow');
        }
    }

    await logout('owner');

    // Test accessing protected endpoint without auth
    const noAuthResult = await request('/api/dashboard/owner');
    if (noAuthResult.status === 403 || noAuthResult.status === 401) {
        logTest('Auth protection', 'PASS', '- Protected endpoint requires authentication ✓');
    } else {
        logTest('Auth protection', 'FAIL', '- Protected endpoint accessible without auth!');
    }
}
