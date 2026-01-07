# SIGMA-UMKM (Sistem Monitoring UMKM - SDG 8)

A Next.js application for monitoring and managing Indonesian MSMEs (Micro, Small, and Medium Enterprises) data with polyglot persistence architecture using MongoDB and Cassandra.

## 🎯 Project Overview

SIGMA-UMKM is a dual-database system designed to handle both transactional and analytical workloads:
- **MongoDB**: Stores rich UMKM profile data with GeoJSON support
- **Cassandra**: Handles time-series financial logs and high-write audit trails

## 🏗️ Architecture & Data Flow

```mermaid
flowchart TB
    Client[Client Browser]
    NextJS[Next.js App Router]
    API[API Routes]
    Mongo[(MongoDB:<br/>umkm_profiles<br/>users<br/>sessions)]
    Cass[(Cassandra:<br/>financial_log<br/>login_logs<br/>dashboard_stats)]
    
    Client -->|HTTP Request| NextJS
    NextJS --> API
    API -->|Profile, Auth| Mongo
    API -->|Financial, Audit| Cass
    API -->|Denormalized Reads| Mongo
    API -->|Time-Series Writes| Cass
    
    style Mongo fill:#13aa52
    style Cass fill:#1287b1
    style NextJS fill:#000000
```

## 📊 Database Schemas

### MongoDB Schema

```mermaid
erDiagram
    %% Main Business Collection
    UMKM_PROFILES {
        uuid _id PK "UUID format, synced with Cassandra"
        string nama_usaha
        string sektor "e.g. Kuliner, Fashion, Kriya"
        date tanggal_bergabung
        object pemilik "Embedded: nama, nik, telepon, email"
        object lokasi "GeoJSON Point [long, lat]"
        object wilayah "Embedded: kota, provinsi, alamat_lengkap"
        object legalitas "Embedded: nib, pirt, halal"
        object summary_terakhir "Cache: omzet_terakhir, bulan"
    }
    
    %% Authentication Collections
    USERS {
        uuid _id PK
        string email UK "Unique index"
        string password_hash "bcrypt hashed"
        string role "ADMIN | PEJABAT | UMUM"
        string account_status "unverified | active"
        date created_at
        date expires_at "Account expiry for unverified"
    }
    
    SESSIONS {
        uuid _id PK "session_token"
        uuid user_id FK
        date expires_at "TTL indexed"
    }
    
    %% Relationships
    USERS ||--o{ SESSIONS : "has_many"
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

// legalitas (business permits)
{
  "nib": "string (optional)",
  "pirt": "string (optional)",
  "halal": "boolean (optional)"
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

## 🗂️ Project Structure

```
SIGMA-UMKM/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts         # POST /api/auth/login
│   │   │   ├── register/route.ts      # POST /api/auth/register
│   │   │   └── verify-email/route.ts  # GET /api/auth/verify-email?token=...
│   │   ├── umkm/
│   │   │   └── route.ts               # GET|POST /api/umkm
│   │   └── test/route.ts              # Database connection test
│   ├── auth/
│   │   ├── login/page.tsx             # Login form
│   │   └── register/page.tsx          # Registration form
│   ├── admin/
│   │   └── umkm/page.tsx              # Admin dashboard
│   ├── umkm/
│   │   ├── page.tsx                   # UMKM list view
│   │   └── [id]/page.tsx              # UMKM detail view
│   ├── layout.tsx                     # Root layout
│   └── page.tsx                       # Homepage
├── services/
│   └── auth.service.ts                # Auth business logic
├── lib/
│   ├── db.ts                          # Database connections
│   ├── mailer.ts                      # Nodemailer config
│   ├── types.ts                       # TypeScript types
│   └── validation/
│       ├── umkm_profile.schema.ts     # Zod validation for UMKM
│       └── umkm_financial.schema.ts   # Zod validation for financial
├── db/
│   ├── schema_umkm.cql                # Cassandra schema
│   ├── seed_umkm.cql                  # Cassandra seed data
│   └── seed_mongo.js                  # MongoDB seed data
├── compose.yml                        # Docker Compose config
└── .env                               # Environment variables
```

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
docker exec -it sigma-mongo mongosh -u mongo_username -p mongo_password --authenticationDatabase admin /seed_mongo.js
```

This will create:
- ✅ 10 UMKM profiles (Kuliner, Fashion, Jasa, Kriya)
- ✅ 2 pre-configured user accounts (ADMIN & PEJABAT)

