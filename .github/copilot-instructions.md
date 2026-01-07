# GitHub Copilot Instructions - SIGMA-UMKM

## Project Overview

**SIGMA-UMKM** is a Next.js application for monitoring and managing Indonesian MSMEs (Micro, Small, and Medium Enterprises) data. The system uses **polyglot persistence** architecture with MongoDB and Cassandra databases.

**Key Purpose:**
- Support SDG 8 (Decent Work and Economic Growth) initiatives
- Track UMKM profiles with geospatial data
- Monitor time-series financial performance
- Provide role-based access for government officials and public access

## Tech Stack

```yaml
Framework: Next.js 16 (App Router)
Language: TypeScript 5
Databases:
  - MongoDB 7 (profiles, authentication)
  - Cassandra 5 (time-series financial data, audit logs)
Styling: Tailwind CSS 4
Validation: Zod 4
Auth: bcrypt + HTTP-only cookies
Container: Docker Compose
```

## Architecture Patterns

### Polyglot Persistence Strategy

**MongoDB (Transactional):**
- UMKM profiles with GeoJSON locations
- User accounts and sessions
- Rich nested documents with embedded data

**Cassandra (Analytical):**
- Financial logs partitioned by (umkm_id, tahun)
- Audit trails (login_logs, login_attempts)
- Pre-aggregated dashboard statistics
- Time-series data with TTL cleanup

**Why this separation?**
- MongoDB: Complex queries, relationships, geospatial searches
- Cassandra: High-write workloads, time-series, horizontal scalability

### Denormalization Strategy

```typescript
// MongoDB: Cache latest financial summary to avoid cross-DB joins
{
  "_id": UUID("..."),
  "nama_usaha": "Soto Cak Har",
  "summary_terakhir": {
    "omzet_terakhir": 52000000,
    "bulan": 6
  }
}

// Cassandra: Duplicate nama_usaha & sektor for faster reads
INSERT INTO umkm_financial_log (
  umkm_id, tahun, bulan, omzet, 
  nama_usaha, sektor  // ← Denormalized
)
```

## Role-Based Access Control (RBAC)

### Three Access Levels:

1. **ADMIN** (stored role)
   - Full system access
   - Manage UMKM profiles (CRUD)
   - View all data with contact information

2. **PEJABAT** (stored role)
   - Government official role
   - **Primary focus: Input monthly revenue**
   - View full dashboard data
   - Cannot modify UMKM profiles

3. **Unauthenticated (Public)**
   - NOT a stored role
   - No login required
   - Automatically receive aggregated/restricted data
   - Cannot see contact information

### Middleware Implementation

```typescript
// lib/auth.ts
export type UserRole = "ADMIN" | "PEJABAT"; // Only authenticated roles

// API routes support public access with allowPublic flag
await requireAuth(["ADMIN", "PEJABAT"], true); // true = allow unauthenticated

// Check for unauthenticated users
if (!user) {
  // Return restricted/aggregated data
}
```

## Key Conventions

### 1. UUID Synchronization
```typescript
// MongoDB _id MUST match Cassandra umkm_id
// Example: 17b3e4b8-62b2-4d97-b0cf-9da1addab974
```

### 2. File Naming
- API Routes: `route.ts` (Next.js 13+ App Router)
- Services: `*.service.ts` (business logic)
- Validation: `*.schema.ts` (Zod schemas)
- Types: `lib/types.ts` (shared TypeScript types)

### 3. Database Connections
```typescript
import { connectMongo, connectCassandra } from "@/lib/db";

// Always use these singleton connections
const mongo = await connectMongo();
const cassandra = await connectCassandra();
```

### 4. Error Handling
```typescript
// Always return proper HTTP status codes
if (!umkm) {
  return NextResponse.json({ error: "UMKM not found" }, { status: 404 });
}

// Differentiate between 401 (unauthenticated) and 403 (forbidden)
if (!user) return NextResponse.json({ error: "Auth required" }, { status: 401 });
if (user.role !== "ADMIN") return NextResponse.json({ error: "Admin only" }, { status: 403 });
```

### 5. Validation Pattern
```typescript
import { umkmProfileSchema } from "@/lib/validation/umkm_profile.schema";

try {
  const parsed = umkmProfileSchema.parse(reqBody);
  // Use parsed data
} catch (error) {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: error.errors }, { status: 400 });
  }
}
```

## Important Gotchas

### 1. MongoDB UUID Casting
```typescript
import { UUID } from "mongodb";

// ALWAYS cast _id to UUID when querying
// @ts-expect-error cast _id to UUID
const umkm = await collection.findOne({ _id: new UUID(id) });
```

### 2. Cassandra Partition Keys
```typescript
// MUST include ALL partition key columns in WHERE clause
SELECT * FROM umkm_financial_log 
WHERE umkm_id = ? AND tahun = ?; // ✅ Correct

SELECT * FROM umkm_financial_log 
WHERE umkm_id = ?; // ❌ Missing tahun partition key
```

### 3. Session Token Storage
```typescript
// Sessions use HTTP-only cookies (not localStorage)
cookies().set("session_token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict"
});
```

### 4. Cassandra TTL
```typescript
// temp_tokens auto-delete after 15 minutes
// login_logs use manual cleanup (no TTL on timestamp)
// sessions.expires_at has TTL index for auto-cleanup
```

