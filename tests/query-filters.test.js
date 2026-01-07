/**
 * Query Filter Tests
 * Tests various query parameters for UMKM listing
 */

import { logSection, logTest, request, login, logout } from './utils.js';
import { sessions } from './config.js';

export async function testQueryFilters() {
    logSection('8. QUERY FILTERS & PAGINATION');

    // Test public filters
    const verifiedFilter = await request('/api/umkm?status=VERIFIED');
    if (verifiedFilter.status === 200) {
        logTest('GET /api/umkm?status=VERIFIED (public)', 'PASS', `- ${verifiedFilter.data.data.length} verified UMKMs`);
    } else {
        logTest('GET /api/umkm?status=VERIFIED (public)', 'FAIL');
    }

    const sektorFilter = await request('/api/umkm?sektor=Kuliner');
    if (sektorFilter.status === 200) {
        const count = sektorFilter.data.data.length;
        logTest('GET /api/umkm?sektor=Kuliner (public)', 'PASS', `- ${count} Kuliner UMKMs`);
    } else {
        logTest('GET /api/umkm?sektor=Kuliner (public)', 'FAIL');
    }

    const kotaFilter = await request('/api/umkm?kota=Surabaya');
    if (kotaFilter.status === 200) {
        const count = kotaFilter.data.data.length;
        logTest('GET /api/umkm?kota=Surabaya (public)', 'PASS', `- ${count} UMKMs in Surabaya`);
    } else {
        logTest('GET /api/umkm?kota=Surabaya (public)', 'FAIL');
    }

    const provinsiFilter = await request('/api/umkm?provinsi=Jawa Timur');
    if (provinsiFilter.status === 200) {
        const count = provinsiFilter.data.data.length;
        logTest('GET /api/umkm?provinsi=Jawa Timur (public)', 'PASS', `- ${count} UMKMs in Jawa Timur`);
    } else {
        logTest('GET /api/umkm?provinsi=Jawa Timur (public)', 'FAIL');
    }

    const paginationTest = await request('/api/umkm?page=1&limit=5');
    if (paginationTest.status === 200 && paginationTest.data.data.length <= 5) {
        logTest('GET /api/umkm?page=1&limit=5 (public)', 'PASS', `- ${paginationTest.data.data.length} UMKMs (max 5)`);
    } else {
        logTest('GET /api/umkm?page=1&limit=5 (public)', 'FAIL');
    }

    // Test with admin role
    await login('admin');
    if (sessions.admin) {
        const adminVerified = await request('/api/umkm?status=VERIFIED', {
            headers: { 'Cookie': `session_token=${sessions.admin}` }
        });
        if (adminVerified.status === 200) {
            logTest('GET /api/umkm?status=VERIFIED (admin)', 'PASS', `- ${adminVerified.data.data.length} verified UMKMs with full data`);
        } else {
            logTest('GET /api/umkm?status=VERIFIED (admin)', 'FAIL');
        }

        const adminSektor = await request('/api/umkm?sektor=Jasa', {
            headers: { 'Cookie': `session_token=${sessions.admin}` }
        });
        if (adminSektor.status === 200) {
            logTest('GET /api/umkm?sektor=Jasa (admin)', 'PASS', `- ${adminSektor.data.data.length} Jasa UMKMs`);
        } else {
            logTest('GET /api/umkm?sektor=Jasa (admin)', 'FAIL');
        }

        await logout('admin');
    }

    // Test with pejabat role
    await login('pejabat');
    if (sessions.pejabat) {
        const pejabatKota = await request('/api/umkm?kota=Yogyakarta', {
            headers: { 'Cookie': `session_token=${sessions.pejabat}` }
        });
        if (pejabatKota.status === 200) {
            logTest('GET /api/umkm?kota=Yogyakarta (pejabat)', 'PASS', `- ${pejabatKota.data.data.length} UMKMs in Yogyakarta`);
        } else {
            logTest('GET /api/umkm?kota=Yogyakarta (pejabat)', 'FAIL');
        }

        const pejabatPagination = await request('/api/umkm?page=1&limit=3', {
            headers: { 'Cookie': `session_token=${sessions.pejabat}` }
        });
        if (pejabatPagination.status === 200 && pejabatPagination.data.data.length <= 3) {
            logTest('GET /api/umkm?page=1&limit=3 (pejabat)', 'PASS', `- ${pejabatPagination.data.data.length} UMKMs (max 3)`);
        } else {
            logTest('GET /api/umkm?page=1&limit=3 (pejabat)', 'FAIL');
        }

        await logout('pejabat');
    }
}
