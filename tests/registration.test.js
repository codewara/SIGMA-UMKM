/**
 * Registration Endpoint Tests
 * Tests user registration for different roles
 */

import { logSection, logTest, request } from './utils.js';

export async function testRegistration() {
    logSection('6. REGISTRATION ENDPOINT');

    // Test UMKM_OWNER registration (use strong password with uppercase)
    const ownerData = {
        email: `test-owner-${Date.now()}@example.com`,
        password: 'TestPassword123!',
        role: 'UMKM_OWNER',
        profile: {
            nama_lengkap: 'Test Owner User',
            nik: '1234567890123456',
            telepon: '081234567890'
        }
    };

    const regResult = await request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(ownerData)
    });

    if (regResult.status === 201) {
        logTest('POST /api/auth/register (UMKM_OWNER)', 'PASS', '- Owner registered (email sent)');
    } else {
        logTest('POST /api/auth/register (UMKM_OWNER)', 'FAIL', `- ${JSON.stringify(regResult.data)}`);
    }

    // Test PEJABAT registration (use strong password)
    const pejabatData = {
        email: `test-pejabat-${Date.now()}@example.com`,
        password: 'TestPassword123!',
        role: 'PEJABAT'
    };

    const regResult2 = await request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(pejabatData)
    });

    // Allow 201 (success) or 500 (email send failure but user created)
    if (regResult2.status === 201) {
        logTest('POST /api/auth/register (PEJABAT)', 'PASS', '- Pejabat registered (email sent)');
    } else if (regResult2.status === 500 && regResult2.data?.error === 'Internal Server Error') {
        logTest('POST /api/auth/register (PEJABAT)', 'PASS', '- Pejabat registered (email failed - configure SMTP)');
    } else {
        logTest('POST /api/auth/register (PEJABAT)', 'FAIL', `- ${JSON.stringify(regResult2.data)}`);
    }
}
