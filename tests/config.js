/**
 * Test Configuration
 * Central configuration for all API tests
 */

export const BASE_URL = 'http://localhost:3000';

// Test credentials from seeder
export const USERS = {
    admin: { email: 'admin@sigma-umkm.com', password: 'admin123' },
    pejabat: { email: 'pejabat@sigma-umkm.com', password: 'pejabat123' },
    owner: { email: 'owner@sigma-umkm.com', password: 'owner123' }
};

// Store session tokens (shared across tests)
export const sessions = {};

// Store test data (shared across tests)
export const testData = {
    umkmId: null,
    createdUmkmId: null
};

// Color codes for terminal output
export const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};
