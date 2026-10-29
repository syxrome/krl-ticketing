// src/pages/HistoryPage.tsx
import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Filter,
  Eye,
  CreditCard,
  Train,
  ArrowUpDown,
  Calendar,
  X,
  FileText,
} from 'lucide-react'
import { useTransactions } from '@/context/TransactionContext'
import type { Transaction } from '@/features/transactions/transaction.types'
import { formatRupiah } from '@/lib/currency'
import { formatDateIndonesia } from '@/lib/date'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

const CATEGORY_LABELS: Record<string, string> = {
  umum: 'Umum',
  pelajar: 'Pelajar',
  lansia: 'Lansia',
  anak: 'Anak-anak',
}

export function HistoryPage() {
  const { transactions } = useTransactions()

  // State filter & search
  const [searchId, setSearchId] = useState('')
  const [methodFilter, setMethodFilter] = useState<'ALL' | 'A' | 'B'>('ALL')
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'fare_desc' | 'fare_asc'>('date_desc')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Modal detail
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)

  // Filter & Sort Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // Search by ID
      if (searchId.trim()) {
        const query = searchId.trim().toUpperCase()
        if (!t.id.toUpperCase().includes(query)) return false
      }

      // Filter by Method
      if (methodFilter !== 'ALL' && t.method !== methodFilter) {
        return false
      }

      // Filter by Category
      if (categoryFilter !== 'ALL' && t.passengerCategory !== categoryFilter) {
        return false
      }

      // Filter by Date Range
      if (startDate) {
        const txDate = t.createdAt.split('T')[0]
        if (txDate < startDate) return false
      }
      if (endDate) {
        const txDate = t.createdAt.split('T')[0]
        if (txDate > endDate) return false
      }

      return true
    }).sort((a, b) => {
      if (sortBy === 'date_desc') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      if (sortBy === 'date_asc') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      if (sortBy === 'fare_desc') {
        return b.finalFare - a.finalFare
      }
      if (sortBy === 'fare_asc') {
        return a.finalFare - b.finalFare
      }
      return 0
    })
  }, [transactions, searchId, methodFilter, categoryFilter, startDate, endDate, sortBy])

  // Pagination slice
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredTransactions.slice(start, start + itemsPerPage)
  }, [filteredTransactions, currentPage, itemsPerPage])

  const handleResetFilter = () => {
    setSearchId('')
    setMethodFilter('ALL')
    setCategoryFilter('ALL')
    setStartDate('')
    setEndDate('')
    setSortBy('date_desc')
    setCurrentPage(1)
  }

  const hasActiveFilter = searchId || methodFilter !== 'ALL' || categoryFilter !== 'ALL' || startDate || endDate || sortBy !== 'date_desc'

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Riwayat Transaksi</h2>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Daftar seluruh transaksi tiket yang telah berhasil diverifikasi dan dibayar
          </p>
        </div>
        <Button asChild>
          <Link to="/transaksi">
            <CreditCard className="h-4 w-4 mr-2" />
            Transaksi Baru
          </Link>
        </Button>
      </div>

      {/* Filter Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="h-4 w-4 text-[hsl(var(--primary))]" />
              Pencarian & Penyaringan
            </CardTitle>
            {hasActiveFilter && (
              <Button variant="ghost" size="sm" onClick={handleResetFilter} className="h-8 text-xs">
                <X className="h-3.5 w-3.5 mr-1" />
                Reset Filter
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {/* Search ID */}
            <div className="space-y-1.5 xl:col-span-2">
              <Label htmlFor="search-id" className="text-xs">Cari ID Transaksi</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                <Input
                  id="search-id"
                  placeholder="KRL-2026..."
                  className="pl-8"
                  value={searchId}
                  onChange={(e) => {
                    setSearchId(e.target.value)
                    setCurrentPage(1)
                  }}
                />
              </div>
            </div>

            {/* Filter Metode */}
            <div className="space-y-1.5">
              <Label className="text-xs">Metode</Label>
              <Select
                value={methodFilter}
                onValueChange={(v: 'ALL' | 'A' | 'B') => {
                  setMethodFilter(v)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Semua Metode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Metode</SelectItem>
                  <SelectItem value="A">Metode A (Stasiun)</SelectItem>
                  <SelectItem value="B">Metode B (Kilometer)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter Kategori */}
            <div className="space-y-1.5">
              <Label className="text-xs">Kategori Penumpang</Label>
              <Select
                value={categoryFilter}
                onValueChange={(v) => {
                  setCategoryFilter(v)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Kategori</SelectItem>
                  <SelectItem value="umum">Umum (0%)</SelectItem>
                  <SelectItem value="pelajar">Pelajar (10%)</SelectItem>
                  <SelectItem value="lansia">Lansia (20%)</SelectItem>
                  <SelectItem value="anak">Anak-anak (50%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Rentang Tanggal Mulai */}
            <div className="space-y-1.5">
              <Label htmlFor="start-date" className="text-xs flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Tanggal Dari
              </Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>

            {/* Rentang Tanggal Selesai */}
            <div className="space-y-1.5">
              <Label htmlFor="end-date" className="text-xs flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Tanggal Sampai
              </Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[hsl(var(--border))] pt-3 text-xs text-[hsl(var(--muted-foreground))]">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span>Urutkan:</span>
              <div className="flex gap-1">
                <Button
                  variant={sortBy === 'date_desc' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="h-7 text-xs px-2"
                  onClick={() => setSortBy('date_desc')}
                >
                  Terbaru
                </Button>
                <Button
                  variant={sortBy === 'date_asc' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="h-7 text-xs px-2"
                  onClick={() => setSortBy('date_asc')}
                >
                  Terlama
                </Button>
                <Button
                  variant={sortBy === 'fare_desc' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="h-7 text-xs px-2"
                  onClick={() => setSortBy('fare_desc')}
                >
                  Tarif Tertinggi
                </Button>
                <Button
                  variant={sortBy === 'fare_asc' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="h-7 text-xs px-2"
                  onClick={() => setSortBy('fare_asc')}
                >
                  Tarif Terendah
                </Button>
              </div>
            </div>
            <div>
              Menampilkan {filteredTransactions.length} transaksi
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Table Card */}
      <Card>
        <CardContent className="p-0">
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(var(--muted))]">
                <Train className="h-7 w-7 text-[hsl(var(--muted-foreground))]" />
              </div>
              <h3 className="text-base font-semibold">Belum Ada Riwayat Transaksi</h3>
              <p className="mt-1 max-w-sm text-xs text-[hsl(var(--muted-foreground))]">
                Setiap transaksi sukses yang dibuat melalui form transaksi akan tercatat otomatis di sini.
              </p>
              <Button asChild className="mt-4" size="sm">
                <Link to="/transaksi">Mulai Transaksi Baru</Link>
              </Button>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-8 w-8 text-[hsl(var(--muted-foreground))] mb-2 opacity-50" />
              <p className="text-sm font-medium">Tidak ada transaksi yang cocok</p>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                Coba sesuaikan kata kunci atau bersihkan filter pencarian Anda.
              </p>
              <Button variant="outline" size="sm" onClick={handleResetFilter} className="mt-3">
                Reset Semua Filter
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[hsl(var(--muted))]/50 border-b border-[hsl(var(--border))] text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">ID Transaksi</th>
                      <th className="px-4 py-3 font-semibold">Waktu Transaksi</th>
                      <th className="px-4 py-3 font-semibold">Metode</th>
                      <th className="px-4 py-3 font-semibold">Perjalanan</th>
                      <th className="px-4 py-3 font-semibold">Kategori</th>
                      <th className="px-4 py-3 font-semibold text-right">Tarif Dasar</th>
                      <th className="px-4 py-3 font-semibold text-right">Diskon</th>
                      <th className="px-4 py-3 font-semibold text-right">Total Akhir</th>
                      <th className="px-4 py-3 font-semibold text-center">Status</th>
                      <th className="px-4 py-3 font-semibold text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[hsl(var(--border))]">
                    {paginatedTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-[hsl(var(--muted))]/30 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-[hsl(var(--primary))]">
                          {tx.id}
                        </td>
                        <td className="px-4 py-3 text-xs text-[hsl(var(--muted-foreground))] whitespace-nowrap">
                          {formatDateIndonesia(tx.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={tx.method === 'A' ? 'default' : 'secondary'} className="text-xs">
                            Metode {tx.method}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 font-medium whitespace-nowrap">
                          {tx.journeyValue} {tx.journeyUnit === 'station' ? 'stasiun' : 'km'}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-block rounded px-2 py-0.5 text-xs bg-[hsl(var(--muted))]">
                            {CATEGORY_LABELS[tx.passengerCategory] ?? tx.passengerCategory}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-xs text-[hsl(var(--muted-foreground))]">
                          {formatRupiah(tx.baseFare)}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-xs text-[hsl(var(--destructive))]">
                          {tx.discountAmount > 0 ? `-${formatRupiah(tx.discountAmount)}` : 'Rp0'}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-xs font-bold text-[hsl(var(--foreground))]">
                          {formatRupiah(tx.finalFare)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant="success" className="text-[10px]">
                            {tx.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setSelectedTx(tx)}
                            title="Lihat Detail Transaksi"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-[hsl(var(--border))] px-4 py-3">
                  <div className="text-xs text-[hsl(var(--muted-foreground))]">
                    Halaman {currentPage} dari {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="h-8 text-xs"
                    >
                      Sebelumnya
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="h-8 text-xs"
                    >
                      Berikutnya
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal Detail Transaksi */}
      <Dialog open={!!selectedTx} onOpenChange={(open) => !open && setSelectedTx(null)}>
        {selectedTx && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base">
                <FileText className="h-5 w-5 text-[hsl(var(--primary))]" />
                Rincian Bukti Transaksi
              </DialogTitle>
              <DialogDescription className="text-xs">
                Detail lengkap komputasi tarif dan data pembayaran
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <div className="rounded-lg bg-[hsl(var(--muted))]/50 p-3 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[hsl(var(--muted-foreground))]">Nomor Transaksi:</span>
                  <span className="font-mono font-bold">{selectedTx.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[hsl(var(--muted-foreground))]">Waktu Eksekusi:</span>
                  <span>{formatDateIndonesia(selectedTx.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[hsl(var(--muted-foreground))]">Status:</span>
                  <Badge variant="success" className="text-[10px]">{selectedTx.status}</Badge>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider text-[10px]">
                  Parameter Perjalanan
                </div>
                <div className="rounded border border-[hsl(var(--border))] p-3 space-y-1.5">
                  <div className="flex justify-between">
                    <span>Metode Perhitungan:</span>
                    <span className="font-medium">
                      Metode {selectedTx.method} ({selectedTx.method === 'A' ? 'Stasiun' : 'Kilometer'})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Jarak / Jumlah Stasiun:</span>
                    <span className="font-medium">
                      {selectedTx.journeyValue} {selectedTx.journeyUnit === 'station' ? 'stasiun' : 'km'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kelompok Tambahan:</span>
                    <span className="font-medium">{selectedTx.extraGroups} kelompok</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kategori Penumpang:</span>
                    <span className="font-medium">
                      {CATEGORY_LABELS[selectedTx.passengerCategory]} (Diskon {selectedTx.discountPercentage}%)
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider text-[10px]">
                  Rincian Keuangan
                </div>
                <div className="rounded border border-[hsl(var(--border))] p-3 space-y-1.5 font-mono">
                  <div className="flex justify-between text-[hsl(var(--muted-foreground))]">
                    <span>Tarif Dasar:</span>
                    <span>{formatRupiah(selectedTx.baseFare)}</span>
                  </div>
                  {selectedTx.extraFare > 0 && (
                    <div className="flex justify-between text-[hsl(var(--muted-foreground))]">
                      <span>Tarif Kelompok Tambahan:</span>
                      <span>+{formatRupiah(selectedTx.extraFare)}</span>
                    </div>
                  )}
                  {selectedTx.discountAmount > 0 && (
                    <div className="flex justify-between text-[hsl(var(--destructive))]">
                      <span>Diskon ({selectedTx.discountPercentage}%):</span>
                      <span>-{formatRupiah(selectedTx.discountAmount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-sm text-[hsl(var(--foreground))]">
                    <span>Tarif Akhir:</span>
                    <span>{formatRupiah(selectedTx.finalFare)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-[hsl(var(--muted-foreground))]">
                    <span>Uang Diterima:</span>
                    <span>{formatRupiah(selectedTx.paymentAmount)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-[hsl(var(--success))]">
                    <span>Kembalian:</span>
                    <span>{formatRupiah(selectedTx.changeAmount)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button variant="outline" size="sm" onClick={() => setSelectedTx(null)}>
                  Tutup Rincian
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
