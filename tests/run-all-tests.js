/**
 * Main Test Runner
 * Runs all API endpoint tests in sequence
 * 
 * Usage: node tests/run-all-tests.js
 */

import { log, logSection } from './utils.js';
import { BASE_URL } from './config.js';
import { testPublicEndpoints } from './public.test.js';
import { testAdminEndpoints } from './admin.test.js';
import { testPejabatEndpoints } from './pejabat.test.js';
import { testOwnerEndpoints } from './owner.test.js';
import { testOwnershipProtection } from './security.test.js';
import { testRegistration } from './registration.test.js';
import { testFinancialManagement } from './financial.test.js';
import { testQueryFilters } from './query-filters.test.js';
import { testAdminExtended } from './admin-extended.test.js';
import { testPejabatExtended } from './pejabat-extended.test.js';
import { testEmailVerification } from './email-verification.test.js';
import { cleanupTestData } from './cleanup.test.js';

async function runTests() {
    log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
    log('║   SIGMA-UMKM API Endpoint Test Suite                      ║', 'cyan');
    log('║   Testing all endpoints with seeded users                 ║', 'cyan');
    log('╚════════════════════════════════════════════════════════════╝', 'cyan');

    log(`\nBase URL: ${BASE_URL}`, 'blue');
    log(`Test Time: ${new Date().toLocaleString()}`, 'blue');

    try {
        await testPublicEndpoints();
        await testAdminEndpoints();
        await testPejabatEndpoints();
        await testOwnerEndpoints();
        await testOwnershipProtection();
        await testRegistration();
        await testFinancialManagement();
        await testQueryFilters();
        await testAdminExtended();
        await testPejabatExtended();
        await testEmailVerification();
        await cleanupTestData();

        logSection('TEST SUMMARY');
        log('All endpoint tests completed!', 'green');
        log('\n✓ Check the results above for any failures', 'yellow');
        log('✓ All PASS = APIs are working correctly', 'green');
        log('✗ Any FAIL = Review the error details\n', 'red');

    } catch (error) {
        log('\n❌ Test suite error: ' + error.message, 'red');
        console.error(error);
    }
}

// Run tests
runTests().catch(console.error);
