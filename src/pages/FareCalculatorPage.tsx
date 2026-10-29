// src/pages/FareCalculatorPage.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Calculator, RefreshCw, ArrowRight, Info } from 'lucide-react'
import { calculateFareWithBreakdown } from '@/features/fare/fare.engine'
import { PASSENGER_CATEGORIES } from '@/features/fare/fare.types'
import type { FareBreakdown, PassengerCategory } from '@/features/fare/fare.types'
import { formatRupiah } from '@/lib/currency'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

// Zod schemas with string types (no transform) so React Hook Form types match perfectly
const calcSchemaA = z.object({
  stations: z
    .string()
    .min(1, 'Jumlah stasiun wajib diisi')
    .refine((v) => !isNaN(Number(v)), 'Harus berupa angka')
    .refine((v) => Number.isInteger(Number(v)), 'Harus bilangan bulat')
    .refine((v) => Number(v) > 0, 'Harus lebih dari 0')
    .refine((v) => Number(v) <= 1000, 'Jumlah stasiun maksimal 1000'),
  passengerCategory: z.union([
    z.literal('umum'),
    z.literal('pelajar'),
    z.literal('lansia'),
    z.literal('anak'),
  ]),
})

const calcSchemaB = z.object({
  distance: z
    .string()
    .min(1, 'Jarak wajib diisi')
    .refine((v) => !isNaN(Number(v)), 'Harus berupa angka')
    .refine((v) => Number(v) > 0, 'Harus lebih dari 0')
    .refine((v) => Number(v) <= 10000, 'Jarak maksimal 10.000 km'),
  passengerCategory: z.union([
    z.literal('umum'),
    z.literal('pelajar'),
    z.literal('lansia'),
    z.literal('anak'),
  ]),
})

type FormAValues = z.infer<typeof calcSchemaA>
type FormBValues = z.infer<typeof calcSchemaB>

