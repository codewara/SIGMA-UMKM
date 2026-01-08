# SIGMA-UMKM (Sistem Monitoring UMKM - SDG 8)

A Next.js application for monitoring and managing Indonesian MSMEs (Micro, Small, and Medium Enterprises) data with polyglot persistence architecture using MongoDB and Cassandra.

## 🎯 Project Overview

SIGMA-UMKM is a dual-database system designed to handle both transactional and analytical workloads:
- **MongoDB**: Stores rich UMKM profile data with GeoJSON support
- **Cassandra**: Handles time-series financial logs and high-write audit trails

## 🏗️ Architecture & Data Flow

```mermaid
flowchart LR
    subgraph Users["👥 Users"]
        Public["Public"]
        Owner["UMKM_OWNER"]
        Pejabat["PEJABAT"]
        Admin["ADMIN"]
    end
    
    subgraph App["Next.js Application"]
        Frontend["Frontend Pages"]
        API["API Routes"]
        Services["Services Layer"]
    end
    
    subgraph DB["Databases"]
        Mongo[("MongoDB<br/>Profiles & Auth")]
        Cass[("Cassandra<br/>Financial & Logs")]
    end
    
    Users --> Frontend
    Frontend --> API
    API --> Services
    Services --> Mongo
    Services --> Cass
    
    style Mongo fill:#13aa52,color:#fff
    style Cass fill:#1287b1,color:#fff
    style Public fill:#e1f5ff
    style Owner fill:#fff3e0
    style Pejabat fill:#f3e5f5
    style Admin fill:#ffebee
```

### Architecture Overview

**User Roles:**
- 🌐 **Public** - Browse verified UMKMs (no login)
- 👤 **UMKM_OWNER** - Register business, input revenue
- 👔 **PEJABAT** - Verify UMKMs, flag suspicious data
- ⚡ **ADMIN** - Full system management

**Technology Stack:**
- **Frontend**: Next.js 16 + React 19 + Tailwind CSS 4
- **Backend**: Next.js API Routes + Service Layer
- **Databases**: MongoDB (profiles) + Cassandra (time-series)
- **Auth**: bcrypt + HTTP-only cookies + RBAC

**Key Workflows:**

1. **UMKM Registration → Verification**
   ```
   Owner registers → PENDING → Pejabat reviews → VERIFIED/REJECTED
   ```

2. **Financial Data → Flagging**
   ```
   Owner inputs revenue → Pejabat flags suspicious → Owner gets notified
   ```

3. **Data Persistence Strategy**
   - **MongoDB**: UMKM profiles, users, sessions (transactional)
   - **Cassandra**: Financial logs, notifications, audit trails (time-series)
   - **Cache**: Latest financial summary in MongoDB for fast reads

## 📊 Database Schemas

### MongoDB Schema

```mermaid
erDiagram
    %% Main Business Collection
    UMKM_PROFILES {
        uuid _id PK "UUID format, synced with Cassandra"
        uuid owner_id FK "UMKM_OWNER who registered"
        string nama_usaha
        string sektor "e.g. Kuliner, Fashion, Kriya"
        date tanggal_bergabung
        object pemilik "Embedded: nama, nik, telepon, email"
        object lokasi "GeoJSON Point [long, lat]"
        object wilayah "Embedded: kota, provinsi, alamat_lengkap"
        object legalitas "Embedded: nib, pirt, halal, dokumen_url, status_verifikasi, verified_by, tanggal_verifikasi, rejection_reason"
        boolean is_deleted "Soft delete flag"
        date deleted_at "Soft delete timestamp"
        object summary_terakhir "Cache: omzet_terakhir, bulan"
    }
    
    %% Authentication Collections
    USERS {
        uuid _id PK
        string email UK "Unique index"
        string password_hash "bcrypt hashed"
        string role "ADMIN | PEJABAT | UMKM_OWNER"
        string account_status "unverified | active"
        object profile "For UMKM_OWNER: nama_lengkap, nik, telepon"
        date created_at
        date expires_at "Account expiry for unverified"
    }
    
    SESSIONS {
        uuid _id PK "session_token"
        uuid user_id FK
        date expires_at "TTL indexed"
    }
    
    %% Relationships
    %% One User (Owner) manages Many UMKMs
    USERS ||--o{ UMKM_PROFILES : "owns_and_manages"
    
    %% One User has Many Sessions
    USERS ||--o{ SESSIONS : "has_active"
```

