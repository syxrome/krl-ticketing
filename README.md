# KRL Fare Management & Simulation System

> **Aplikasi Simulasi Akademik** — Sistem simulasi perhitungan tarif perjalanan KRL, pembayaran tiket, riwayat transaksi, dan laporan pendapatan.

> ⚠️ **PENTING**: Ini adalah aplikasi simulasi untuk keperluan tugas Algoritma dan Pemrograman. Bukan sistem tiket KRL resmi. Tarif simulasi tidak mencerminkan tarif KRL sesungguhnya.

---

## Deskripsi Proyek

KRL Fare Simulator adalah aplikasi web statis yang mensimulasikan sistem manajemen tarif kereta rel listrik. Aplikasi ini dibangun untuk mendemonstrasikan penerapan algoritma perhitungan tarif bertingkat, manajemen transaksi, dan visualisasi data.

### Tujuan Akademik

1. Menerapkan algoritma perhitungan tarif bertingkat (Metode A dan B)
2. Mengimplementasikan dua metode perhitungan tarif yang berbeda
3. Menerapkan tipe data, operator, percabangan, perulangan, fungsi, dan struktur data
4. Mengembangkan simulasi transaksi yang realistis
5. Membangun frontend modern dan responsif

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React 19 |
| Language | TypeScript (strict mode) |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (custom) |
| Icons | Lucide React |
| Routing | React Router v7 |
| Form Management | React Hook Form |
| Validation | Zod |
| State Management | React Hooks + Context API |
| Local Persistence | localStorage |
| Charts | Recharts |
| Unit Testing | Vitest |
| Component Testing | React Testing Library |
| Package Manager | npm |

---

## Fitur Lengkap

### 1. Dashboard
- KPI cards: Total transaksi, Total pendapatan, Total diskon, Rata-rata tarif
- Grafik transaksi per metode (Bar Chart)
- Grafik distribusi kategori penumpang (Pie Chart)
- Grafik pendapatan per hari (Area Chart)
- 5 transaksi terakhir
- Quick action menuju transaksi
- Empty state jika belum ada data

### 2. Kalkulator Tarif
- Pilih metode A (stasiun) atau B (kilometer)
- Form dinamis — input berubah sesuai metode
- Breakdown perhitungan langkah per langkah
- Pilihan kategori penumpang dengan diskon
- Tombol lanjut ke transaksi

### 3. Transaksi Tiket
- State machine: DRAFT → REVIEW → PAYMENT → SUCCESS | CANCELLED
- Step indicator visual
- Input validasi pembayaran simulasi tunai
- Kalkulasi kembalian otomatis
- Bukti pembayaran digital
- Hanya transaksi SUCCESS yang disimpan

### 4. Riwayat Transaksi
- Tabel semua transaksi berhasil
- Filter: metode, kategori, rentang tanggal
- Pencarian berdasarkan ID
- Sortir: tanggal, tarif
- Modal detail transaksi lengkap
- Empty state

### 5. Laporan Pendapatan
- Ringkasan KPI
- Breakdown per metode
- Distribusi kategori penumpang
- Grafik pendapatan per hari
- Tabel laporan harian

### 6. Dokumentasi Algoritma
- Penjelasan konsep IPO (Input-Process-Output)
- Pseudocode Metode A dan B
- Flowchart algoritma
- State machine diagram transaksi
- Tabel contoh hasil perhitungan
- Penjelasan validasi dan penanganan error

### 7. Pengaturan Simulasi
- Tampilan parameter tarif (read-only)
- Reset pengaturan
- Hapus semua data simulasi (dengan konfirmasi)

---

## Aturan Tarif

### Metode A — Berdasarkan Jumlah Stasiun

```
Jika N <= 5 stasiun:
    tarif = Rp2.000

Jika N > 5 stasiun:
    tarif = Rp2.000 + ceil((N - 5) / 3) x Rp500
```

| Stasiun | Tarif |
|---|---|
| 1-5 | Rp2.000 |
| 6-8 | Rp2.500 |
| 9-11 | Rp3.000 |
| 12-14 | Rp3.500 |
| 15-17 | Rp4.000 |

### Metode B — Berdasarkan Kilometer

```
Jika D <= 25 km:
    tarif = Rp3.000

Jika D > 25 km:
    tarif = Rp3.000 + ceil((D - 25) / 10) x Rp1.000
```

| Kilometer | Tarif |
|---|---|
| <= 25 km | Rp3.000 |
| 25.1-35 km | Rp4.000 |
| 35.1-45 km | Rp5.000 |
| 45.1-55 km | Rp6.000 |

### Diskon Kategori Penumpang

| Kategori | Diskon |
|---|---|
| Umum | 0% |
| Pelajar | 10% |
| Lansia | 20% |
| Anak-anak | 50% |

---

## Arsitektur

```
src/
  app/
    App.tsx              # Root component
    router.tsx           # Route definitions
  components/
    ui/                  # Reusable UI components
    layout/              # AppLayout, Sidebar, Header
    charts/              # Recharts wrappers
    dashboard/           # KpiCard, etc.
  context/
    TransactionContext.tsx
    ThemeContext.tsx
  features/
    fare/
      fare.types.ts      # Type definitions
      fare.engine.ts     # Core calculation (pure functions)
      fare.schema.ts     # Zod schemas
      fare.test.ts       # Unit tests
    transactions/
      transaction.types.ts
      transaction.service.ts
      transaction.test.ts
    reports/
      report.service.ts
      report.test.ts
  lib/
    utils.ts, currency.ts, date.ts, storage.ts
  pages/
    DashboardPage.tsx
    FareCalculatorPage.tsx
    TransactionPage.tsx
    HistoryPage.tsx
    RevenuePage.tsx
    AlgorithmPage.tsx
    SettingsPage.tsx
    NotFoundPage.tsx
  tests/
    setup.ts
```

---

## Cara Menjalankan

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Unit tests
npm run test

# Production build
npm run build

# Preview build
npm run preview
```

---

## Cara Deployment — Caddy

```caddy
# Caddyfile
localhost {
    root * /path/to/dist
    file_server
    try_files {path} /index.html
}
```

---

## Batasan Simulasi

1. Bukan sistem tiket resmi - tidak terhubung ke sistem KRL manapun
2. Tarif simulasi tidak mencerminkan tarif KRL Jabodetabek sesungguhnya
3. Data hanya tersimpan di browser lokal (localStorage)
4. Tidak ada autentikasi pengguna
5. Pembayaran adalah simulasi cash, bukan gateway nyata
6. Data hilang jika localStorage dibersihkan browser

---

*Tugas Algoritma dan Pemrograman — KRL Fare Management & Simulation System*
