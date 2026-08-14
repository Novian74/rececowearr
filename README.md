# 🌸 Rececowear - Bio Link & Affiliate Link In Bio Platform

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?style=for-the-badge&logo=postgresql)
![Vercel Edge](https://img.shields.io/badge/Deployment-Vercel_Edge-000000?style=for-the-badge&logo=vercel)

**Rececowear** adalah platform Bio-Link modern (klon Lynk.id & Linktree) yang dirancang khusus untuk kreator konten, bisnis fashion, dan pemasar affiliate Shopee. Dilengkapi dengan filter kategori otomatis, pencarian gambar pintar (fuzzy case-insensitive), sistem pagination, live smartphone simulator, dan Edge CDN Caching untuk performa super cepat (<10ms).

---

## 📸 Preview Tampilan

| Tampilan Publik Halaman Utama | Dashboard Admin & Live Simulator |
| :---: | :---: |
| ![Public Bio Link](public/halamanutama.png) | ![Admin Dashboard](public/halamanadmin.png)


---

## ✨ Fitur-Fitur Unggulan

### 🛍️ 1. Halaman Publik Pembeli (Public Bio-Link)
- **Desain Glassmorphism Aesthetic**: Background gradasi 3-warna khas (`#ec8aa7`, `#80a1d1`, `#e6afbf`).
- **12 Kategori Produk Auto-Filter (Grid 3-Kolom)**:
  - `C` ➔ Cardigan
  - `SP` ➔ Sepatu
  - `TB` ➔ Totebag
  - `K` ➔ Kaos
  - `KM` ➔ Kemeja
  - `ST` ➔ Setelan
  - `CL` ➔ Celana
  - `AS` ➔ Atasan
  - `BT` ➔ Boots
  - `BL` ➔ Blouse
  - `RK` ➔ Rok
  - `Semua` ➔ Seluruh produk
- **25 Produk per Halaman**: Navigasi pagination mulus (`< 1 / X >`).
- **Instant Search Bar**: Mencari kode produk atau kata kunci secara real-time.

### ⚙️ 2. Dashboard Admin (`/admin/my-lynk`)
- **Auto-Fill Nama Gambar**: Nama file gambar otomatis mengikuti Judul Produk secara real-time saat diketik.
- **Pencarian Gambar Pintar (Fuzzy Case-Insensitive)**: Bebas dari error 404/gambar pecah walaupun ada perbedaan huruf besar/kecil (`C023.jpeg` vs `c023.jpeg`).
- **Drag & Drop Reordering**: Mengubah urutan produk dengan mudah.
- **Pop-Up Konfirmasi Hapus ("Iya" / "Tidak")**: Dialog konfirmasi aman sebelum menghapus produk.
- **30 Produk per Halaman Admin**: List admin yang rapi tanpa perlu scroll terlalu jauh.
- **Live Smartphone Simulator**: Preview perubahan secara langsung di samping kanan admin.

### 🚀 3. Performa & Tracking Affiliate
- **Click Analytics & Redirection**: Route `/api/click/[id]` mencatat statistik jumlah klik sebelum mengarahkan pembeli ke Shopee Affiliate secara aman.
- **Vercel Edge CDN Caching**: Response header `s-maxage=60, stale-while-revalidate=300` untuk loading kilat.

---

## 🛠️ Teknologi yang Digunakan

- **Framework**: Next.js 16 (App Router & Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Lucide Icons
- **Database & ORM**: PostgreSQL (Supabase) + Prisma ORM
- **Authentication**: JWT Cookie Authentication
- **Deployment**: Vercel Serverless & Edge Network

---

## 🚀 Panduan Memulai (Quickstart Guide)

### 1. Clone Repositori
```bash
git clone https://github.com/Novian74/rececowearr.git
cd projek-rececowear
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Buka file `.env` dan isi kredensial database & JWT secret kamu:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/rececowear"
JWT_SECRET="masukkan_secret_jwt_kamu"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="password_admin_kamu"
```

### 4. Setup Database (Prisma)
Jalankan perintah ini untuk melakukan migrasi schema Prisma ke database kamu:
```bash
npx prisma generate
npx prisma db push
```

### 5. Jalankan Local Development Server
```bash
npm run dev
```
Buka browser di:
- **Halaman Utama**: [http://localhost:3000](http://localhost:3000)
- **Dashboard Admin**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## 📁 Struktur Direktori Project

```text
projek_rececowear/
├── prisma/
│   └── schema.prisma         # Schema database PostgreSQL
├── public/
│   ├── images/
│   │   ├── logo.svg          # Logo profil avatar static
│   │   └── products/         # Folder penyimpanan foto produk static
│   └── uploads/
├── src/
│   ├── app/
│   │   ├── admin/            # Halaman admin (login, my-lynk, appearance, stats)
│   │   ├── api/              # API endpoints (links, profile, click, analytics)
│   │   └── page.tsx          # Halaman Bio-Link Publik
│   ├── components/           # Komponen UI (Sidebar, MobilePreview, Header)
│   ├── lib/                  # Helper utilities (image-helper, category-helper, prisma)
│   └── types/                # Definisi TypeScript Interfaces
├── .env.example              # Template environment variables tanpa kredensial
├── .gitignore                # Aturan ignore git (node_modules, .env, .next)
├── package.json
└── README.md                 # Dokumentasi publik project
```

---

## 📝 Lisensi

Project ini dirilis di bawah lisensi [MIT License](LICENSE). Bebas digunakan dan dikembangkan kembali! 🌸