**Embedded Document Details:**

```javascript
// pemilik (1:1 embedded)
{
  "nama": "string",
  "nik": "string (optional)",
  "telepon": "string",
  "email": "string (optional)"
}

// lokasi (GeoJSON Point for geospatial queries)
{
  "type": "Point",
  "coordinates": [longitude, latitude]  // e.g., [112.6426, -7.9466]
}

// wilayah (nested location data)
{
  "kota": "string",
  "provinsi": "string",
  "alamat_lengkap": "string (optional)"
}

// legalitas (business permits & verification status)
{
  "nib": "string (optional)",
  "pirt": "string (optional)",
  "halal": "boolean (optional)",
  "dokumen_url": "string (optional) - URL to uploaded documents",
  "status_verifikasi": "PENDING | VERIFIED | REJECTED",
  "verified_by": "uuid (optional) - PEJABAT who verified",
  "tanggal_verifikasi": "Date (optional)",
  "rejection_reason": "string (optional)"
}

// summary_terakhir (cached financial data to avoid cross-DB joins)
{
  "omzet_terakhir": "decimal",
  "bulan": "int"  // month number (1-12)
}
```

**Key Collections:**

| Collection | Purpose | Key Features | Indexes |
|------------|---------|--------------|---------|
| `umkm_profiles` | UMKM master data | GeoJSON support, rich nested documents | `2dsphere` on lokasi, compound on (sektor, wilayah.kota) |
| `users` | Authentication | Email unique index, bcrypt hashing | Unique on email |
| `sessions` | Session management | Auto-cleanup via TTL | TTL on expires_at |

### Cassandra Schema

```mermaid
erDiagram
    %% Core Business Tables
    
    %% Tabel Utama: Log Transaksi
    %% Partition Key Gabungan: (umkm_id, tahun)
    UMKM_FINANCIAL_LOG {
        uuid umkm_id PK "Partition Key 1"
        int tahun PK "Partition Key 2"
        int bulan PK "Clustering Key (DESC)"
        timestamp tgl_input
        decimal omzet
        int jumlah_karyawan
        text nama_usaha "Denormalized"
        text sektor "Denormalized"
        boolean is_flagged "PEJABAT flag for suspicious data"
        text flag_reason "Reason for flagging"
        uuid flagged_by "PEJABAT who flagged"
        timestamp flagged_at "When flagged"
        uuid input_by "UMKM_OWNER who input data"
    }

    %% Tabel Agregasi Sektor
    %% Partition Key Gabungan: (sektor, tahun)
    DASHBOARD_SECTOR_STATS {
        text sektor PK "Partition Key 1"
        int tahun PK "Partition Key 2"
        int bulan PK "Clustering Key (ASC)"
        decimal total_omzet "Aggregated Sum"
        int total_umkm "Aggregated Count"
    }

    %% Tabel Agregasi Wilayah
    %% Partition Key Gabungan: (kota, tahun)
    DASHBOARD_REGION_STATS {
        text kota PK "Partition Key 1"
        int tahun PK "Partition Key 2"
        int bulan PK "Clustering Key (ASC)"
        decimal total_omzet "Aggregated Sum"
        int umkm_aktif "Aggregated Count"
    }

    %% Tabel Analisis Pertumbuhan
    ANALYSIS_UMKM_GROWTH {
        uuid umkm_id PK "Partition Key"
        text periode PK "Clustering Key e.g. 2024-Q1"
        float growth_rate
        text status_kesehatan
        text rekomendasi
    }
    
    %% Authentication & Security Tables
    
    LOGIN_LOGS {
        uuid user_id PK "Partition Key"
        timestamp login_time PK "Clustering Key (DESC)"
        text status
        inet ip_address
        text device_info
    }
    
    LOGIN_ATTEMPTS {
        inet ip_address PK "Partition Key"
        counter attempt_count "Counter Type"
    }
    
    TEMP_TOKENS {
        uuid token_value PK "Partition Key"
        uuid user_id
        text purpose "password_reset | email_verification"
    }
    
    VERIFICATION_TASKS {
        text status PK "Partition Key: PENDING|VERIFIED|REJECTED"
        timestamp created_at PK "Clustering Key DESC"
        uuid umkm_id
        text nama_usaha
        text owner_email
    }
    
    FLAG_NOTIFICATIONS {
        uuid owner_id PK "Partition Key"
        timestamp created_at PK "Clustering Key DESC"
        uuid umkm_id
        int bulan
        int tahun
        text flag_reason
        text flagged_by_name
        boolean is_read
    }
```

