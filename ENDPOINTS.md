# SIGMA UMKM - Daftar Endpoint Halaman

## Halaman Utama (Public/Guest)
| Path | Deskripsi | Method | Status |
|------|-----------|--------|--------|
| `/auth/login` | Halaman Login | GET | ✅ Complete |
| `/auth/register` | Halaman Registrasi | GET | ✅ Complete |

## Halaman User/UMKM (Protected)
| Path | Deskripsi | Method | Status |
|------|-----------|--------|--------|
| `/` | Dashboard UMKM (Home) | GET | ✅ Complete |
| `/umkm/[id]` | Detail Profil UMKM | GET | ✅ Complete |

## Halaman Admin
| Path | Deskripsi | Method | Status |
|------|-----------|--------|--------|
| `/admin/umkm` | Kelola UMKM | GET | ✅ Complete |
| `/admin/revenue` | Laporan Pendapatan | GET | ✅ Complete |
| `/admin/forecast` | Prediksi Penjualan | GET | ✅ Complete |

## Halaman Test
| Path | Deskripsi | Method | Status |
|------|-----------|--------|--------|
| `/test` | Halaman Test | GET | ✅ Complete |

## Fitur yang Tersedia di Setiap Halaman

### Dashboard (`/`)
- ✅ Navigasi Header dengan Logo SIGMA UMKM
- ✅ Statistik: Total UMKM, Transaksi, Pertumbuhan, Terverifikasi
- ✅ Search Bar untuk mencari UMKM
- ✅ Section "UMKM Saya" - Daftar UMKM milik user
- ✅ Button "Daftarkan UMKM Saya"
- ✅ Modal Form Registrasi UMKM (6 field input)
- ✅ Section "Semua UMKM" - Grid layout 3 kolom
- ✅ Card UMKM dengan Header Biru (blue-500), Text Putih
- ✅ Button "Lihat Detail" di setiap card
- ✅ Footer dengan Info SIGMA UMKM

### Detail UMKM (`/umkm/[id]`)
- ✅ Dark Gradient Background
- ✅ Profil Header dengan Cover Image
- ✅ Informasi Kontak Grid
- ✅ Showcase Produk
- ✅ Performance Stats (4 cards)
- ✅ Revenue Trend Chart
- ✅ Recommendations Section

### Admin UMKM (`/admin/umkm`)
- ✅ Management Table
- ✅ Action Buttons

### Admin Revenue (`/admin/revenue`)
- ✅ Revenue Tracking
- ✅ Charts & Analytics

### Admin Forecast (`/admin/forecast`)
- ✅ Forecast Predictions
- ✅ Trend Analysis

## Rencana Pengembangan API

### Authentication Endpoints (Belum Diimplementasikan)
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET  /api/auth/me
```

### UMKM Endpoints (Belum Diimplementasikan)
```
GET    /api/umkm                    # List semua UMKM
GET    /api/umkm/[id]              # Detail UMKM
POST   /api/umkm                    # Create UMKM baru
PUT    /api/umkm/[id]              # Update UMKM
DELETE /api/umkm/[id]              # Delete UMKM
GET    /api/umkm/my                 # List UMKM milik user
```

### Analytics Endpoints (Belum Diimplementasikan)
```
GET /api/analytics/stats            # Statistik umum
GET /api/analytics/revenue          # Data revenue
GET /api/analytics/forecast         # Data forecast
GET /api/analytics/umkm/[id]/stats  # Stats UMKM tertentu
```

### Search Endpoints (Belum Diimplementasikan)
```
GET /api/search?query=xxx           # Search UMKM
```

## Design System

### Warna Utama
- **Primary Blue**: `blue-500` - Card headers, buttons
- **Accent Colors**: 
  - Green: `green-600` - Success, growth positif
  - Red: `red-600` - Alert, decline
  - Orange: `orange-600` - Warning
- **Background**: Gradient `from-gray-50 via-blue-50 to-purple-50`
- **Text**: Gray tones untuk kontras

### Komponen Standar
- **Cards**: White background dengan rounded-2xl, shadow-lg
- **Buttons**: blue-500 primary, hover:blue-600
- **Icons**: lucide-react library
- **Typography**: Tailwind default dengan font-bold untuk header

## Teknologi Stack
- **Framework**: Next.js 16.1.1
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: lucide-react
- **State Management**: React Hooks (useState)
- **Build Tool**: Turbopack

## Status Pengembangan
🟢 **Frontend**: 90% Complete
🔴 **Backend API**: 0% Complete
🔴 **Database Integration**: 0% Complete
🔴 **Authentication**: 0% Complete