### 5. GeoJSON Format
```javascript
// MongoDB GeoJSON (longitude first!)
{
  "lokasi": {
    "type": "Point",
    "coordinates": [112.6426, -7.9466] // [lng, lat] ← NOT [lat, lng]
  }
}

// Create 2dsphere index for geospatial queries
db.umkm_profiles.createIndex({ "lokasi": "2dsphere" });
```

## Development Workflow

### 1. Starting Databases
```bash
docker compose up -d
```

### 2. Seeding Data
```bash
# MongoDB (includes 2 pre-seeded accounts)
docker exec -it sigma-mongo mongosh -u <user> -p <pass> --authenticationDatabase admin /seed_mongo.js

# Cassandra
docker exec -it sigma-cassandra cqlsh -u <user> -p <pass> -f /schema_umkm.cql
docker exec -it sigma-cassandra cqlsh -u <user> -p <pass> -f /seed_umkm.cql
```

### 3. Pre-Seeded Test Accounts
```
ADMIN:   admin@sigma-umkm.com / admin123
PEJABAT: pejabat@sigma-umkm.com / pejabat123
```

### 4. Running Dev Server
```bash
npm run dev
```

### 5. Testing RBAC
- Login as ADMIN → Access `/admin` dashboard
- Login as PEJABAT → Should redirect from `/admin` to home (PEJABAT blocked)
- No login → Public access with restricted data

## API Route Structure

```typescript
// Pattern: Check auth → Validate → Execute → Return
export async function POST(req: NextRequest) {
  // 1. Check authentication & authorization
  const { user, error } = await requireAuth(["ADMIN"]);
  if (error) return NextResponse.json({ error }, { status: 403 });

  // 2. Parse and validate request body
  const body = await req.json();
  const parsed = schema.parse(body);

  // 3. Execute database operations
  const result = await db.collection("...").insertOne(parsed);

  // 4. Return success response
  return NextResponse.json({ message: "Success", data: result }, { status: 201 });
}
```

## Database Schema Highlights

### MongoDB Collections
```typescript
umkm_profiles: {
  _id: UUID,
  nama_usaha: string,
  sektor: string,
  pemilik: { nama, nik?, telepon, email? },
  lokasi: GeoJSON Point,
  wilayah: { kota, provinsi, alamat_lengkap? },
  legalitas?: { nib?, pirt?, halal? },
  summary_terakhir?: { omzet_terakhir, bulan }
}

users: {
  _id: UUID,
  email: string (unique),
  password_hash: string (bcrypt),
  role: "ADMIN" | "PEJABAT",
  account_status: "unverified" | "active"
}

sessions: {
  _id: UUID (session_token),
  user_id: UUID,
  expires_at: Date (TTL indexed)
}
```

### Cassandra Tables
```cql
umkm_financial_log: 
  PRIMARY KEY ((umkm_id, tahun), bulan)
  -- Partition by UMKM per year
  -- Cluster by month DESC

login_logs:
  PRIMARY KEY (user_id, login_time)
  -- Audit trail per user

login_attempts:
  PRIMARY KEY (ip_address)
  -- Counter type for rate limiting
```

## Common Tasks

### Adding a New API Endpoint
1. Create `app/api/[feature]/route.ts`
2. Import `requireAuth` from `@/lib/auth`
3. Define allowed roles: `await requireAuth(["ADMIN"], false)`
4. Use `allowPublic=true` if public access needed
5. Validate input with Zod schema
6. Return proper HTTP status codes

### Adding a New Database Field
1. **MongoDB**: Add to seed file + Zod schema
2. **Cassandra**: ALTER TABLE (or drop/recreate in dev)
3. Update TypeScript interfaces in `lib/types.ts`
4. Update API routes to handle new field

### Password Hashing
```bash
# Generate new bcrypt hashes
node db/generate_password_hashes.js
# Copy output to seed_mongo.js
```

### Checking Database Connections
```
GET /api/test
# Returns MongoDB + Cassandra connection status
```

## Frontend Glassmorphism Style

The UI uses glassmorphism design:
```tsx
className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl"
```

**Key patterns:**
- Dark gradient backgrounds: `bg-[#0f172a]`
- Glass cards: `bg-white/5 backdrop-blur-2xl`
- Borders: `border-white/10` or `border-white/20`
- Hover states: `hover:bg-white/20`

## Debugging Tips

1. **MongoDB Connection Issues**: Check ports (27018 not 27017)
2. **Cassandra Connection Issues**: Check datacenter name (`datacenter1`)
3. **Login Fails**: Check bcrypt hash in `users` collection
4. **Session Expired**: Check `sessions.expires_at` (24h TTL)
5. **RBAC Not Working**: Verify `user.role` in `/api/auth/me` response

## Security Considerations

- ✅ Passwords hashed with bcrypt (12 rounds)
- ✅ HTTP-only cookies prevent XSS attacks
- ✅ Rate limiting via Cassandra counters
- ✅ Session expiration (24 hours)
- ✅ Role-based access control on all API routes
- ⚠️ Email verification disabled in development (manual activation needed)

---

**Remember:** This is a dual-database system. Always consider which database is the source of truth for each data type. MongoDB for profiles, Cassandra for time-series events.