**Key Tables:**

| Table | Partition Key | Clustering Key | Purpose |
|-------|---------------|----------------|---------|
| `umkm_financial_log` | (umkm_id, tahun) | bulan DESC | Time-series financial data per UMKM per year |
| `dashboard_sector_stats` | (sektor, tahun) | bulan ASC | Pre-aggregated sector metrics for dashboard |
| `dashboard_region_stats` | (kota, tahun) | bulan ASC | Pre-aggregated region metrics for dashboard |
| `analysis_umkm_growth` | umkm_id | periode | AI-generated growth analysis and recommendations |
| `login_logs` | user_id | login_time DESC | Audit trail for user authentication |
| `login_attempts` | ip_address | - | Rate limiting with counter type |
| `temp_tokens` | token_value | - | TTL 15 mins for email verification/password reset |
| `verification_tasks` | status | created_at DESC | PEJABAT task queue for UMKM verification |
| `flag_notifications` | owner_id | created_at DESC | Notifications for UMKM_OWNER about flagged data |

## 🗂️ Project Structure

```
SIGMA-UMKM/
├── app/
│   ├── api/
│   │   ├── admin/
│   │   │   └── users/
│   │   │       ├── route.ts          # GET/POST /api/admin/users (User Management)
│   │   │       └── [id]/
│   │   │           └── route.ts      # PATCH|DELETE /api/admin/users/[id]
│   │   ├── auth/
│   │   │   ├── login/route.ts        # POST /api/auth/login
│   │   │   ├── logout/route.ts       # POST /api/auth/logout
│   │   │   ├── me/route.ts           # GET /api/auth/me
│   │   │   ├── register/route.ts     # POST /api/auth/register
│   │   │   └── verify-email/route.ts # GET /api/auth/verify-email?token=...
│   │   ├── umkm/
│   │   │   ├── route.ts              # GET|POST /api/umkm
│   │   │   ├── pending/route.ts      # GET /api/umkm/pending (PEJABAT)
│   │   │   ├── my-umkm/route.ts      # GET /api/umkm/my-umkm (UMKM_OWNER)
│   │   │   └── [id]/
│   │   │       └── route.ts          # GET|PATCH|DELETE /api/umkm/[id]
│   │   ├── analytics/
│   │   │   ├── financial/route.ts    # GET /api/analytics/financial
│   │   │   ├── forecast/route.ts     # GET /api/analytics/forecast
│   │   │   ├── growth/route.ts       # GET /api/analytics/growth
│   │   │   ├── heatmap/route.ts      # GET /api/analytics/heatmap
│   │   │   └── revenue/route.ts      # GET /api/analytics/revenue
│   │   ├── financial/
│   │   │   └── [umkm_id]/route.ts    # GET /api/financial/[umkm_id]
│   │   ├── financial-log/
│   │   │   └── route.ts              # GET|POST /api/financial-log
│   │   ├── verification/
│   │   │   ├── pending/route.ts      # GET /api/verification/pending
│   │   │   └── [id]/route.ts         # POST /api/verification/[id] (approve/reject)
│   │   ├── notifications/
│   │   │   ├── route.ts              # GET /api/notifications
│   │   │   └── [id]/route.ts         # PATCH /api/notifications/[id]
│   │   ├── dashboard/
│   │   │   └── owner/route.ts        # GET /api/dashboard/owner
│   │   └── test/route.ts             # Database connection test
│   ├── auth/
│   │   ├── login/page.tsx            # Login form
│   │   └── register/page.tsx         # Registration form
│   ├── dashboard/
│   │   ├── admin/
│   │   │   ├── layout.tsx            # Admin dashboard layout
│   │   │   ├── page.tsx              # Admin overview
│   │   │   └── users/
│   │   │       └── page.tsx          # User management (PEJABAT CRUD)
│   │   ├── pejabat/
│   │   │   ├── layout.tsx            # Pejabat dashboard layout
│   │   │   ├── page.tsx              # Pejabat overview
│   │   │   ├── verifikasi/
│   │   │   │   └── page.tsx          # UMKM verification queue
│   │   │   └── umkm/
│   │   │       └── [id]/
│   │   │           ├── page.tsx      # UMKM detail + financial logs + flagging
│   │   │           └── lapor/        # (Future: Financial report entry)
│   │   └── owner/
│   │       ├── layout.tsx            # Owner dashboard layout
│   │       ├── page.tsx              # Owner overview
│   │       └── umkm/
│   │           └── [id]/
│   │               └── lapor/
│   │                   ├── page.tsx  # Financial report page
│   │                   └── components/
│   │                       ├── FinancialForm.tsx
│   │                       ├── FinancialChart.tsx
│   │                       └── FinancialTable.tsx
│   ├── admin/page.tsx                # ⚠️ DEPRECATED: Redirects to /dashboard/admin
│   ├── components/
│   │   └── DashboardLayout.tsx       # Shared dashboard layout for all roles
│   ├── demo/
│   │   ├── page.tsx                  # Demo mode selection (auto-login for testing)
│   │   └── actions.ts                # Demo login server action
│   ├── katalog/page.tsx              # Public UMKM catalog (no login needed)
│   ├── peta/page.tsx                 # Public geospatial map (no login needed)
│   ├── umkm/
│   │   ├── [id]/page.tsx             # UMKM detail view (public + auth variations)
│   │   └── form-daftar/page.tsx      # UMKM registration form
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Homepage (landing page with role-based navigation)
├── services/
│   ├── auth.service.ts               # Auth business logic (registration, login, sessions)
│   ├── financial.service.ts          # Financial logs, flagging, owner notifications
│   └── verification.service.ts       # UMKM verification (approve/reject)
├── lib/
│   ├── auth.ts                       # RBAC middleware & session management
│   ├── db.ts                         # MongoDB & Cassandra connections
│   ├── mailer.ts                     # Nodemailer config (email verification)
│   ├── types.ts                      # TypeScript types & interfaces
│   ├── rbac-helpers.ts               # RBAC helper functions
│   ├── formatter.ts                  # Data formatting utilities
│   └── validation/
│       ├── auth.schema.ts            # Zod validation for auth (login, register)
│       ├── umkm_profile.schema.ts    # Zod validation for UMKM profiles
│       ├── financial.schema.ts       # Zod validation for financial flagging
│       └── umkm_financial.schema.ts  # Zod validation for financial logs
├── db/
│   ├── schema_umkm.cql               # Cassandra keyspace & tables
│   ├── seed_mongo.js                 # MongoDB seed with 4 test accounts
│   └── seed_umkm.cql                 # Cassandra seed data
├── public/                           # Static assets
├── compose.yml                       # Docker Compose (MongoDB + Cassandra)
├── middleware.ts                     # Next.js middleware for route protection
├── .env                              # Environment variables
└── README.md                         # This file
```

