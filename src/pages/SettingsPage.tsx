// src/pages/SettingsPage.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Settings,
  ShieldAlert,
  RotateCcw,
  Trash2,
  Info,
  Sun,
  Moon,
  CheckCircle,
  Database,
  Lock,
} from 'lucide-react'
import { useTransactions } from '@/context/TransactionContext'
import { useTheme } from '@/context/ThemeContext'
import { METHOD_A, METHOD_B } from '@/features/fare/fare.engine'
import { PASSENGER_CATEGORIES } from '@/features/fare/fare.types'
import { STORAGE_VERSION } from '@/lib/storage'
import { formatRupiah } from '@/lib/currency'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

export function SettingsPage() {
  const navigate = useNavigate()
  const { transactions, clearAll } = useTransactions()
  const { theme, toggleTheme, setTheme } = useTheme()

  // State dialog konfirmasi hapus data
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [isSuccessReset, setIsSuccessReset] = useState(false)

  // Reset preferensi tema
  const handleResetSettings = () => {
    setTheme('light')
    setIsSuccessReset(true)
    setTimeout(() => setIsSuccessReset(false), 3000)
  }

  // Eksekusi hapus semua data
  const handleConfirmDelete = () => {
    if (deleteConfirmationText.trim().toUpperCase() !== 'HAPUS') {
      setDeleteError('Ketik kata "HAPUS" secara tepat untuk melanjutkan.')
      return
    }

    clearAll()
    setIsDeleteDialogOpen(false)
    setDeleteConfirmationText('')
    setDeleteError('')
    navigate('/')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold">Pengaturan Simulasi</h2>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Parameter operasional sistem, preferensi tampilan, dan pemeliharaan basis data lokal
        </p>
      </div>

      {isSuccessReset && (
        <div className="flex items-center gap-2 rounded-lg bg-[hsl(var(--success))]/10 border border-[hsl(var(--success))]/30 p-3 text-sm text-[hsl(var(--success))]">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>Pengaturan preferensi antarmuka berhasil dikembalikan ke standar bawaan.</span>
        </div>
      )}

      {/* Grid Setting Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Read-Only Parameters: Method A & B */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Lock className="h-4 w-4 text-[hsl(var(--primary))]" />
                Parameter Tarif Resmi (Standar Soal)
              </CardTitle>
              <Badge variant="outline" className="text-xs">Terkunci</Badge>
            </div>
            <CardDescription className="text-xs">
              Konstanta perhitungan tarif sesuai spesifikasi akademik mata kuliah Algoritma & Pemrograman
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Method A Box */}
            <div className="rounded-lg border border-[hsl(var(--border))] p-3 space-y-2 text-xs">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-sm text-[hsl(var(--primary))]">Metode A — Berbasis Stasiun</span>
                <Badge variant="default">Metode A</Badge>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-2 text-[hsl(var(--muted-foreground))]">
                <div>Ambang Batas Dasar:</div>
                <div className="font-mono font-medium text-[hsl(var(--foreground))]">
                  1 – {METHOD_A.BASE_THRESHOLD} stasiun
                </div>
                <div>Tarif Dasar:</div>
                <div className="font-mono font-medium text-[hsl(var(--foreground))]">
                  {formatRupiah(METHOD_A.BASE_FARE)}
                </div>
                <div>Ukuran Kelompok Tambahan:</div>
                <div className="font-mono font-medium text-[hsl(var(--foreground))]">
                  Tiap {METHOD_A.EXTRA_GROUP_SIZE} stasiun
                </div>
                <div>Tarif Kelompok Tambahan:</div>
                <div className="font-mono font-medium text-[hsl(var(--foreground))]">
                  +{formatRupiah(METHOD_A.EXTRA_GROUP_FARE)}
                </div>
              </div>
            </div>

            {/* Method B Box */}
            <div className="rounded-lg border border-[hsl(var(--border))] p-3 space-y-2 text-xs">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-sm text-purple-600">Metode B — Berbasis Jarak (km)</span>
                <Badge variant="secondary">Metode B</Badge>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-2 text-[hsl(var(--muted-foreground))]">
                <div>Ambang Batas Jarak:</div>
                <div className="font-mono font-medium text-[hsl(var(--foreground))]">
                  Hingga {METHOD_B.BASE_THRESHOLD} km pertama
                </div>
                <div>Tarif Dasar:</div>
                <div className="font-mono font-medium text-[hsl(var(--foreground))]">
                  {formatRupiah(METHOD_B.BASE_FARE)}
                </div>
                <div>Kelompok Tambahan:</div>
                <div className="font-mono font-medium text-[hsl(var(--foreground))]">
                  Tiap {METHOD_B.EXTRA_GROUP_SIZE} km
                </div>
                <div>Tarif Kelompok Tambahan:</div>
                <div className="font-mono font-medium text-[hsl(var(--foreground))]">
                  +{formatRupiah(METHOD_B.EXTRA_GROUP_FARE)}
                </div>
              </div>
            </div>

            {/* Discount Table */}
            <div className="rounded-lg border border-[hsl(var(--border))] p-3 space-y-2 text-xs">
              <div className="font-semibold text-sm">Ketentuan Subsidi Diskon Penumpang</div>
              <Separator />
              <div className="grid grid-cols-2 gap-y-1.5 text-[hsl(var(--muted-foreground))]">
                {PASSENGER_CATEGORIES.map((cat) => (
                  <div key={cat.id} className="contents">
                    <div>Kategori {cat.label}:</div>
                    <div className="font-mono font-semibold text-[hsl(var(--foreground))]">
                      {cat.discountPercent}% Potongan
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-3 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                Demi menjaga keabsahan pengujian tugas dosen, parameter formula dan tarif di atas dibuat permanen dan tidak dapat diubah-ubah secara bebas.
              </span>
            </div>
          </CardContent>
        </Card>

        {/* System Settings & Storage Management */}
        <div className="space-y-6">
          {/* Appearance Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Settings className="h-4 w-4 text-[hsl(var(--primary))]" />
                Preferensi Antarmuka
              </CardTitle>
              <CardDescription className="text-xs">
                Kustomisasi kenyamanan visual aplikasi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-[hsl(var(--border))] p-3">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Tema Gelap / Terang</div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))]">
                    Mode saat ini: {theme === 'dark' ? 'Gelap (Dark Mode)' : 'Terang (Light Mode)'}
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={toggleTheme}>
                  {theme === 'dark' ? (
                    <>
                      <Sun className="h-4 w-4 mr-1 text-amber-500" />
                      Mode Terang
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4 mr-1 text-blue-500" />
                      Mode Gelap
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-[hsl(var(--border))] p-3">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Kembalikan Pengaturan Tampilan</div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))]">
                    Mereset tema ke konfigurasi standar
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleResetSettings}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Database & Storage Maintenance */}
          <Card className="border-[hsl(var(--destructive))]/40">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-[hsl(var(--destructive))]">
                <Database className="h-4 w-4" />
                Manajemen Basis Data Lokal
              </CardTitle>
              <CardDescription className="text-xs">
                Informasi kapasitas dan pembersihan riwayat transaksi browser
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-[hsl(var(--muted))]/40 p-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[hsl(var(--muted-foreground))]">Penyimpanan Utama:</span>
                  <span className="font-semibold">HTML5 localStorage (Klien Statis)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[hsl(var(--muted-foreground))]">Versi Skema Storage:</span>
                  <Badge variant="outline" className="text-[10px]">v{STORAGE_VERSION}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-[hsl(var(--muted-foreground))]">Total Transaksi Tersimpan:</span>
                  <span className="font-mono font-bold text-sm">{transactions.length} record</span>
                </div>
              </div>

              <div className="rounded-lg border border-[hsl(var(--destructive))]/30 bg-[hsl(var(--destructive))]/5 p-3 space-y-3">
                <div className="flex items-start gap-2">
                  <ShieldAlert className="h-4 w-4 text-[hsl(var(--destructive))] shrink-0 mt-0.5" />
                  <div className="text-xs text-[hsl(var(--destructive))]">
                    <span className="font-semibold block">Zona Tindakan Berisiko</span>
                    Menghapus data simulasi akan melenyapkan seluruh log transaksi, laporan statistik omzet, serta riwayat tiket secara permanen dari browser ini.
                  </div>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  disabled={transactions.length === 0}
                >
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  Hapus Seluruh Data Transaksi
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog Konfirmasi Hapus Data */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[hsl(var(--destructive))]">
              <ShieldAlert className="h-5 w-5" />
              Konfirmasi Penghapusan Permanen
            </DialogTitle>
            <DialogDescription className="text-xs">
              Tindakan ini tidak dapat dibatalkan. Seluruh {transactions.length} riwayat transaksi akan dihapus dari localStorage.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="rounded-lg bg-[hsl(var(--destructive))]/10 p-3 text-xs text-[hsl(var(--destructive))]">
              Untuk melanjutkan konfirmasi, ketik kata <span className="font-mono font-bold">HAPUS</span> pada kolom isian di bawah ini:
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm-delete" className="text-xs">Ketik konfirmasi:</Label>
              <Input
                id="confirm-delete"
                placeholder="HAPUS"
                value={deleteConfirmationText}
                onChange={(e) => {
                  setDeleteConfirmationText(e.target.value)
                  setDeleteError('')
                }}
                className="font-mono uppercase"
              />
              {deleteError && (
                <p className="text-xs text-[hsl(var(--destructive))]">{deleteError}</p>
              )}
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsDeleteDialogOpen(false)
                  setDeleteConfirmationText('')
                  setDeleteError('')
                }}
              >
                Batalkan
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleConfirmDelete}
                disabled={deleteConfirmationText.trim().toUpperCase() !== 'HAPUS'}
              >
                Hapus Sekarang
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
