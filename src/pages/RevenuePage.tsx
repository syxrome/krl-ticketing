// src/pages/RevenuePage.tsx
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp,
  Receipt,
  Tag,
  BarChart3,
  Calendar,
  Train,
  CreditCard,
  PieChart as PieIcon,
  Layers,
} from 'lucide-react'
import { useTransactions } from '@/context/TransactionContext'
import { computeReport } from '@/features/reports/report.service'
import { formatRupiah } from '@/lib/currency'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { RevenueChart } from '@/components/charts/RevenueChart'
import { MethodChart } from '@/components/charts/MethodChart'
import { CategoryChart } from '@/components/charts/CategoryChart'

export function RevenuePage() {
  const { transactions, isLoading } = useTransactions()
  const report = useMemo(() => computeReport(transactions), [transactions])

  // Method specific revenue calculations
  const methodStats = useMemo(() => {
    const methodATx = transactions.filter((t) => t.method === 'A')
    const methodBTx = transactions.filter((t) => t.method === 'B')

    const revA = methodATx.reduce((sum, t) => sum + t.finalFare, 0)
    const revB = methodBTx.reduce((sum, t) => sum + t.finalFare, 0)

    return {
      countA: methodATx.length,
      revenueA: revA,
      avgA: methodATx.length > 0 ? Math.round(revA / methodATx.length) : 0,
      countB: methodBTx.length,
      revenueB: revB,
      avgB: methodBTx.length > 0 ? Math.round(revB / methodBTx.length) : 0,
    }
  }, [transactions])

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[hsl(var(--primary))] border-t-transparent" />
          <p className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">Memuat data laporan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Laporan Pendapatan</h2>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Analisis komprehensif penerimaan tarif, subsidi diskon, dan kinerja volume penumpang
          </p>
        </div>
        <Button asChild>
          <Link to="/transaksi">
            <CreditCard className="h-4 w-4 mr-2" />
            Transaksi Baru
          </Link>
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Total Transaksi"
          value={report.totalTransactions.toString()}
          subtitle="Tiket berhasil diproses"
          icon={Receipt}
          iconColor="text-[hsl(var(--primary))]"
          iconBg="bg-[hsl(var(--primary))]/10"
        />
        <KpiCard
          title="Total Pendapatan Bersih"
          value={formatRupiah(report.totalRevenue)}
          subtitle="Berdasarkan tarif akhir tiket"
          icon={TrendingUp}
          iconColor="text-[hsl(var(--success))]"
          iconBg="bg-[hsl(var(--success))]/10"
        />
        <KpiCard
          title="Total Subsidi Diskon"
          value={formatRupiah(report.totalDiscount)}
          subtitle="Akumulasi potongan tarif"
          icon={Tag}
          iconColor="text-amber-500"
          iconBg="bg-amber-500/10"
        />
        <KpiCard
          title="Rata-rata Pendapatan"
          value={formatRupiah(report.averageRevenue)}
          subtitle="Per transaksi tercatat"
          icon={BarChart3}
          iconColor="text-purple-500"
          iconBg="bg-purple-500/10"
        />
      </div>

      {transactions.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(var(--muted))]">
              <Train className="h-7 w-7 text-[hsl(var(--muted-foreground))]" />
            </div>
            <h3 className="text-base font-semibold">Belum Ada Data Keuangan</h3>
            <p className="mt-1 max-w-sm text-xs text-[hsl(var(--muted-foreground))]">
              Laporan pendapatan akan teragregasi secara otomatis setelah transaksi tiket diselesaikan.
            </p>
            <Button asChild className="mt-4" size="sm">
              <Link to="/transaksi">Simulasikan Transaksi Sekarang</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Method Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-l-4 border-l-blue-600">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Kinerja Metode A (Stasiun)</CardTitle>
                  <Badge variant="default">Metode A</Badge>
                </div>
                <CardDescription className="text-xs">
                  Tarif bertingkat berbasis kuota stasiun (Rp2.000 + Rp500/3 stasiun)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  <div className="rounded-lg bg-[hsl(var(--muted))]/50 p-3">
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">Frekuensi</p>
                    <p className="text-xl font-bold mt-1 text-blue-600">{methodStats.countA}</p>
                    <p className="text-[10px] text-[hsl(var(--muted-foreground))]">
                      {report.totalTransactions > 0
                        ? `${Math.round((methodStats.countA / report.totalTransactions) * 100)}% total`
                        : '0%'}
                    </p>
                  </div>
                  <div className="rounded-lg bg-[hsl(var(--muted))]/50 p-3">
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">Pendapatan</p>
                    <p className="text-sm font-bold mt-2">{formatRupiah(methodStats.revenueA)}</p>
                  </div>
                  <div className="rounded-lg bg-[hsl(var(--muted))]/50 p-3">
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">Rata-rata/Tiket</p>
                    <p className="text-sm font-bold mt-2">{formatRupiah(methodStats.avgA)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-600">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Kinerja Metode B (Kilometer)</CardTitle>
                  <Badge variant="secondary">Metode B</Badge>
                </div>
                <CardDescription className="text-xs">
                  Tarif bertingkat berbasis jarak tempuh (Rp3.000 + Rp1.000/10 km)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  <div className="rounded-lg bg-[hsl(var(--muted))]/50 p-3">
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">Frekuensi</p>
                    <p className="text-xl font-bold mt-1 text-purple-600">{methodStats.countB}</p>
                    <p className="text-[10px] text-[hsl(var(--muted-foreground))]">
                      {report.totalTransactions > 0
                        ? `${Math.round((methodStats.countB / report.totalTransactions) * 100)}% total`
                        : '0%'}
                    </p>
                  </div>
                  <div className="rounded-lg bg-[hsl(var(--muted))]/50 p-3">
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">Pendapatan</p>
                    <p className="text-sm font-bold mt-2">{formatRupiah(methodStats.revenueB)}</p>
                  </div>
                  <div className="rounded-lg bg-[hsl(var(--muted))]/50 p-3">
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">Rata-rata/Tiket</p>
                    <p className="text-sm font-bold mt-2">{formatRupiah(methodStats.avgB)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[hsl(var(--primary))]" />
                  Tren Pendapatan Menurut Tanggal
                </CardTitle>
                <CardDescription className="text-xs">
                  Fluktuasi akumulasi tarif akhir harian
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RevenueChart data={report.revenueByDate} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <PieIcon className="h-4 w-4 text-[hsl(var(--primary))]" />
                  Proporsi Kategori Penumpang
                </CardTitle>
                <CardDescription className="text-xs">
                  Persentase kontribusi volume per profil penumpang
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryChart data={report.categoryDistribution} />
              </CardContent>
            </Card>
          </div>

          {/* Method Volume Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[hsl(var(--primary))]" />
                Volume Transaksi Berdasarkan Metode
              </CardTitle>
              <CardDescription className="text-xs">
                Perbandingan kuantitas penggunaan Metode A vs Metode B
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MethodChart
                methodACount={report.methodACount}
                methodBCount={report.methodBCount}
              />
            </CardContent>
          </Card>

          {/* Tables Row: Category Distribution & Daily Revenue */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Breakdown Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Layers className="h-4 w-4 text-[hsl(var(--primary))]" />
                  Ringkasan Kategori Penumpang
                </CardTitle>
                <CardDescription className="text-xs">
                  Rincian transaksi, total pendapatan, dan rata-rata per kategori
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[hsl(var(--muted))]/50 border-b border-[hsl(var(--border))] text-xs uppercase text-[hsl(var(--muted-foreground))]">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Kategori</th>
                        <th className="px-4 py-3 font-semibold text-center">Jumlah Tiket</th>
                        <th className="px-4 py-3 font-semibold text-right">Pendapatan</th>
                        <th className="px-4 py-3 font-semibold text-center">Porsi (%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[hsl(var(--border))]">
                      {report.categoryDistribution.map((item) => (
                        <tr key={item.category} className="hover:bg-[hsl(var(--muted))]/20">
                          <td className="px-4 py-3 font-medium">{item.label}</td>
                          <td className="px-4 py-3 text-center">{item.count}</td>
                          <td className="px-4 py-3 text-right font-mono font-semibold">
                            {formatRupiah(item.revenue)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-block px-2 py-0.5 rounded text-xs bg-[hsl(var(--muted))]">
                              {item.percentage}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Daily Revenue Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[hsl(var(--primary))]" />
                  Rekapitulasi Harian
                </CardTitle>
                <CardDescription className="text-xs">
                  Daftar akumulasi omzet harian sistem
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[hsl(var(--muted))]/50 border-b border-[hsl(var(--border))] text-xs uppercase text-[hsl(var(--muted-foreground))]">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Tanggal</th>
                        <th className="px-4 py-3 font-semibold text-center">Transaksi</th>
                        <th className="px-4 py-3 font-semibold text-right">Omzet Harian</th>
                        <th className="px-4 py-3 font-semibold text-right">Rata-rata/Tiket</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[hsl(var(--border))]">
                      {report.revenueByDate.map((day) => (
                        <tr key={day.date} className="hover:bg-[hsl(var(--muted))]/20">
                          <td className="px-4 py-3 font-medium text-xs">
                            {day.dateLabel} ({day.date})
                          </td>
                          <td className="px-4 py-3 text-center text-xs">{day.count}</td>
                          <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-[hsl(var(--success))]">
                            {formatRupiah(day.revenue)}
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-xs text-[hsl(var(--muted-foreground))]">
                            {formatRupiah(day.count > 0 ? Math.round(day.revenue / day.count) : 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