### **New Structure Notes:**
- ✅ **`/dashboard/{admin,pejabat,owner}`**: New role-based dashboard structure
- ✅ **`/app/admin`**: Old admin page now redirects to `/dashboard/admin`  
- ✅ **Shared Components**: `DashboardLayout.tsx` for consistent UI across all roles
- ✅ **Public Routes**: `/katalog`, `/peta`, `/` (no auth required, aggregated data)
- ✅ **Protected Routes**: `/dashboard/*` (session & role-based access)

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Docker Desktop (for Windows)
- MongoDB Compass (optional GUI)

### 1. Environment Setup

Create `.env` file:
```env
MONGO_USERNAME=mongo_username
MONGO_PASSWORD=mongo_password
MONGO_COLLECTION=sigma_db
MONGO_URI=mongodb://mongo_username:mongo_password@localhost:27018?authSource=admin

CASSANDRA_USERNAME=cassandra_username
CASSANDRA_PASSWORD=cassandra_password
CASSANDRA_KEYSPACE=sigma_ks
CASSANDRA_CONTACT_POINTS=localhost:9043
CASSANDRA_LOCAL_DATACENTER=datacenter1
```

### 2. Start Databases

```bash
docker compose up -d
```

### 3. Seed Databases

**MongoDB (includes UMKM profiles + pre-seeded user accounts):**
```bash
docker cp db/seed_mongo.js sigma-mongo:/seed_mongo.js
docker exec -it sigma-mongo mongosh -u <MONGO_USERNAME> -p <MONGO_PASSWORD> --authenticationDatabase admin /seed_mongo.js
```

