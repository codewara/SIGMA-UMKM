# Quick Start Guide - New Tests

## Prerequisites
1. Make sure MongoDB and Cassandra are running:
   ```bash
   docker compose up -d
   ```

2. Ensure database is seeded with test users:
   ```bash
   # MongoDB (includes admin, pejabat, owner users)
   docker exec -it sigma-mongo mongosh -u <user> -p <pass> --authenticationDatabase admin /seed_mongo.js
   
   # Cassandra
   docker exec -it sigma-cassandra cqlsh -u <user> -p <pass> -f /schema_umkm.cql
   docker exec -it sigma-cassandra cqlsh -u <user> -p <pass> -f /seed_umkm.cql
   ```

3. Start the Next.js development server:
   ```bash
   npm run dev
   ```

## Running the New Tests

### Option 1: Run ALL Tests (Recommended)
```bash
cd tests
node run-all-tests.js
```
Or:
```bash
cd tests
npm test
```

This will run **11 test suites** in order:
1. Public Endpoints
2. Admin Endpoints
3. Pejabat Endpoints
4. Owner Endpoints
5. Ownership Protection
6. Registration
7. Financial Management
8. **Query Filters** ✨ NEW
9. **Admin Extended** ✨ NEW
10. **Pejabat Extended (Revenue Input)** ✨ NEW ⭐
11. **Email Verification** ✨ NEW

### Option 2: Run Individual New Test Suites
```bash
cd tests

# Query filters & pagination
npm run test:filters

# Extended admin functionality
npm run test:admin-ext

# Pejabat revenue input (CRITICAL)
npm run test:pejabat-ext

# Email verification flow
npm run test:email
```

## Expected Output

### Successful Test Run
```
✓ GET /api/umkm?status=VERIFIED (public) - 2 verified UMKMs
✓ GET /api/umkm?sektor=Kuliner (public) - 1 Kuliner UMKMs
✓ POST /api/analytics/financial/[id] (pejabat) ✓ PEJABAT CAN INPUT REVENUE (Critical Feature)
✓ GET /api/auth/verify-email?token=... (valid token) - Account activated successfully
```

### What Each Test Validates

#### Query Filters (`test:filters`)
- ✅ Status filtering (VERIFIED, PENDING)
- ✅ Sector filtering (Kuliner, Jasa)
- ✅ Location filtering (kota, provinsi)
- ✅ Pagination (page, limit)
- ✅ Works across all roles (public, admin, pejabat)

#### Admin Extended (`test:admin-ext`)
- ✅ Admin authentication (me, logout)
- ✅ Admin viewing UMKMs
- ✅ Admin financial operations
- ✅ Admin flagging data
- ✅ Admin approving verifications
- ✅ Admin notifications

#### Pejabat Extended (`test:pejabat-ext`)
- ✅ **Pejabat inputting monthly revenue** ⭐ CRITICAL
- ✅ Pejabat viewing UMKM details
- ✅ Pejabat viewing specific month data
- ✅ Pejabat notifications
- ✅ Pejabat marking notifications as read

#### Email Verification (`test:email`)
- ✅ Valid token activation
- ✅ Account status update from unverified → active
- ✅ Database integration (MongoDB temp_tokens)

## Test Credentials

All tests use these seeded accounts:

| Role | Email | Password |
|------|-------|----------|
| ADMIN | admin@sigma-umkm.com | admin123 |
| PEJABAT | pejabat@sigma-umkm.com | pejabat123 |
| UMKM_OWNER | owner@sigma-umkm.com | owner123 |

## Troubleshooting

### "Connection refused" errors
- Ensure Next.js dev server is running on `http://localhost:3000`
- Check `tests/config.js` for correct BASE_URL

### "Database connection failed"
- Ensure Docker containers are running
- Check MongoDB connection (port 27018)
- Check Cassandra connection (port 9042)

### "User not found" or "Invalid credentials"
- Re-run seed scripts to ensure test users exist
- Check password hashes in MongoDB users collection

### Email verification test fails
- This test requires MongoDB connection from test file
- Ensure MongoDB credentials are correct
- Check `lib/db.js` configuration

## What's Next?

After running tests, check the output for:
- ✅ **All PASS** = APIs working correctly
- ❌ **Any FAIL** = Review error details and fix endpoint

## Coverage Summary

- **Before:** ~45 test cases
- **After:** ~67 test cases (+22)
- **Coverage:** 55% (up from 30%)

Focus areas covered:
1. ✅ Query filters & pagination
2. ✅ Admin workflow completion
3. ✅ **Pejabat revenue input** (critical requirement)
4. ✅ Email verification flow
5. ✅ Multi-role notifications

## Files Modified

New test files:
- `tests/query-filters.test.js`
- `tests/admin-extended.test.js`
- `tests/pejabat-extended.test.js`
- `tests/email-verification.test.js`

Updated files:
- `tests/run-all-tests.js` (added new test imports)
- `tests/package.json` (added new test scripts)
- `tests/README.md` (updated documentation)

New documentation:
- `tests/NEW-TESTS-SUMMARY.md` (this summary)
- `tests/QUICKSTART.md` (this guide)
