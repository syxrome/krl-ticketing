// src/pages/DashboardPage.tsx
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Receipt,
  TrendingUp,
  Tag,
  BarChart3,
  Train,
  CreditCard,
  Clock,
} from 'lucide-react'
import { useTransactions } from '@/context/TransactionContext'
import { computeReport } from '@/features/reports/report.service'
import { formatRupiah } from '@/lib/currency'
import { formatDateIndonesia } from '@/lib/date'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { RevenueChart } from '@/components/charts/RevenueChart'
import { MethodChart } from '@/components/charts/MethodChart'
import { CategoryChart } from '@/components/charts/CategoryChart'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const CATEGORY_LABELS: Record<string, string> = {
  umum: 'Umum',
  pelajar: 'Pelajar',
  lansia: 'Lansia',
  anak: 'Anak-anak',
}

export function DashboardPage() {
  const { transactions, isLoading } = useTransactions()
  const report = useMemo(() => computeReport(transactions), [transactions])

  const recentTransactions = useMemo(
    () => transactions.slice(0, 5),
    [transactions]
  )

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[hsl(var(--primary))] border-t-transparent" />
          <p className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">Memuat data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Ringkasan data simulasi KRL Fare Management System
          </p>
        </div>
        <Button asChild>
          <Link to="/transaksi">
            <CreditCard className="h-4 w-4" />
            Mulai Transaksi
          </Link>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Total Transaksi"
          value={report.totalTransactions.toString()}
          subtitle="Transaksi berhasil"
          icon={Receipt}
          iconColor="text-[hsl(var(--primary))]"
          iconBg="bg-[hsl(var(--primary))]/10"
        />
        <KpiCard
          title="Total Pendapatan"
          value={formatRupiah(report.totalRevenue)}
          subtitle="Dari tarif akhir"
          icon={TrendingUp}
          iconColor="text-[hsl(var(--success))]"
          iconBg="bg-[hsl(var(--success))]/10"
        />
        <KpiCard
          title="Total Diskon"
          value={formatRupiah(report.totalDiscount)}
          subtitle="Diskon diberikan"
          icon={Tag}
          iconColor="text-amber-500"
          iconBg="bg-amber-500/10"
        />
        <KpiCard
          title="Rata-rata Tarif"
          value={formatRupiah(report.averageRevenue)}
          subtitle="Per transaksi"
          icon={BarChart3}
          iconColor="text-purple-500"
          iconBg="bg-purple-500/10"
        />
      </div>

      {/* Empty state */}
      {transactions.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--muted))]">
              <Train className="h-8 w-8 text-[hsl(var(--muted-foreground))]" />
            </div>
            <h3 className="text-lg font-semibold">Belum Ada Data Transaksi</h3>
            <p className="mt-2 max-w-sm text-sm text-[hsl(var(--muted-foreground))]">
              Mulai simulasi transaksi tiket KRL untuk melihat statistik dan laporan pendapatan di sini.
            </p>
            <div className="mt-6 flex gap-3">
              <Button asChild>
                <Link to="/transaksi">
                  <CreditCard className="h-4 w-4" />
                  Buat Transaksi Pertama
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/kalkulator">Coba Kalkulator</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      {transactions.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Revenue Chart — spans 2 cols */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Pendapatan Harian</CardTitle>
                <CardDescription>Total pendapatan per hari (dari tarif akhir)</CardDescription>
              </CardHeader>
              <CardContent>
                <RevenueChart data={report.revenueByDate} />
              </CardContent>
            </Card>

            {/* Category Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Distribusi Penumpang</CardTitle>
                <CardDescription>Berdasarkan kategori penumpang</CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryChart data={report.categoryDistribution} />
              </CardContent>
            </Card>
          </div>

          {/* Method Chart + Recent */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Perbandingan Metode Tarif</CardTitle>
                <CardDescription>Metode A (stasiun) vs Metode B (km)</CardDescription>
              </CardHeader>
              <CardContent>
                <MethodChart
                  methodACount={report.methodACount}
                  methodBCount={report.methodBCount}
                />
                <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                  <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950/30">
                    <p className="text-2xl font-bold text-blue-600">{report.methodACount}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">Metode A</p>
                  </div>
                  <div className="rounded-lg bg-purple-50 p-3 dark:bg-purple-950/30">
                    <p className="text-2xl font-bold text-purple-600">{report.methodBCount}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">Metode B</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Transaksi Terakhir</CardTitle>
                  <CardDescription>5 transaksi terbaru</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/riwayat">Lihat Semua</Link>
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[hsl(var(--border))]">
                        <th className="px-4 py-3 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">Waktu</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">Metode</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">Kategori</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[hsl(var(--border))]">
                      {recentTransactions.map((t) => (
                        <tr key={t.id} className="hover:bg-[hsl(var(--muted))]/50 transition-colors">
                          <td className="px-4 py-3 font-mono text-xs">{t.id}</td>
                          <td className="px-4 py-3 text-xs text-[hsl(var(--muted-foreground))]">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDateIndonesia(t.createdAt)}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={t.method === 'A' ? 'default' : 'secondary'}>
                              Metode {t.method}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {CATEGORY_LABELS[t.passengerCategory] ?? t.passengerCategory}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-sm">
                            {formatRupiah(t.finalFare)}
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