Replace `<MONGO_USERNAME>` and `<MONGO_PASSWORD>` with your actual MongoDB credentials from `.env`.

This will create:
- ✅ 10 UMKM profiles (Kuliner, Fashion, Jasa, Kriya)
- ✅ 3 pre-configured user accounts (ADMIN, PEJABAT, UMKM_OWNER)

**Cassandra (financial time-series data):**
```bash
docker cp db/schema_umkm.cql sigma-cassandra:/schema_umkm.cql
docker cp db/seed_umkm.cql sigma-cassandra:/seed_umkm.cql
docker exec -it sigma-cassandra cqlsh -u <CASSANDRA_USERNAME> -p <CASSANDRA_PASSWORD> -f /schema_umkm.cql
docker exec -it sigma-cassandra cqlsh -u <CASSANDRA_USERNAME> -p <CASSANDRA_PASSWORD> -f /seed_umkm.cql
```

Replace `<CASSANDRA_USERNAME>` and `<CASSANDRA_PASSWORD>` with your actual Cassandra credentials from `.env`.

### 4. Install Dependencies & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Pre-Seeded Test Accounts

The MongoDB seeder automatically creates these accounts for testing:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **ADMIN** | admin@sigma-umkm.com | admin123 | Full system access |
| **PEJABAT** | pejabat@sigma-umkm.com | pejabat123 | Verify UMKMs + flag revenue data |
| **UMKM_OWNER** | owner@sigma-umkm.com | owner123 | Register UMKM + input own revenue |

