// src/pages/AlgorithmPage.tsx
import { useState } from 'react'
import {
  BookOpen,
  Code2,
  GitBranch,
  Cpu,
  Layers,
  CheckCircle2,
  ArrowDown,
  Terminal,
  FileCode,
  ShieldCheck,
  Tag,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

export function AlgorithmPage() {
  const [activeTab, setActiveTab] = useState('konsep')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Dokumentasi Algoritma & Pemrograman</h2>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Bedah teknis komprehensif, diagram alir data, pseudocode, dan implementasi struktur logika aplikasi
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full h-auto p-1">
          <TabsTrigger value="konsep" className="py-2.5 text-xs sm:text-sm">
            <Cpu className="h-4 w-4 mr-1.5" />
            Dasar Pemrograman & IPO
          </TabsTrigger>
          <TabsTrigger value="algoritma" className="py-2.5 text-xs sm:text-sm">
            <Code2 className="h-4 w-4 mr-1.5" />
            Algoritma Tarif & Diskon
          </TabsTrigger>
          <TabsTrigger value="flowchart" className="py-2.5 text-xs sm:text-sm">
            <GitBranch className="h-4 w-4 mr-1.5" />
            Diagram Alir (Flowchart)
          </TabsTrigger>
          <TabsTrigger value="validasi" className="py-2.5 text-xs sm:text-sm">
            <ShieldCheck className="h-4 w-4 mr-1.5" />
            Validasi & Arsitektur
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: DASAR PEMROGRAMAN & IPO */}
        <TabsContent value="konsep" className="space-y-6">
          {/* Card: Latar Belakang & Tujuan */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[hsl(var(--primary))]" />
                1. Latar Belakang & Tujuan Aplikasi
              </CardTitle>
              <CardDescription className="text-xs">
                Peranan komputasi logika dalam sistem perkeretaapian komuter (KRL)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed">
              <p>
                Sistem simulasi tarif KRL ini dirancang untuk mendemonstrasikan bagaimana prinsip-prinsip dasar
                ilmu komputer dan pemrograman dapat diintegrasikan guna memecahkan masalah riil pada layanan transportasi publik.
                Dalam penentuan tarif kereta komuter modern, tarif tidak bersifat statis, melainkan bertingkat (tiered progressive fare)
                yang ditentukan oleh jarak fisik atau jumlah stasiun persinggahan.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="rounded-lg border border-[hsl(var(--border))] p-3 bg-[hsl(var(--muted))]/20">
                  <div className="font-semibold text-xs text-[hsl(var(--primary))]">Efisiensi Algoritmik</div>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                    Menghitung biaya dengan kompleksitas waktu konstan O(1) berbasis rumus matematis pembulatan ke atas (ceil).
                  </p>
                </div>
                <div className="rounded-lg border border-[hsl(var(--border))] p-3 bg-[hsl(var(--muted))]/20">
                  <div className="font-semibold text-xs text-[hsl(var(--primary))]">Keadilan Subsidi (Equity)</div>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                    Penerapan persentase diskon sosial bagi pelajar, lansia, dan anak-anak secara terotomatisasi.
                  </p>
                </div>
                <div className="rounded-lg border border-[hsl(var(--border))] p-3 bg-[hsl(var(--muted))]/20">
                  <div className="font-semibold text-xs text-[hsl(var(--primary))]">Integritas Transaksi</div>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                    State machine tertutup yang menjamin validasi saldo tunai dan mencegah kebocoran pencatatan omzet.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card: Konsep IPO */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="h-4 w-4 text-[hsl(var(--primary))]" />
                2. Pola Arsitektur Logika IPO (Input → Process → Output)
              </CardTitle>
              <CardDescription className="text-xs">
                Siklus pengolahan data perjalanan dari interaksi pengguna menjadi laporan finansial
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-lg border border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
                    <span className="flex h-5 w-5 rounded-full bg-blue-600 text-white items-center justify-center text-[10px]">1</span>
                    Input (Masukan)
                  </div>
                  <ul className="text-xs space-y-1.5 text-[hsl(var(--muted-foreground))] list-disc list-inside">
                    <li><strong className="text-[hsl(var(--foreground))]">Metode Tarif:</strong> Pilihan 'A' (Stasiun) atau 'B' (Kilometer).</li>
                    <li><strong className="text-[hsl(var(--foreground))]">Nilai Perjalanan:</strong> Bilangan bulat positif (Stasiun) atau desimal (Km).</li>
                    <li><strong className="text-[hsl(var(--foreground))]">Kategori Penumpang:</strong> Umum (0%), Pelajar (10%), Lansia (20%), Anak (50%).</li>
                    <li><strong className="text-[hsl(var(--foreground))]">Uang Pembayaran:</strong> Nominal rupiah uang tunai yang diserahkan.</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
                    <span className="flex h-5 w-5 rounded-full bg-amber-600 text-white items-center justify-center text-[10px]">2</span>
                    Process (Pemrosesan)
                  </div>
                  <ul className="text-xs space-y-1.5 text-[hsl(var(--muted-foreground))] list-disc list-inside">
                    <li><strong className="text-[hsl(var(--foreground))]">Validasi Zod:</strong> Sanitasi angka, anti-NaN, batas maksimum.</li>
                    <li><strong className="text-[hsl(var(--foreground))]">Kalkulasi Bertingkat:</strong> Rumus fungsi plafon Math.ceil.</li>
                    <li><strong className="text-[hsl(var(--foreground))]">Komputasi Diskon:</strong> Penerapan tarif_dasar × % / 100 dengan round_half_up.</li>
                    <li><strong className="text-[hsl(var(--foreground))]">Verifikasi Bayar:</strong> Cek apakah Uang ≥ Tarif Akhir & hitung kembalian.</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-green-500/30 bg-green-50/50 dark:bg-green-950/20 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-green-600 font-bold text-xs uppercase tracking-wider">
                    <span className="flex h-5 w-5 rounded-full bg-green-600 text-white items-center justify-center text-[10px]">3</span>
                    Output (Keluaran)
                  </div>
                  <ul className="text-xs space-y-1.5 text-[hsl(var(--muted-foreground))] list-disc list-inside">
                    <li><strong className="text-[hsl(var(--foreground))]">Rincian Tiket:</strong> Tarif dasar, biaya tambahan, potongan diskon, dan tarif akhir.</li>
                    <li><strong className="text-[hsl(var(--foreground))]">Bukti Struk (ID Transaksi):</strong> Kode unik KRL-YYYYMMDD-XXXXXX.</li>
                    <li><strong className="text-[hsl(var(--foreground))]">Persistensi:</strong> Update data riwayat di localStorage browser.</li>
                    <li><strong className="text-[hsl(var(--foreground))]">Agregat Finansial:</strong> Pembaruan KPI omzet & grafik Recharts.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card: Konstruksi Bahasa Pemrograman */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Terminal className="h-4 w-4 text-[hsl(var(--primary))]" />
                3. Penerapan Komponen Bahasa Pemrograman (TypeScript)
              </CardTitle>
              <CardDescription className="text-xs">
                Implementasi tipe data, operator, kontrol alur, perulangan, dan modularitas fungsi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="rounded-lg border border-[hsl(var(--border))] p-3 space-y-2">
                  <div className="font-semibold text-sm text-[hsl(var(--primary))]">A. Tipe Data Primitif & Struktur</div>
                  <p className="text-[hsl(var(--muted-foreground))]">
                    Aplikasi menggunakan TypeScript strict mode dengan union types dan interfaces diskriminatif:
                  </p>
                  <pre className="rounded bg-slate-900 text-emerald-400 p-2.5 font-mono overflow-x-auto text-[11px]">
{`type FareMethod = 'A' | 'B';
type PassengerCategory = 'umum' | 'pelajar' | 'lansia' | 'anak';

interface Transaction {
  id: string;
  createdAt: string;
  method: FareMethod;
  journeyValue: number;
  finalFare: number;
  paymentAmount: number;
  changeAmount: number;
  status: 'SUCCESS';
}`}
                  </pre>
                </div>

                <div className="rounded-lg border border-[hsl(var(--border))] p-3 space-y-2">
                  <div className="font-semibold text-sm text-[hsl(var(--primary))]">B. Operator Aritmatika & Logika</div>
                  <p className="text-[hsl(var(--muted-foreground))]">
                    Operasi matematika pembagian bertingkat dan operator logika perbandingan:
                  </p>
                  <pre className="rounded bg-slate-900 text-emerald-400 p-2.5 font-mono overflow-x-auto text-[11px]">
{`// Aritmatika & Math.ceil
const extraGroups = Math.ceil((stations - 5) / 3);
const extraFare = extraGroups * 500;
const changeAmount = paymentAmount - finalFare;

// Logika & Percabangan Boolean
if (stations <= 5 && stations > 0) { ... }
const isValid = paymentAmount >= finalFare && Number.isInteger(stations);`}
                  </pre>
                </div>

                <div className="rounded-lg border border-[hsl(var(--border))] p-3 space-y-2">
                  <div className="font-semibold text-sm text-[hsl(var(--primary))]">C. Struktur Perulangan (Loops & Iterators)</div>
                  <p className="text-[hsl(var(--muted-foreground))]">
                    Pengolahan himpunan data transaksi menggunakan iterasi fungsional dan loop Map:
                  </p>
                  <pre className="rounded bg-slate-900 text-emerald-400 p-2.5 font-mono overflow-x-auto text-[11px]">
{`// Reducer akumulator (perulangan agregasi)
const totalRevenue = transactions.reduce((sum, t) => sum + t.finalFare, 0);

// Iterasi koleksi frekuensi kategori
for (const t of transactions) {
  const existing = categoryMap.get(t.passengerCategory) ?? { count: 0, revenue: 0 };
  categoryMap.set(t.passengerCategory, {
    count: existing.count + 1,
    revenue: existing.revenue + t.finalFare,
  });
}`}
                  </pre>
                </div>

                <div className="rounded-lg border border-[hsl(var(--border))] p-3 space-y-2">
                  <div className="font-semibold text-sm text-[hsl(var(--primary))]">D. Fungsi Modular & Pure Functions</div>
                  <p className="text-[hsl(var(--muted-foreground))]">
                    Fungsi perhitungan terisolasi secara murni (tanpa efek samping/side effects) sehingga mudah diuji (unit test):
                  </p>
                  <pre className="rounded bg-slate-900 text-emerald-400 p-2.5 font-mono overflow-x-auto text-[11px]">
{`// Pure calculation function
export function calculateDiscount(baseFare: number, category: PassengerCategory) {
  const info = PASSENGER_CATEGORIES.find((c) => c.id === category);
  const discountPercent = info?.discountPercent ?? 0;
  const discountAmount = Math.floor((baseFare * discountPercent) / 100 + 0.5);
  return { discountPercent, discountAmount, finalFare: baseFare - discountAmount };
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: ALGORITMA TARIF & DISKON */}
        <TabsContent value="algoritma" className="space-y-6">
          {/* Card: Metode A */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-blue-600" />
                  Metode A: Perhitungan Berdasarkan Jumlah Stasiun
                </CardTitle>
                <Badge variant="default">Metode A</Badge>
              </div>
              <CardDescription className="text-xs">
                Formula tarif berjenjang berbasis kuota perhentian stasiun (N)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 p-4 text-xs space-y-2">
                <div className="font-semibold text-blue-800 dark:text-blue-300">Ketentuan Logika Soal:</div>
                <ul className="list-disc list-inside space-y-1 text-[hsl(var(--muted-foreground))]">
                  <li>Rentang 1 – 5 stasiun pertama berlaku tarif dasar tetap yaitu <strong className="text-[hsl(var(--foreground))]">Rp2.000</strong>.</li>
                  <li>Setiap kelebihan stasiun di atas 5 stasiun dihitung dalam kelompok maksimal 3 stasiun sebesar <strong className="text-[hsl(var(--foreground))]">Rp500</strong> per kelompok.</li>
                  <li>Sisa stasiun yang tidak genap 3 stasiun tetap dibulatkan ke atas menjadi 1 kelompok penuh.</li>
                </ul>
              </div>

              <div>
                <div className="text-xs font-semibold mb-1 text-[hsl(var(--muted-foreground))]">Pseudocode Algoritma Metode A:</div>
                <pre className="rounded-lg bg-slate-900 text-emerald-400 p-4 font-mono text-xs overflow-x-auto">
{`ALGORITMA HitungTarifMetodeA(N: Integer) -> Integer
DEKLARASI:
    BASE_THRESHOLD <- 5
    BASE_FARE      <- 2000
    GROUP_SIZE     <- 3
    GROUP_FARE     <- 500
    extraGroups    <- 0
    extraFare      <- 0

DESKRIPSI:
    JIKA N <= BASE_THRESHOLD MAKA:
        KEMBALIKAN BASE_FARE
    SEBALIKNYA:
        extraGroups <- CEIL((N - BASE_THRESHOLD) / GROUP_SIZE)
        extraFare   <- extraGroups * GROUP_FARE
        KEMBALIKAN BASE_FARE + extraFare
    AKHIR JIKA`}
                </pre>
              </div>

              {/* Table Expected Results Metode A */}
              <div>
                <div className="text-xs font-semibold mb-2">Tabel Verifikasi Hasil Uji (Expected Results Metode A):</div>
                <div className="overflow-x-auto rounded border border-[hsl(var(--border))]">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[hsl(var(--muted))]/60 border-b border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]">
                      <tr>
                        <th className="p-2.5">Stasiun (N)</th>
                        <th className="p-2.5">Uraian Komputasi</th>
                        <th className="p-2.5">Kelompok Tambahan</th>
                        <th className="p-2.5 text-right">Tarif Dasar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[hsl(var(--border))]">
                      <tr>
                        <td className="p-2.5 font-bold">1</td>
                        <td className="p-2.5 text-[hsl(var(--muted-foreground))]">N &le; 5 (Tarif Dasar)</td>
                        <td className="p-2.5">0 kelompok</td>
                        <td className="p-2.5 text-right font-mono font-semibold">Rp2.000</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">5</td>
                        <td className="p-2.5 text-[hsl(var(--muted-foreground))]">N &le; 5 (Batas Atas Dasar)</td>
                        <td className="p-2.5">0 kelompok</td>
                        <td className="p-2.5 text-right font-mono font-semibold">Rp2.000</td>
                      </tr>
                      <tr className="bg-blue-50/20 dark:bg-blue-950/10">
                        <td className="p-2.5 font-bold">6</td>
                        <td className="p-2.5 text-[hsl(var(--muted-foreground))]">2000 + ceil((6-5)/3) &times; 500 = 2000 + 1(500)</td>
                        <td className="p-2.5">1 kelompok</td>
                        <td className="p-2.5 text-right font-mono font-semibold">Rp2.500</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">8</td>
                        <td className="p-2.5 text-[hsl(var(--muted-foreground))]">2000 + ceil((8-5)/3) &times; 500 = 2000 + 1(500)</td>
                        <td className="p-2.5">1 kelompok</td>
                        <td className="p-2.5 text-right font-mono font-semibold">Rp2.500</td>
                      </tr>
                      <tr className="bg-blue-50/20 dark:bg-blue-950/10">
                        <td className="p-2.5 font-bold">9</td>
                        <td className="p-2.5 text-[hsl(var(--muted-foreground))]">2000 + ceil((9-5)/3) &times; 500 = 2000 + 2(500)</td>
                        <td className="p-2.5">2 kelompok</td>
                        <td className="p-2.5 text-right font-mono font-semibold">Rp3.000</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">11</td>
                        <td className="p-2.5 text-[hsl(var(--muted-foreground))]">2000 + ceil((11-5)/3) &times; 500 = 2000 + 2(500)</td>
                        <td className="p-2.5">2 kelompok</td>
                        <td className="p-2.5 text-right font-mono font-semibold">Rp3.000</td>
                      </tr>
                      <tr className="bg-blue-50/20 dark:bg-blue-950/10">
                        <td className="p-2.5 font-bold">12</td>
                        <td className="p-2.5 text-[hsl(var(--muted-foreground))]">2000 + ceil((12-5)/3) &times; 500 = 2000 + 3(500)</td>
                        <td className="p-2.5">3 kelompok</td>
                        <td className="p-2.5 text-right font-mono font-semibold">Rp3.500</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">15</td>
                        <td className="p-2.5 text-[hsl(var(--muted-foreground))]">2000 + ceil((15-5)/3) &times; 500 = 2000 + 4(500)</td>
                        <td className="p-2.5">4 kelompok</td>
                        <td className="p-2.5 text-right font-mono font-semibold">Rp4.000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card: Metode B */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-purple-600" />
                  Metode B: Perhitungan Berdasarkan Kilometer (Jarak)
                </CardTitle>
                <Badge variant="secondary">Metode B</Badge>
              </div>
              <CardDescription className="text-xs">
                Formula tarif progresif berbasis jarak tempuh fisik lintasan (D)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900 p-4 text-xs space-y-2">
                <div className="font-semibold text-purple-800 dark:text-purple-300">Ketentuan Logika Soal:</div>
                <ul className="list-disc list-inside space-y-1 text-[hsl(var(--muted-foreground))]">
                  <li>25 kilometer pertama dikenakan tarif dasar flat yaitu <strong className="text-[hsl(var(--foreground))]">Rp3.000</strong>.</li>
                  <li>Setiap tambahan kelompok maksimal 10 km dikenakan tambahan <strong className="text-[hsl(var(--foreground))]">Rp1.000</strong> per kelompok.</li>
                  <li>Kelebihan jarak pecahan berapa pun (misalnya 25.1 km) dihitung 1 kelompok tambahan penuh.</li>
                  <li>Diperlukan normalisasi pembulatan desimal untuk menangkal anomali presisi floating-point IEEE-754.</li>
                </ul>
              </div>

              <div>
                <div className="text-xs font-semibold mb-1 text-[hsl(var(--muted-foreground))]">Pseudocode Algoritma Metode B:</div>
                <pre className="rounded-lg bg-slate-900 text-emerald-400 p-4 font-mono text-xs overflow-x-auto">
{`ALGORITMA HitungTarifMetodeB(D: Real) -> Integer
DEKLARASI:
    BASE_THRESHOLD <- 25.0
    BASE_FARE      <- 3000
    GROUP_SIZE     <- 10.0
    GROUP_FARE     <- 1000
    extraGroups    <- 0
    extraFare      <- 0

DESKRIPSI:
    JIKA D <= BASE_THRESHOLD MAKA:
        KEMBALIKAN BASE_FARE
    SEBALIKNYA:
        // Normalisasi presisi floating-point: Math.round(val * 1e10) / 1e10
        extraGroups <- CEIL((D - BASE_THRESHOLD) / GROUP_SIZE)
        extraFare   <- extraGroups * GROUP_FARE
        KEMBALIKAN BASE_FARE + extraFare
    AKHIR JIKA`}
                </pre>
              </div>

              {/* Table Expected Results Metode B */}
              <div>
                <div className="text-xs font-semibold mb-2">Tabel Verifikasi Hasil Uji (Expected Results Metode B):</div>
                <div className="overflow-x-auto rounded border border-[hsl(var(--border))]">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[hsl(var(--muted))]/60 border-b border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]">
                      <tr>
                        <th className="p-2.5">Jarak (D)</th>
                        <th className="p-2.5">Uraian Komputasi</th>
                        <th className="p-2.5">Kelompok Tambahan</th>
                        <th className="p-2.5 text-right">Tarif Dasar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[hsl(var(--border))]">
                      <tr>
                        <td className="p-2.5 font-bold">1 km</td>
                        <td className="p-2.5 text-[hsl(var(--muted-foreground))]">D &le; 25 km (Tarif Dasar)</td>
                        <td className="p-2.5">0 kelompok</td>
                        <td className="p-2.5 text-right font-mono font-semibold">Rp3.000</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">25 km</td>
                        <td className="p-2.5 text-[hsl(var(--muted-foreground))]">D &le; 25 km (Batas Atas Dasar)</td>
                        <td className="p-2.5">0 kelompok</td>
                        <td className="p-2.5 text-right font-mono font-semibold">Rp3.000</td>
                      </tr>
                      <tr className="bg-purple-50/20 dark:bg-purple-950/10">
                        <td className="p-2.5 font-bold">25.1 km</td>
                        <td className="p-2.5 text-[hsl(var(--muted-foreground))]">3000 + ceil((25.1-25)/10) &times; 1000 = 3000 + 1(1000)</td>
                        <td className="p-2.5">1 kelompok</td>
                        <td className="p-2.5 text-right font-mono font-semibold">Rp4.000</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">35 km</td>
                        <td className="p-2.5 text-[hsl(var(--muted-foreground))]">3000 + ceil((35-25)/10) &times; 1000 = 3000 + 1(1000)</td>
                        <td className="p-2.5">1 kelompok</td>
                        <td className="p-2.5 text-right font-mono font-semibold">Rp4.000</td>
                      </tr>
                      <tr className="bg-purple-50/20 dark:bg-purple-950/10">
                        <td className="p-2.5 font-bold">35.1 km</td>
                        <td className="p-2.5 text-[hsl(var(--muted-foreground))]">3000 + ceil((35.1-25)/10) &times; 1000 = 3000 + 2(1000)</td>
                        <td className="p-2.5">2 kelompok</td>
                        <td className="p-2.5 text-right font-mono font-semibold">Rp5.000</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">45 km</td>
                        <td className="p-2.5 text-[hsl(var(--muted-foreground))]">3000 + ceil((45-25)/10) &times; 1000 = 3000 + 2(1000)</td>
                        <td className="p-2.5">2 kelompok</td>
                        <td className="p-2.5 text-right font-mono font-semibold">Rp5.000</td>
                      </tr>
                      <tr className="bg-purple-50/20 dark:bg-purple-950/10">
                        <td className="p-2.5 font-bold">46 km</td>
                        <td className="p-2.5 text-[hsl(var(--muted-foreground))]">3000 + ceil((46-25)/10) &times; 1000 = 3000 + 3(1000)</td>
                        <td className="p-2.5">3 kelompok</td>
                        <td className="p-2.5 text-right font-mono font-semibold">Rp6.000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card: Subsidi Diskon */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Tag className="h-4 w-4 text-amber-500" />
                Ketentuan & Komputasi Diskon Penumpang
              </CardTitle>
              <CardDescription className="text-xs">
                Formula penerapan potongan harga sosial dan pembulatan round half up
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="font-semibold text-sm">Rumus Diskon:</div>
                  <pre className="rounded bg-slate-900 text-emerald-400 p-3 font-mono text-[11px]">
{`nilai_diskon = Math.floor((tarif_dasar * diskon_persen / 100) + 0.5)
tarif_akhir  = Math.max(0, tarif_dasar - nilai_diskon)`}
                  </pre>
                  <p className="text-[hsl(var(--muted-foreground))]">
                    Diskon diaplikasikan secara tepat 1 kali terhadap tarif dasar. Nilai uang akhir selalu berupa bilangan bulat (integer rupiah).
                  </p>
                </div>

                <div className="rounded border border-[hsl(var(--border))] p-3 space-y-1.5">
                  <div className="font-semibold text-sm">Daftar Kategori:</div>
                  <div className="flex justify-between py-1 border-b border-[hsl(var(--border))]">
                    <span>Umum:</span>
                    <span className="font-mono font-bold">0% (Rp0 potongan)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[hsl(var(--border))]">
                    <span>Pelajar / Mahasiswa:</span>
                    <span className="font-mono font-bold text-blue-600">10% Potongan</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[hsl(var(--border))]">
                    <span>Lansia (&ge; 60 tahun):</span>
                    <span className="font-mono font-bold text-amber-600">20% Potongan</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Anak-anak (&le; 10 tahun):</span>
                    <span className="font-mono font-bold text-green-600">50% Potongan</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: DIAGRAM ALIR (FLOWCHART) */}
        <TabsContent value="flowchart" className="space-y-6">
          {/* Flowchart 1: Alur Utama & State Machine Transaksi */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-[hsl(var(--primary))]" />
                Flowchart 1: State Machine Transaksi Tiket (Siklus Pembayaran)
              </CardTitle>
              <CardDescription className="text-xs">
                Diagram alur transisi status transaksi dari DRAFT hingga SUCCESS atau CANCELLED
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-2 py-4 text-xs font-mono">
                {/* Node 1: Start */}
                <div className="rounded-full bg-slate-800 text-white px-6 py-2 border-2 border-slate-700 shadow">
                  [MULAI TRANSAKSI]
                </div>

                <ArrowDown className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />

                {/* Node 2: DRAFT */}
                <div className="w-72 rounded-lg border-2 border-blue-500 bg-blue-50 dark:bg-blue-950/40 p-3 text-center shadow-sm">
                  <div className="font-bold text-blue-600">STATE: DRAFT</div>
                  <div className="text-[11px] text-[hsl(var(--muted-foreground))] mt-1">
                    Input Metode (A/B), Nilai Perjalanan, & Kategori
                  </div>
                </div>

                <ArrowDown className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />

                {/* Node 3: Decision Validasi Input */}
                <div className="w-72 rounded-lg border-2 border-amber-500 bg-amber-50 dark:bg-amber-950/40 p-3 text-center shadow-sm">
                  <div className="font-bold text-amber-600">&lt; Validasi Input Zod &gt;</div>
                  <div className="text-[11px] text-[hsl(var(--muted-foreground))] mt-1">
                    Angka positif? Integer (Metode A)? Kategori valid?
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full max-w-md justify-between px-2">
                  <span className="text-[11px] text-red-500 font-bold">&larr; TIDAK: Munculkan Pesan Error</span>
                  <span className="text-[11px] text-green-600 font-bold">YA &rarr;</span>
                </div>

                <ArrowDown className="h-5 w-5 text-green-600" />

                {/* Node 4: REVIEW */}
                <div className="w-72 rounded-lg border-2 border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 p-3 text-center shadow-sm">
                  <div className="font-bold text-indigo-600">STATE: REVIEW</div>
                  <div className="text-[11px] text-[hsl(var(--muted-foreground))] mt-1">
                    Tampilkan Rincian Tarif Dasar, Diskon, & Tarif Akhir
                  </div>
                </div>

                <div className="flex items-center justify-between w-full max-w-sm px-6">
                  <span className="text-[11px] text-red-500">&swarr; Batal</span>
                  <span className="text-[11px] text-green-600">Lanjut Bayar &searr;</span>
                </div>

                <div className="grid grid-cols-2 gap-8 w-full max-w-lg mt-1">
                  {/* Cancelled Box */}
                  <div className="rounded-lg border-2 border-red-500 bg-red-50 dark:bg-red-950/40 p-3 text-center">
                    <div className="font-bold text-red-600">STATE: CANCELLED</div>
                    <div className="text-[10px] text-[hsl(var(--muted-foreground))] mt-1">
                      Tidak ada penyimpanan data; omzet tidak berubah
                    </div>
                  </div>

                  {/* Payment Box */}
                  <div className="rounded-lg border-2 border-blue-500 bg-blue-50 dark:bg-blue-950/40 p-3 text-center">
                    <div className="font-bold text-blue-600">STATE: PAYMENT</div>
                    <div className="text-[10px] text-[hsl(var(--muted-foreground))] mt-1">
                      Input Nominal Tunai (Uang Bayar)
                    </div>
                  </div>
                </div>

                <div className="w-full flex justify-end max-w-lg pr-16 mt-2">
                  <ArrowDown className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                </div>

                {/* Decision Verifikasi Uang Bayar */}
                <div className="w-72 self-end mr-6 rounded-lg border-2 border-amber-500 bg-amber-50 dark:bg-amber-950/40 p-3 text-center shadow-sm">
                  <div className="font-bold text-amber-600">&lt; Uang &ge; Tarif Akhir? &gt;</div>
                  <div className="text-[10px] text-[hsl(var(--muted-foreground))] mt-1">
                    Cek kecukupan nominal pembayaran
                  </div>
                </div>

                <div className="w-full flex justify-end max-w-lg pr-16 mt-1">
                  <span className="text-[10px] text-green-600 font-bold">YA (Hitung Kembalian) &darr;</span>
                </div>

                {/* Node: SUCCESS */}
                <div className="w-72 self-end mr-6 rounded-lg border-2 border-green-600 bg-green-50 dark:bg-green-950/40 p-3 text-center shadow-sm">
                  <div className="font-bold text-green-600">STATE: SUCCESS</div>
                  <div className="text-[10px] text-[hsl(var(--muted-foreground))] mt-1">
                    Generate ID Unik, Simpan ke localStorage, Update Laporan
                  </div>
                </div>

                <div className="w-full flex justify-end max-w-lg pr-36 mt-1">
                  <ArrowDown className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                </div>

                {/* Selesai */}
                <div className="self-end mr-16 rounded-full bg-slate-800 text-white px-6 py-2 border-2 border-slate-700 shadow">
                  [CETAK STRUK & SELESAI]
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Flowchart 2: Logika Komputasi Tarif (Metode A & B) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-[hsl(var(--primary))]" />
                Flowchart 2: Mesin Perhitungan Tarif Bertingkat (Engine Logika)
              </CardTitle>
              <CardDescription className="text-xs">
                Struktur percabangan pemilihan metode komputasi tarif dasar KRL
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-2 py-4 text-xs font-mono">
                <div className="rounded-full bg-slate-800 text-white px-5 py-2">
                  [PILIH METODE TARIF]
                </div>

                <ArrowDown className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />

                <div className="rounded-lg border-2 border-slate-600 bg-[hsl(var(--muted))] p-3 text-center w-64">
                  <div className="font-bold">&lt; Apakah Metode == 'A'? &gt;</div>
                </div>

                <div className="flex justify-between w-full max-w-md px-6 text-[11px] font-bold">
                  <span className="text-blue-600">&larr; YA: Metode A (Stasiun N)</span>
                  <span className="text-purple-600">TIDAK: Metode B (Jarak D) &rarr;</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl mt-2">
                  {/* Jalur Metode A */}
                  <div className="flex flex-col items-center gap-2 border border-blue-500/30 rounded-lg p-3 bg-blue-50/10">
                    <Badge variant="default">Metode A</Badge>
                    <div className="rounded border border-blue-400 p-2 text-center w-full">
                      <div className="font-semibold">&lt; N &le; 5 ? &gt;</div>
                    </div>
                    <div className="flex justify-between w-full text-[10px]">
                      <span className="text-green-600">&darr; Ya: Tarif = Rp2.000</span>
                      <span className="text-amber-600">&darr; Tidak: Hitung Ekstra</span>
                    </div>
                    <div className="rounded bg-blue-100 dark:bg-blue-950 p-2 text-[10px] w-full text-center">
                      extra = ceil((N - 5) / 3)<br />
                      Tarif = 2000 + (extra &times; 500)
                    </div>
                  </div>

                  {/* Jalur Metode B */}
                  <div className="flex flex-col items-center gap-2 border border-purple-500/30 rounded-lg p-3 bg-purple-50/10">
                    <Badge variant="secondary">Metode B</Badge>
                    <div className="rounded border border-purple-400 p-2 text-center w-full">
                      <div className="font-semibold">&lt; D &le; 25 ? &gt;</div>
                    </div>
                    <div className="flex justify-between w-full text-[10px]">
                      <span className="text-green-600">&darr; Ya: Tarif = Rp3.000</span>
                      <span className="text-amber-600">&darr; Tidak: Hitung Ekstra</span>
                    </div>
                    <div className="rounded bg-purple-100 dark:bg-purple-950 p-2 text-[10px] w-full text-center">
                      extra = ceil((D - 25) / 10)<br />
                      Tarif = 3000 + (extra &times; 1000)
                    </div>
                  </div>
                </div>

                <ArrowDown className="h-5 w-5 text-[hsl(var(--muted-foreground))] mt-2" />

                {/* Blok Gabungan Diskon */}
                <div className="w-80 rounded-lg border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 p-3 text-center">
                  <div className="font-bold text-emerald-600">KOMPUTASI SUBSIDI DISKON</div>
                  <div className="text-[10px] text-[hsl(var(--muted-foreground))] mt-1">
                    diskon = round((tarif_dasar &times; %) / 100)<br />
                    tarif_akhir = tarif_dasar - diskon
                  </div>
                </div>

                <ArrowDown className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />

                <div className="rounded-full bg-slate-800 text-white px-5 py-2">
                  [KEMBALIKAN TARIF AKHIR]
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: VALIDASI & ARSITEKTUR */}
        <TabsContent value="validasi" className="space-y-6">
          {/* Card: Penanganan Validasi */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[hsl(var(--primary))]" />
                Strategi Validasi & Penanganan Kasus Ekstrem (Edge Cases)
              </CardTitle>
              <CardDescription className="text-xs">
                Mekanisme pertahanan data untuk mencegah anomali runtime dan malformed inputs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="rounded-lg border border-[hsl(var(--border))] p-3 space-y-2">
                  <div className="font-semibold text-sm text-[hsl(var(--primary))]">
                    Kasus Input Abnormal & Penanganannya
                  </div>
                  <ul className="space-y-2 text-[hsl(var(--muted-foreground))]">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5" />
                      <span><strong className="text-[hsl(var(--foreground))]">Stasiun Pecahan / Desimal:</strong> Ditolak oleh skema Zod <code className="bg-[hsl(var(--muted))] px-1 py-0.5 rounded">.int()</code> dengan pesan: "Jumlah stasiun harus berupa bilangan bulat".</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5" />
                      <span><strong className="text-[hsl(var(--foreground))]">Nilai Nol & Negatif:</strong> Ditolak oleh <code className="bg-[hsl(var(--muted))] px-1 py-0.5 rounded">.positive()</code> memastikan nilai masukan selalu &gt; 0.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5" />
                      <span><strong className="text-[hsl(var(--foreground))]">Presisi Batas 25.1 / 35.1 km:</strong> Dilindungi fungsi pembulatan aman <code className="bg-[hsl(var(--muted))] px-1 py-0.5 rounded">safeCeil</code> untuk mengeliminasi floating error IEEE-754.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5" />
                      <span><strong className="text-[hsl(var(--foreground))]">Double Submit Button:</strong> Tombol bayar otomatis disable dan menampilkan spinner selama pemrosesan transaksi.</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg border border-[hsl(var(--border))] p-3 space-y-2">
                  <div className="font-semibold text-sm text-[hsl(var(--primary))]">
                    Ketahanan Penyimpanan (Storage Resilience)
                  </div>
                  <ul className="space-y-2 text-[hsl(var(--muted-foreground))]">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5" />
                      <span><strong className="text-[hsl(var(--foreground))]">JSON Rusak (Malformed):</strong> Blok <code className="bg-[hsl(var(--muted))] px-1 py-0.5 rounded">try-catch</code> menangkap kegagalan parsing dan mengembalikan fallback array kosong aman.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5" />
                      <span><strong className="text-[hsl(var(--foreground))]">Skema Berversi:</strong> Memeriksa kunci <code className="bg-[hsl(var(--muted))] px-1 py-0.5 rounded">STORAGE_VERSION</code> guna memigrasikan struktur data jika ada pembaruan arsitektur.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5" />
                      <span><strong className="text-[hsl(var(--foreground))]">Kapasitas Penuh (Quota Exceeded):</strong> Penulisan storage dibungkus pengaman tanpa menyebabkan antarmuka aplikasi crash.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card: Arsitektur Folder */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileCode className="h-4 w-4 text-[hsl(var(--primary))]" />
                Struktur Modular Direktori Proyek
              </CardTitle>
              <CardDescription className="text-xs">
                Pemisahan tanggung jawab (Separation of Concerns) dalam arsitektur komponen frontend modern
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="rounded-lg bg-slate-900 text-slate-300 p-4 font-mono text-xs overflow-x-auto leading-relaxed">
{`src/
├── app/
│   ├── App.tsx                    # Root provider wrapper (Theme & Transaction Context)
│   └── router.tsx                 # Definisi konfigurasi routing React Router v7
├── components/
│   ├── ui/                        # Komponen atomik antarmuka (Button, Card, Input, Dialog)
│   ├── layout/                    # Layout shell utama (Sidebar, Header, AppLayout)
│   ├── charts/                    # Modul visualisasi Recharts (Revenue, Method, Category)
│   └── dashboard/                 # Widget indikator KPI Dashboard
├── context/
│   ├── TransactionContext.tsx     # State terpusat transaksi global & sinkronisasi
│   └── ThemeContext.tsx           # Manajemen preferensi Dark/Light mode
├── features/
│   ├── fare/
│   │   ├── fare.types.ts          # Definisi antarmuka TypeScript tarif & kategori
│   │   ├── fare.engine.ts         # Single Source of Truth komputasi tarif (Pure Functions)
│   │   ├── fare.schema.ts         # Skema validasi runtime Zod
│   │   └── fare.test.ts           # 49 unit test vitest verifikasi tabel tarif
│   ├── transactions/
│   │   ├── transaction.types.ts   # Model data transaksi & state machine
│   │   ├── transaction.service.ts # Abstraksi I/O localStorage & generator ID
│   │   └── transaction.test.ts    # 13 unit test vitest pengujian transaksi
│   └── reports/
│       ├── report.service.ts      # Layanan komputasi omzet, tren, & rata-rata
│       └── report.test.ts         # 9 unit test vitest kalkulasi finansial
├── lib/
│   ├── currency.ts                # Pemformatan mata uang IDR (Intl.NumberFormat)
│   ├── date.ts                    # Utilitas penanggalan zona waktu Indonesia
│   ├── storage.ts                 # Lapisan pembungkus penyimpanan HTML5 aman
│   └── utils.ts                   # Utilitas gabungan class Tailwind (clsx & twMerge)
└── pages/
    ├── DashboardPage.tsx          # Landing page metrik & grafik ringkasan
    ├── FareCalculatorPage.tsx     # Kalkulator interaktif simulasi tarif
    ├── TransactionPage.tsx        # Alur pembelian tiket 4-langkah state machine
    ├── HistoryPage.tsx            # Tabel pencarian & filter riwayat transaksi
    ├── RevenuePage.tsx            # Laporan audit pendapatan & omzet
    ├── AlgorithmPage.tsx          # Dokumentasi akademik algoritma & diagram
    ├── SettingsPage.tsx           # Parameter sistem & pengaturan penyimpanan
    └── NotFoundPage.tsx           # Halaman fallback 404`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