**Cassandra (financial time-series data):**
```bash
docker cp db/schema_umkm.cql sigma-cassandra:/schema_umkm.cql
docker cp db/seed_umkm.cql sigma-cassandra:/seed_umkm.cql
docker exec -it sigma-cassandra cqlsh -u cassandra_username -p cassandra_password -f /schema_umkm.cql
docker exec -it sigma-cassandra cqlsh -u cassandra_username -p cassandra_password -f /seed_umkm.cql
```

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
| **PEJABAT** | pejabat@sigma-umkm.com | pejabat123 | Revenue input + full dashboard |

**Login at:** [http://localhost:3000/auth/login](http://localhost:3000/auth/login)

**Testing Public Access:**
- No login needed - browse [http://localhost:3000](http://localhost:3000) without authentication
- Public users automatically receive restricted/aggregated data only

**Creating Additional Users (Optional):**
Only ADMIN and PEJABAT roles can be registered. Use the registration API:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"newadmin@test.com","password":"pass123","role":"ADMIN"}'
```

**Note:** New accounts require email verification. Since email is not configured in development, you can manually update the `account_status` to `"active"` in MongoDB.

**Frontend Pages:**
- `/` - Homepage with role-based navigation (ADMIN/PEJABAT get action buttons)
- `/auth/login` - Login page (use pre-seeded accounts above)
- `/admin` - Admin dashboard (ADMIN only)
- `/admin/revenue` - Revenue input page (PEJABAT primary focus)
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
| **PEJABAT** | Government official - **primary role for inputting monthly revenue**, view full dashboard |
| **Unauthenticated (Public)** | No login required - automatically receive aggregated/restricted data only |

**Note:** Only ADMIN and PEJABAT users need accounts. Public visitors can browse without registration.

### Access Matrix

| Feature / Action | ADMIN | PEJABAT | Public (No Login) | Database |
|------------------|-------|---------|-------------------|-----------|
| **Tambah UMKM Baru** | ✅ YES | ❌ NO | ❌ NO | MongoDB |
| **Edit Profil UMKM** | ✅ YES | ❌ NO | ❌ NO | MongoDB |
| **Hapus UMKM** | ✅ YES | ❌ NO | ❌ NO | MongoDB |
| **Input Omzet Bulanan** | ⚠️ Can | ✅ **PRIMARY FOCUS** | ❌ NO | Cassandra |
| **Lihat Dashboard** | ✅ Full Data | ✅ Full Data | ⚠️ Aggregated Only | Cassandra |
| **Lihat Detail UMKM** | ✅ Full (with contact) | ✅ Full (with contact) | ⚠️ Basic Info Only | MongoDB |

### API Endpoint Permissions

| Endpoint | ADMIN | PEJABAT | Public (No Login) |
|----------|-------|---------|-------------------|
| `GET /api/umkm` | Full data | Full data | Basic info only (nama, sektor, kota) |
| `POST /api/umkm` | ✅ | ❌ | ❌ |
| `GET /api/umkm/[id]` | Full + contact | Full + contact | Basic only |
| `PATCH /api/umkm/[id]` | ✅ | ❌ | ❌ |
| `DELETE /api/umkm/[id]` | ✅ | ❌ | ❌ |
| `GET /api/analytics/financial` | Full data | Full data | Aggregated stats only |
| `GET /api/analytics/financial/[umkm_id]` | ✅ | ✅ | ❌ |
| `POST /api/analytics/financial/[umkm_id]` | ✅ | ✅ ⭐ | ❌ |
| `PATCH /api/analytics/financial/[umkm_id]` | ✅ | ❌ | ❌ |
| `DELETE /api/analytics/financial/[umkm_id]` | ✅ | ❌ | ❌ |

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
| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/api/umkm` | List all UMKMs | - |
| POST | `/api/umkm` | Register new UMKM profile | `{ nama_usaha, sektor, pemilik, lokasi, wilayah, legalitas }` |
| GET | `/api/umkm/[id]` | Get UMKM profile by ID | - |
| PATCH | `/api/umkm/[id]` | Update UMKM profile | Partial fields |
| DELETE | `/api/umkm/[id]` | Delete UMKM profile | - |

### 📊 Financial Analytics (Cassandra)
| Method | Endpoint | Description | Query Params | Request Body |
|--------|----------|-------------|--------------|--------------|
| GET | `/api/analytics/financial` | Get all financial logs | - | - |
| GET | `/api/analytics/financial/[umkm_id]` | Get financial logs by UMKM ID | `?tahun=2024` | - |
| POST | `/api/analytics/financial/[umkm_id]` | Create financial log entry | - | `{ tahun, bulan, omzet, jumlah_karyawan, nama_usaha, sektor }` |
| PATCH | `/api/analytics/financial/[umkm_id]` | Update financial log entry | `?tahun=2024&bulan=6` | Partial fields |
| DELETE | `/api/analytics/financial/[umkm_id]` | Delete financial log entry | `?tahun=2024&bulan=6` | - |