**Login at:** [http://localhost:3000/auth/login](http://localhost:3000/auth/login)

**Testing Public Access:**
- No login needed - browse [http://localhost:3000](http://localhost:3000) without authentication
- Public users automatically receive restricted/aggregated data only

### How to Use Test Accounts

**All accounts are pre-activated and ready to use immediately** - no email verification required for seeded accounts.

**Quick Start:**
1. Go to [http://localhost:3000/auth/login](http://localhost:3000/auth/login)
2. Login with any of the accounts above
3. You'll be automatically redirected to the appropriate dashboard:
   - ADMIN → `/dashboard/admin`
   - PEJABAT → `/dashboard/pejabat`
   - UMKM_OWNER → `/dashboard/owner`

**Creating Additional Users (If Needed):**
You can register new UMKM_OWNER accounts through:
- **Frontend:** [http://localhost:3000/auth/register](http://localhost:3000/auth/register)
- **API:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"newowner@test.com","password":"pass123","nama_lengkap":"New Owner"}'
```

**Note:** Email verification is disabled in development mode, so new accounts are immediately active.

**Frontend Pages:**
- `/` - Homepage with role-based navigation
- `/auth/login` - Login page (use pre-seeded accounts above)
- `/auth/register` - Registration page (UMKM_OWNER registration)
- `/dashboard/admin` - Admin dashboard (ADMIN only)
- `/dashboard/pejabat` - Pejabat dashboard (PEJABAT verification & flagging)
- `/dashboard/owner` - Owner dashboard (UMKM_OWNER own UMKMs management)
- `/katalog` - Public UMKM catalog (no login needed)
- `/peta` - Public geospatial map (no login needed)
- `/umkm/[id]` - UMKM detail (full data for authenticated, basic for public)

## 🔐 Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant A as Next.js API
    participant M as MongoDB
    participant C as Cassandra
    
    U->>A: POST /api/auth/register
    A->>M: Create user (hashed password)
    A->>C: Generate temp_token (TTL 15min)
    A->>U: Send verification email
    
    U->>A: GET /api/auth/verify-email?token=xxx
    A->>C: Check temp_token exists
    A->>M: Update account_status=active
    A->>U: Redirect to login
    
    U->>A: POST /api/auth/login
    A->>C: Check login_attempts < 5
    A->>M: Verify credentials
    A->>M: Create session
    A->>C: Log success to login_logs
    A->>U: Set session cookie
```

**Security Features:**
- bcrypt password hashing
- Rate limiting (5 attempts per IP)
- HTTP-only cookies
- Session expiration (24h)
- Email verification with TTL tokens

## 🛡️ Role-Based Access Control (RBAC)

### User Roles

| Role | Description |
|------|-------------|
| **ADMIN** | Full system access - manage UMKM profiles, edit/delete data, view all details |
| **PEJABAT** | Government official - **primary focus: verify UMKM profiles, flag suspicious revenue data**, view full dashboard |
| **UMKM_OWNER** | Business owner - register UMKM profile, input monthly revenue, view own UMKM data |
| **Unauthenticated (Public)** | No login required - automatically receive aggregated/restricted data only |

**Note:** ADMIN, PEJABAT, and UMKM_OWNER require registered accounts. Public visitors can browse without registration.

### Access Matrix

| Feature / Action | ADMIN | PEJABAT | UMKM_OWNER | Public (No Login) | Database |
|------------------|-------|---------|------------|-------------------|----------|
| **Tambah UMKM Baru** | ✅ YES | ❌ NO | ✅ Own Profile | ❌ NO | MongoDB |
| **Edit Profil UMKM** | ✅ YES | ❌ NO | ✅ Own Profile | ❌ NO | MongoDB |
| **Hapus UMKM** | ✅ YES | ❌ NO | ❌ NO | ❌ NO | MongoDB |
| **Verifikasi UMKM** | ✅ YES | ✅ **PRIMARY FOCUS** | ❌ NO | ❌ NO | MongoDB + Cassandra |
| **Input Omzet Bulanan** | ⚠️ Can | ⚠️ Can | ✅ Own UMKM | ❌ NO | Cassandra |
| **Flag Omzet Suspicious** | ✅ YES | ✅ **PRIMARY FOCUS** | ❌ NO | ❌ NO | Cassandra |
| **Lihat Dashboard** | ✅ Full Data | ✅ Full Data | ✅ Own UMKM | ⚠️ Aggregated Only | Cassandra |
| **Lihat Detail UMKM** | ✅ Full (with contact) | ✅ Full (with contact) | ✅ Own Profile | ⚠️ Basic Info Only | MongoDB |

### API Endpoint Permissions

| Endpoint | ADMIN | PEJABAT | UMKM_OWNER | Public (No Login) |
|----------|-------|---------|------------|-------------------|
| `GET /api/umkm` | Full data | Full data | Own UMKMs | Basic info only (nama, sektor, kota) |
| `POST /api/umkm` | ✅ | ❌ | ✅ (auto-assign owner_id) | ❌ |
| `GET /api/umkm/[id]` | Full + contact | Full + contact | Own UMKM | Basic only |
| `PATCH /api/umkm/[id]` | ✅ | ❌ | ✅ Own UMKM | ❌ |
| `DELETE /api/umkm/[id]` | ✅ (soft delete) | ❌ | ❌ | ❌ |
| `GET /api/analytics/financial` | Full data | Full data | Own UMKMs | Aggregated stats only |
| `GET /api/analytics/financial/[umkm_id]` | ✅ | ✅ | ✅ Own UMKM | ❌ |
| `POST /api/analytics/financial/[umkm_id]` | ✅ | ✅ | ✅ Own UMKM | ❌ |
| `PATCH /api/analytics/financial/[umkm_id]` | ✅ | ❌ | ❌ | ❌ |
| `DELETE /api/analytics/financial/[umkm_id]` | ✅ | ❌ | ❌ | ❌ |
| `GET /api/verification/pending` | ✅ | ✅ ⭐ | ❌ | ❌ |
| `POST /api/verification/[id]/approve` | ✅ | ✅ ⭐ | ❌ | ❌ |
| `POST /api/verification/[id]/reject` | ✅ | ✅ ⭐ | ❌ | ❌ |
| `POST /api/financial/[umkm_id]/[tahun]/[bulan]/flag` | ✅ | ✅ ⭐ | ❌ | ❌ |
| `DELETE /api/financial/[umkm_id]/[tahun]/[bulan]/flag` | ✅ | ✅ | ❌ | ❌ |
| `GET /api/notifications` | ❌ | ❌ | ✅ Own notifications | ❌ |
| `PATCH /api/notifications/[id]/read` | ❌ | ❌ | ✅ Own notification | ❌ |
| `GET /api/dashboard/owner` | ❌ | ❌ | ✅ Own UMKM stats | ❌ |

⭐ **PRIMARY FOCUS**: Main responsibility for PEJABAT role

## 📈 Key Features

1. **Polyglot Persistence**: Right database for the right job
   - MongoDB for complex queries and geospatial data
   - Cassandra for time-series and write-heavy workloads

2. **Denormalization Strategy**:
   - `nama_usaha` + `sektor` duplicated in Cassandra for faster reads
   - `summary_terakhir` cached in MongoDB to avoid cross-DB joins

3. **Scalability Patterns**:
   - Cassandra partition keys designed for even distribution
   - Counter columns for efficient rate limiting
   - TTL for automatic cleanup

4. **Type Safety**: Zod schemas + TypeScript for runtime validation

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Databases**: MongoDB 7, Cassandra 5
- **Styling**: Tailwind CSS 4
- **Validation**: Zod 4
- **Auth**: bcrypt, UUID v4
- **Email**: Nodemailer
- **Container**: Docker Compose

## 📝 API Endpoints

### 🧪 Testing
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/test` | Database connection test (MongoDB + Cassandra) |

### 🔐 Authentication
| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/api/auth/register` | User registration with role assignment | `{ email, password, role? }` |
| GET | `/api/auth/verify-email?token={token}` | Email verification via token | - |
| POST | `/api/auth/login` | User login with rate limiting | `{ email, password }` |
| POST | `/api/auth/logout` | User logout (invalidate session) | `{ sessionToken }` |
| GET | `/api/auth/me` | Get current user info (for frontend) | - |

### 🏢 UMKM Profile Management (MongoDB)
| Method | Endpoint | Description | Access | Request Body |
|--------|----------|-------------|--------|--------------|
| GET | `/api/umkm` | List UMKMs (filtered by role) | Public/All | - |
| GET | `/api/umkm/my-umkm` | Get owner's UMKMs | UMKM_OWNER | - |
| GET | `/api/umkm/pending` | Get pending verifications | PEJABAT/ADMIN | - |
| POST | `/api/umkm` | Register new UMKM profile | UMKM_OWNER | `{ nama_usaha, sektor, pemilik, lokasi, wilayah, legalitas }` |
| GET | `/api/umkm/[id]` | Get UMKM profile by ID | Public/All | - |
| PATCH | `/api/umkm/[id]` | Update UMKM profile | UMKM_OWNER (own) | Partial fields |
| DELETE | `/api/umkm/[id]` | Soft delete UMKM profile | UMKM_OWNER (own) | - |

### 📊 Financial Management (Cassandra)
| Method | Endpoint | Description | Access | Request Body |
|--------|----------|-------------|--------|--------------|
| GET | `/api/financial/[umkm_id]` | Get financial logs by UMKM | All (filtered) | - |
| GET | `/api/financial-log` | Get financial logs | UMKM_OWNER/PEJABAT/ADMIN | - |
| POST | `/api/financial-log` | Create financial log entry | UMKM_OWNER | `{ umkm_id, tahun, bulan, omzet, jumlah_karyawan }` |

### 📈 Analytics (Cassandra)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/analytics/financial` | Financial analytics | ADMIN/PEJABAT |
| GET | `/api/analytics/revenue` | Revenue trends | ADMIN/PEJABAT |
| GET | `/api/analytics/growth` | Growth analysis | ADMIN/PEJABAT |
| GET | `/api/analytics/forecast` | Revenue forecasting | ADMIN/PEJABAT |
| GET | `/api/analytics/heatmap` | Geographic heatmap data | ADMIN/PEJABAT |

### ✅ Verification Management (PEJABAT/ADMIN)
| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/api/verification/pending` | Get pending UMKM verification tasks | - |
| POST | `/api/verification/[id]` | Approve/reject UMKM profile | `{ action: "approve" \| "reject", rejection_reason? }` |

### 🔔 Notifications (UMKM_OWNER)
| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/api/notifications` | Get flag notifications for owner's UMKMs | - |
| PATCH | `/api/notifications/[id]` | Mark notification as read | - |

### 📊 Dashboard
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/dashboard/owner` | Get owner's UMKM stats + notifications | UMKM_OWNER |