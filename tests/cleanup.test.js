/**
 * Cleanup Test Data
 * Removes test data created during test execution
 */

import { logSection, logTest, log, request, login, logout } from './utils.js';
import { sessions, testData } from './config.js';

export async function cleanupTestData() {
    logSection('8. CLEANUP TEST DATA');

    // Delete created UMKM as admin
    if (testData.createdUmkmId) {
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(testData.createdUmkmId);

        if (!isUUID) {
            logTest('DELETE /api/umkm/[id] (admin)', 'FAIL', '- Created UMKM has invalid UUID format (cannot delete)');
            return;
        }

        await login('admin');
        if (sessions.admin) {
            const deleteResult = await request(`/api/umkm/${testData.createdUmkmId}`, {
                method: 'DELETE',
                headers: { 'Cookie': `session_token=${sessions.admin}` }
            });

            if (deleteResult.status === 200) {
                logTest('DELETE /api/umkm/[id] (admin)', 'PASS', '- Test UMKM deleted (soft delete)');
            } else {
                logTest('DELETE /api/umkm/[id] (admin)', 'FAIL', `- ${JSON.stringify(deleteResult.data)}`);
            }

            await logout('admin');
        }
    } else {
        log('No test data to clean up', 'yellow');
    }
}
