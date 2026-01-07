# SIGMA-UMKM API Tests

Modular test suite for all SIGMA-UMKM API endpoints.

## 📁 File Structure

```
tests/
├── config.js              # Configuration (BASE_URL, test users, colors)
├── utils.js               # Utility functions (logging, HTTP requests, auth)
├── public.test.js         # Public endpoint tests (no auth)
├── admin.test.js          # Admin role tests
├── pejabat.test.js        # Pejabat role tests
├── owner.test.js          # UMKM_OWNER role tests
├── security.test.js       # Security & ownership protection tests
├── registration.test.js   # User registration tests
├── financial.test.js      # Financial data CRUD tests
├── query-filters.test.js  # Query parameter & filter tests ✨ NEW
├── admin-extended.test.js # Extended admin functionality ✨ NEW
├── pejabat-extended.test.js # Pejabat revenue input tests ✨ NEW
├── email-verification.test.js # Email verification flow ✨ NEW
├── cleanup.test.js        # Test data cleanup
├── run-all-tests.js       # Main test runner
├── package.json           # Test scripts
└── README.md              # This file
```

## 🚀 Running Tests

### Run All Tests
```bash
cd tests
node run-all-tests.js
```

Or use npm scripts:
```bash
npm test
```

### Run Individual Test Suites
```bash
npm run test:public        # Public endpoints
npm run test:admin         # Admin endpoints
npm run test:pejabat       # Pejabat endpoints
npm run test:owner         # Owner endpoints
npm run test:security      # Security tests
npm run test:registration  # Registration tests
npm run test:financial     # Financial CRUD tests
npm run test:filters       # Query filters & pagination ✨ NEW
npm run test:admin-ext     # Extended admin tests ✨ NEW
npm run test:pejabat-ext   # Pejabat revenue input ✨ NEW
npm run test:email         # Email verification ✨ NEW
npm run test:cleanup       # Cleanup test data
```

## 🔑 Test Credentials

The tests use seeded users from `db/seed_mongo.js`:

| Role | Email | Password |
|------|-------|----------|
| **ADMIN** | admin@sigma-umkm.com | admin123 |
| **PEJABAT** | pejabat@sigma-umkm.com | pejabat123 |
| **UMKM_OWNER** | owner@sigma-umkm.com | owner123 |

## 📋 Test Coverage

### 1. Public Endpoints
- GET /api/umkm (list)
- GET /api/umkm/[id] (detail)
- GET /api/test (database connection)

- ✨ Admin profile & logout
- ✨ Admin notifications
- ✨ Admin flag operations

### 3. Pejabat Endpoints
- Financial data retrieval
- Flag/unflag financial data
- Verification workflow
- Authentication
- ✨ **Revenue input (critical feature)**
- ✨ Pejabat notifications

### 4. UMKM Owner Endpoints
- Own UMKM management
- Revenue logging
- Dashboard statistics
- Notifications

### 5. Security Tests
- Ownership protection
- Authentication requirements
- RBAC enforcement

### 6. Registration
- UMKM_OWNER registration
- PEJABAT registration

### 7. Financial Management
- PATCH financial logs
- DELETE financial logs

### 8. ✨ Query Filters & Pagination
- status filter (VERIFIED, PENDING)
- sektor filter (Kuliner, Jasa, etc.)
- kota filter (city-based)
- provinsi filter (province-based)
- page & limit pagination
- Tested across all roles

### 9. ✨ Email Verification
- Valid token activation
- Account status update

### 10. Financial Management
- PATCH financial logs
- DELETE financial logs

### 8. Cleanup
- Remove test data

## 🛠️ Prerequisites

1. **Running Docker containers:**
   ```bash
   docker compose up -d
   ```

2. **Seeded databases:**
   ```bash
   # MongoDB
   docker exec -it sigma-mongo mongosh -u <user> -p <pass> --authenticationDatabase admin /seed_mongo.js

   # Cassandra
   docker exec -it sigma-cassandra cqlsh -u <user> -p <pass> -f /schema_umkm.cql
   docker exec -it sigma-cassandra cqlsh -u <user> -p <pass> -f /seed_umkm.cql
   ```

3. **Running Next.js dev server:**
   ```bash
   npm run dev
   ```

## 🎨 Output Format

Tests use color-coded output:
- ✓ **Green**: Test passed
- ✗ **Red**: Test failed
- ℹ **Yellow**: Test skipped/info

## 📝 Notes

- Tests run sequentially to maintain proper session management
- Test data is cleaned up automatically after execution
- Some tests may be skipped if conditions aren't met (e.g., no pending verifications)
- Email sending may fail in registration tests without SMTP configuration (this is expected in dev)

## 🔧 Customization

Edit [config.js](config.js) to change:
- `BASE_URL` - API endpoint base URL
- `USERS` - Test user credentials
- Test data storage objects

## 📊 Example Output

```
============================================================
1. PUBLIC ENDPOINTS (No Auth Required)
============================================================
✓ GET /api/umkm (public) - Found 5 verified UMKMs
✓ GET /api/umkm/[id] (public) - Retrieved: Soto Cak Har
✓ GET /api/test - MongoDB & Cassandra connected
```