export function FareCalculatorPage() {
  const navigate = useNavigate()
  const [result, setResult] = useState<FareBreakdown | null>(null)
  const [activeMethod, setActiveMethod] = useState<'A' | 'B'>('A')

  const formA = useForm<FormAValues>({
    resolver: zodResolver(calcSchemaA),
    defaultValues: { stations: '', passengerCategory: 'umum' },
  })

  const formB = useForm<FormBValues>({
    resolver: zodResolver(calcSchemaB),
    defaultValues: { distance: '', passengerCategory: 'umum' },
  })

  function handleMethodChange(method: 'A' | 'B') {
    setActiveMethod(method)
    setResult(null)
  }

  function onSubmitA(data: FormAValues) {
    const stations = Number(data.stations)
    const category = data.passengerCategory as PassengerCategory
    const breakdown = calculateFareWithBreakdown('A', stations, category)
    setResult(breakdown)
  }

  function onSubmitB(data: FormBValues) {
    const km = Number(data.distance)
    const category = data.passengerCategory as PassengerCategory
    const breakdown = calculateFareWithBreakdown('B', km, category)
    setResult(breakdown)
  }

  function handleReset() {
    setResult(null)
    if (activeMethod === 'A') {
      formA.reset({ stations: '', passengerCategory: 'umum' })
    } else {
      formB.reset({ distance: '', passengerCategory: 'umum' })
    }
  }

  function handleLanjut() {
    if (!result) return
    navigate('/transaksi', { state: { prefill: result } })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Kalkulator Tarif</h2>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Hitung estimasi tarif KRL berdasarkan metode yang dipilih
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calculator className="h-5 w-5 text-[hsl(var(--primary))]" />
              Form Perhitungan
            </CardTitle>
            <CardDescription>Pilih metode dan masukkan data perjalanan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Method Selector */}
            <div className="space-y-2">
              <Label>Metode Tarif</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleMethodChange('A')}
                  className={`rounded-lg border-2 p-4 text-left transition-colors ${
                    activeMethod === 'A'
                      ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/5'
                      : 'border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]/50'
                  }`}
                >
                  <div className="font-bold text-lg text-[hsl(var(--primary))]">A</div>
                  <div className="text-sm font-medium">Jumlah Stasiun</div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                    Mulai Rp2.000
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleMethodChange('B')}
                  className={`rounded-lg border-2 p-4 text-left transition-colors ${
                    activeMethod === 'B'
                      ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/5'
                      : 'border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]/50'
                  }`}
                >
                  <div className="font-bold text-lg text-[hsl(var(--primary))]">B</div>
                  <div className="text-sm font-medium">Jarak Kilometer</div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                    Mulai Rp3.000
                  </div>
                </button>
              </div>
            </div>

            {/* Metode A Form */}
            {activeMethod === 'A' && (
              <form onSubmit={formA.handleSubmit(onSubmitA)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stations">Jumlah Stasiun</Label>
                  <Input
                    id="stations"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Contoh: 10"
                    {...formA.register('stations')}
                  />
                  {formA.formState.errors.stations && (
                    <p className="text-xs text-[hsl(var(--destructive))]">
                      {formA.formState.errors.stations.message}
                    </p>
                  )}
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    Masukkan bilangan bulat positif (1–1000)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoryA">Kategori Penumpang</Label>
                  <Select
                    value={formA.watch('passengerCategory')}
                    onValueChange={(v: PassengerCategory) =>
                      formA.setValue('passengerCategory', v)
                    }
                  >
                    <SelectTrigger id="categoryA">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {PASSENGER_CATEGORIES.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.label} {c.discountPercent > 0 ? `(Diskon ${c.discountPercent}%)` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formA.formState.errors.passengerCategory && (
                    <p className="text-xs text-[hsl(var(--destructive))]">
                      {formA.formState.errors.passengerCategory.message}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="submit" className="flex-1">
                    <Calculator className="h-4 w-4" />
                    Hitung Tarif
                  </Button>
                  <Button type="button" variant="outline" onClick={handleReset}>
                    <RefreshCw className="h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </form>
            )}

            {/* Metode B Form */}
            {activeMethod === 'B' && (
              <form onSubmit={formB.handleSubmit(onSubmitB)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="distance">Jarak (km)</Label>
                  <Input
                    id="distance"
                    type="number"
                    min="0.1"
                    step="0.1"
                    placeholder="Contoh: 35.5"
                    {...formB.register('distance')}
                  />
                  {formB.formState.errors.distance && (
                    <p className="text-xs text-[hsl(var(--destructive))]">
                      {formB.formState.errors.distance.message}
                    </p>
                  )}
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    Masukkan jarak dalam kilometer (desimal diperbolehkan)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoryB">Kategori Penumpang</Label>
                  <Select
                    value={formB.watch('passengerCategory')}
                    onValueChange={(v: PassengerCategory) =>
                      formB.setValue('passengerCategory', v)
                    }
                  >
                    <SelectTrigger id="categoryB">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {PASSENGER_CATEGORIES.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.label} {c.discountPercent > 0 ? `(Diskon ${c.discountPercent}%)` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formB.formState.errors.passengerCategory && (
                    <p className="text-xs text-[hsl(var(--destructive))]">
                      {formB.formState.errors.passengerCategory.message}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="submit" className="flex-1">
                    <Calculator className="h-4 w-4" />
                    Hitung Tarif
                  </Button>
                  <Button type="button" variant="outline" onClick={handleReset}>
                    <RefreshCw className="h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Result Card */}
        <div className="space-y-4">
          {result ? (
            <Card className="border-[hsl(var(--primary))]/30">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-[hsl(var(--primary))]" />
                  Rincian Perhitungan
                  <Badge variant="default">Metode {result.method}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Journey info */}
                <div className="rounded-lg bg-[hsl(var(--muted))] p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[hsl(var(--muted-foreground))]">Metode</span>
                    <span className="font-medium">
                      Metode {result.method} —{' '}
                      {result.method === 'A' ? 'Jumlah Stasiun' : 'Jarak Kilometer'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[hsl(var(--muted-foreground))]">
                      {result.method === 'A' ? 'Jumlah Stasiun' : 'Jarak'}
                    </span>
                    <span className="font-medium">
                      {result.journeyValue} {result.method === 'A' ? 'stasiun' : 'km'}
                    </span>
                  </div>
                </div>

                <Separator />

                {/* Fare breakdown */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                    Perhitungan Tarif Dasar
                  </p>
                  <div className="space-y-1 rounded-lg border border-[hsl(var(--border))] p-3 font-mono text-sm">
                    <div className="flex justify-between text-[hsl(var(--muted-foreground))]">
                      <span>
                        {result.method === 'A'
                          ? `${result.baseThreshold} stasiun pertama`
                          : `${result.baseThreshold} km pertama`}
                      </span>
                      <span>{formatRupiah(result.baseThresholdFare)}</span>
                    </div>
                    {result.extraGroups > 0 && (
                      <>
                        <div className="flex justify-between text-[hsl(var(--muted-foreground))]">
                          <span>
                            {result.method === 'A'
                              ? `Sisa ${result.journeyValue - result.baseThreshold} stasiun → ${result.extraGroups} kelompok`
                              : `Sisa ${(result.journeyValue - result.baseThreshold).toFixed(1)} km → ${result.extraGroups} kelompok`}
                          </span>
                          <span></span>
                        </div>
                        <div className="flex justify-between text-[hsl(var(--muted-foreground))]">
                          <span>
                            {result.extraGroups} × {formatRupiah(result.extraGroupFare)}
                          </span>
                          <span>+{formatRupiah(result.extraFare)}</span>
                        </div>
                        <Separator />
                      </>
                    )}
                    <div className="flex justify-between font-semibold">
                      <span>Tarif Dasar</span>
                      <span>{formatRupiah(result.baseFare)}</span>
                    </div>
                  </div>
                </div>

                {/* Discount */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                    Diskon Penumpang
                  </p>
                  <div className="space-y-1 rounded-lg border border-[hsl(var(--border))] p-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[hsl(var(--muted-foreground))]">Kategori</span>
                      <span className="font-medium">
                        {PASSENGER_CATEGORIES.find((c) => c.id === result.passengerCategory)?.label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[hsl(var(--muted-foreground))]">Persentase Diskon</span>
                      <span className="font-medium text-amber-600">{result.discountPercent}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[hsl(var(--muted-foreground))]">Nominal Diskon</span>
                      <span className="font-medium text-[hsl(var(--destructive))]">
                        -{formatRupiah(result.discountAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Final fare */}
                <div className="rounded-xl bg-[hsl(var(--primary))] p-5 text-center">
                  <p className="text-sm text-[hsl(var(--primary-foreground))]/80">Tarif Akhir</p>
                  <p className="text-4xl font-bold text-[hsl(var(--primary-foreground))] mt-1">
                    {formatRupiah(result.finalFare)}
                  </p>
                  {result.discountPercent > 0 && (
                    <p className="text-xs text-[hsl(var(--primary-foreground))]/70 mt-1">
                      Hemat {formatRupiah(result.discountAmount)} ({result.discountPercent}% diskon)
                    </p>
                  )}
                </div>

                <Button className="w-full" onClick={handleLanjut}>
                  <ArrowRight className="h-4 w-4" />
                  Lanjutkan ke Pembayaran
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(var(--muted))]">
                  <Info className="h-7 w-7 text-[hsl(var(--muted-foreground))]" />
                </div>
                <p className="text-sm font-medium">Hasil Perhitungan</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                  Isi form dan klik "Hitung Tarif" untuk melihat rincian
                </p>
              </CardContent>
            </Card>
          )}

          {/* Info box */}
          <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                <div className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                  <p className="font-medium">Kalkulator tidak menyimpan transaksi</p>
                  <p>Gunakan menu "Transaksi Tiket" untuk membuat transaksi resmi yang tercatat.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
