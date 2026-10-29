// src/pages/TransactionPage.tsx
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  CheckCircle,
  XCircle,
  ArrowLeft,
  CreditCard,
  Receipt,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'
import { calculateFareWithBreakdown } from '@/features/fare/fare.engine'
import { PASSENGER_CATEGORIES } from '@/features/fare/fare.types'
import type { FareBreakdown, PassengerCategory } from '@/features/fare/fare.types'
import { generateTransactionId } from '@/features/transactions/transaction.service'
import type { Transaction } from '@/features/transactions/transaction.types'
import { useTransactions } from '@/context/TransactionContext'
import { formatRupiah } from '@/lib/currency'
import { formatDateIndonesia } from '@/lib/date'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

type Step = 'DRAFT' | 'REVIEW' | 'PAYMENT' | 'SUCCESS' | 'CANCELLED'

// Draft form schemas
const draftSchemaA = z.object({
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

const draftSchemaB = z.object({
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

const paymentSchema = z.object({
  paymentAmount: z
    .string()
    .min(1, 'Nominal pembayaran wajib diisi')
    .refine((v) => {
      const num = Number(v.replace(/\D/g, ''))
      return !isNaN(num) && num > 0
    }, 'Nominal pembayaran harus lebih dari 0'),
})

type DraftAValues = z.infer<typeof draftSchemaA>
type DraftBValues = z.infer<typeof draftSchemaB>
type PaymentValues = z.infer<typeof paymentSchema>

// Step indicator
function StepIndicator({ current }: { current: Step }) {
  const steps = [
    { id: 'DRAFT', label: 'Data Perjalanan', num: 1 },
    { id: 'REVIEW', label: 'Konfirmasi', num: 2 },
    { id: 'PAYMENT', label: 'Pembayaran', num: 3 },
    { id: 'SUCCESS', label: 'Berhasil', num: 4 },
  ]
  const currentNum = steps.find((s) => s.id === current)?.num ?? 0

  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
              currentNum > step.num
                ? 'bg-[hsl(var(--success))] text-white'
                : currentNum === step.num
                ? 'bg-[hsl(var(--primary))] text-white'
                : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]'
            }`}
          >
            {currentNum > step.num ? '✓' : step.num}
          </div>
          <span
            className={`hidden sm:block text-xs ${
              currentNum === step.num ? 'font-semibold text-[hsl(var(--foreground))]' : 'text-[hsl(var(--muted-foreground))]'
            }`}
          >
            {step.label}
          </span>
          {i < steps.length - 1 && (
            <div
              className={`h-px w-8 sm:w-12 ${
                currentNum > step.num ? 'bg-[hsl(var(--success))]' : 'bg-[hsl(var(--border))]'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export function TransactionPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { addTransaction } = useTransactions()

  const [step, setStep] = useState<Step>('DRAFT')
  const [activeMethod, setActiveMethod] = useState<'A' | 'B'>('A')
  const [fareResult, setFareResult] = useState<FareBreakdown | null>(null)
  const [completedTx, setCompletedTx] = useState<Transaction | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  // Pre-fill from calculator navigation
  const prefill = (location.state as { prefill?: FareBreakdown } | null)?.prefill

  const formA = useForm<DraftAValues>({
    resolver: zodResolver(draftSchemaA),
    defaultValues: {
      stations: prefill?.method === 'A' ? String(prefill.journeyValue) : '',
      passengerCategory: (prefill?.passengerCategory as PassengerCategory) ?? 'umum',
    },
  })

  const formB = useForm<DraftBValues>({
    resolver: zodResolver(draftSchemaB),
    defaultValues: {
      distance: prefill?.method === 'B' ? String(prefill.journeyValue) : '',
      passengerCategory: (prefill?.passengerCategory as PassengerCategory) ?? 'umum',
    },
  })

  const paymentForm = useForm<PaymentValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { paymentAmount: '' },
  })

  // Apply prefill method
  useEffect(() => {
    if (prefill) {
      setActiveMethod(prefill.method)
      setFareResult(prefill)
      setStep('REVIEW')
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleDraftSubmit() {
    if (activeMethod === 'A') {
      const isValid = formA.trigger()
      isValid.then((valid) => {
        if (!valid) return
        const values = formA.getValues()
        const breakdown = calculateFareWithBreakdown('A', Number(values.stations), values.passengerCategory)
        setFareResult(breakdown)
        setStep('REVIEW')
      })
    } else {
      const isValid = formB.trigger()
      isValid.then((valid) => {
        if (!valid) return
        const values = formB.getValues()
        const breakdown = calculateFareWithBreakdown('B', Number(values.distance), values.passengerCategory)
        setFareResult(breakdown)
        setStep('REVIEW')
      })
    }
  }

  function handlePaymentSubmit(data: PaymentValues) {
    if (!fareResult || isProcessing) return

    const raw = Number(data.paymentAmount.replace(/\D/g, ''))
    if (isNaN(raw) || raw < fareResult.finalFare) {
      setPaymentError(`Pembayaran kurang. Minimal ${formatRupiah(fareResult.finalFare)}`)
      return
    }

    const payment = raw
    const change = payment - fareResult.finalFare

    setIsProcessing(true)
    // Simulate brief processing
    setTimeout(() => {
      const tx: Transaction = {
        id: generateTransactionId(),
        createdAt: new Date().toISOString(),
        method: fareResult.method,
        journeyValue: fareResult.journeyValue,
        journeyUnit: fareResult.journeyUnit,
        passengerCategory: fareResult.passengerCategory,
        baseFare: fareResult.baseFare,
        extraGroups: fareResult.extraGroups,
        extraFare: fareResult.extraFare,
        discountPercentage: fareResult.discountPercent,
        discountAmount: fareResult.discountAmount,
        finalFare: fareResult.finalFare,
        paymentAmount: payment,
        changeAmount: change,
        status: 'SUCCESS',
      }
      addTransaction(tx)
      setCompletedTx(tx)
      setStep('SUCCESS')
      setIsProcessing(false)
    }, 500)
  }

  function handleNewTransaction() {
    setStep('DRAFT')
    setFareResult(null)
    setCompletedTx(null)
    setPaymentError(null)
    setActiveMethod('A')
    formA.reset({ stations: '', passengerCategory: 'umum' })
    formB.reset({ distance: '', passengerCategory: 'umum' })
    paymentForm.reset({ paymentAmount: '' })
  }

  const CATEGORY_LABELS: Record<string, string> = {
    umum: 'Umum', pelajar: 'Pelajar', lansia: 'Lansia', anak: 'Anak-anak',
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Transaksi Tiket</h2>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Simulasi pembelian tiket KRL langkah demi langkah
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        {step !== 'CANCELLED' && <StepIndicator current={step} />}

        {/* STEP 1: DRAFT */}
        {step === 'DRAFT' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[hsl(var(--primary))]" />
                Data Perjalanan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Method selector */}
              <div className="space-y-2">
                <Label>Metode Tarif</Label>
                <div className="grid grid-cols-2 gap-3">
                  {(['A', 'B'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setActiveMethod(m)}
                      className={`rounded-lg border-2 p-3 text-left transition-colors ${
                        activeMethod === m
                          ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/5'
                          : 'border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]/50'
                      }`}
                    >
                      <div className="font-bold text-[hsl(var(--primary))]">Metode {m}</div>
                      <div className="text-xs text-[hsl(var(--muted-foreground))]">
                        {m === 'A' ? 'Jumlah Stasiun' : 'Jarak Kilometer'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {activeMethod === 'A' ? (
                <div className="space-y-2">
                  <Label htmlFor="tx-stations">Jumlah Stasiun</Label>
                  <Input
                    id="tx-stations"
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
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="tx-distance">Jarak (km)</Label>
                  <Input
                    id="tx-distance"
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
                </div>
              )}

              <div className="space-y-2">
                <Label>Kategori Penumpang</Label>
                <Select
                  value={activeMethod === 'A' ? formA.watch('passengerCategory') : formB.watch('passengerCategory')}
                  onValueChange={(v: PassengerCategory) => {
                    if (activeMethod === 'A') formA.setValue('passengerCategory', v)
                    else formB.setValue('passengerCategory', v)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {PASSENGER_CATEGORIES.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.label} {c.discountPercent > 0 ? `— Diskon ${c.discountPercent}%` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full" onClick={handleDraftSubmit}>
                Hitung & Lanjutkan
              </Button>
            </CardContent>
          </Card>
        )}

        {/* STEP 2: REVIEW */}
        {step === 'REVIEW' && fareResult && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Receipt className="h-5 w-5 text-[hsl(var(--primary))]" />
                Konfirmasi Perjalanan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-[hsl(var(--muted))] p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[hsl(var(--muted-foreground))]">Metode</span>
                  <span className="font-medium">Metode {fareResult.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[hsl(var(--muted-foreground))]">
                    {fareResult.method === 'A' ? 'Jumlah Stasiun' : 'Jarak'}
                  </span>
                  <span className="font-medium">
                    {fareResult.journeyValue} {fareResult.method === 'A' ? 'stasiun' : 'km'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[hsl(var(--muted-foreground))]">Kategori</span>
                  <span className="font-medium">
                    {PASSENGER_CATEGORIES.find((c) => c.id === fareResult.passengerCategory)?.label}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-[hsl(var(--muted-foreground))]">Tarif Dasar</span>
                  <span className="font-medium">{formatRupiah(fareResult.baseFare)}</span>
                </div>
                {fareResult.discountPercent > 0 && (
                  <div className="flex justify-between">
                    <span className="text-[hsl(var(--muted-foreground))]">
                      Diskon ({fareResult.discountPercent}%)
                    </span>
                    <span className="font-medium text-[hsl(var(--destructive))]">
                      -{formatRupiah(fareResult.discountAmount)}
                    </span>
                  </div>
                )}
              </div>

              <div className="rounded-xl bg-[hsl(var(--primary))] p-4 text-center">
                <p className="text-xs text-[hsl(var(--primary-foreground))]/80">Total yang Harus Dibayar</p>
                <p className="text-3xl font-bold text-[hsl(var(--primary-foreground))] mt-1">
                  {formatRupiah(fareResult.finalFare)}
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep('DRAFT')} className="flex-1">
                  <ArrowLeft className="h-4 w-4" />
                  Kembali
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setStep('CANCELLED')}
                  size="icon"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
                <Button onClick={() => setStep('PAYMENT')} className="flex-1">
                  Lanjut Bayar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 3: PAYMENT */}
        {step === 'PAYMENT' && fareResult && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[hsl(var(--primary))]" />
                Simulasi Pembayaran Tunai
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-[hsl(var(--muted))] p-4 text-center">
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Total yang Harus Dibayar</p>
                <p className="text-3xl font-bold mt-1">{formatRupiah(fareResult.finalFare)}</p>
              </div>

              <form
                onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="payment">Nominal Pembayaran (Rp)</Label>
                  <Input
                    id="payment"
                    type="number"
                    min={fareResult.finalFare}
                    step="1000"
                    placeholder={`Min. ${formatRupiah(fareResult.finalFare)}`}
                    {...paymentForm.register('paymentAmount')}
                    onChange={(e) => {
                      paymentForm.setValue('paymentAmount', e.target.value)
                      setPaymentError(null)
                    }}
                  />
                  {paymentError && (
                    <div className="flex items-center gap-2 text-xs text-[hsl(var(--destructive))]">
                      <AlertCircle className="h-3 w-3" />
                      {paymentError}
                    </div>
                  )}
                  {paymentForm.formState.errors.paymentAmount && (
                    <p className="text-xs text-[hsl(var(--destructive))]">
                      {paymentForm.formState.errors.paymentAmount.message}
                    </p>
                  )}
                </div>

                {/* Live kembalian preview */}
                {(() => {
                  const raw = paymentForm.watch('paymentAmount')
                  const val = Number(String(raw).replace(/\D/g, ''))
                  if (val >= fareResult.finalFare) {
                    return (
                      <div className="rounded-lg border border-[hsl(var(--success))]/30 bg-[hsl(var(--success))]/10 p-3 text-sm">
                        <div className="flex justify-between">
                          <span>Kembalian</span>
                          <span className="font-bold text-[hsl(var(--success))]">
                            {formatRupiah(val - fareResult.finalFare)}
                          </span>
                        </div>
                      </div>
                    )
                  }
                  return null
                })()}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep('REVIEW')}
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Proses Pembayaran
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* STEP 4: SUCCESS */}
        {step === 'SUCCESS' && completedTx && (
          <Card className="border-[hsl(var(--success))]/30">
            <CardContent className="pt-6 space-y-6">
              <div className="text-center space-y-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--success))]/10 mx-auto">
                  <CheckCircle className="h-9 w-9 text-[hsl(var(--success))]" />
                </div>
                <h3 className="text-xl font-bold text-[hsl(var(--success))]">Pembayaran Berhasil!</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  Transaksi telah disimpan ke riwayat
                </p>
              </div>

              {/* Receipt */}
              <div className="rounded-xl border border-dashed border-[hsl(var(--border))] p-5 space-y-3 bg-[hsl(var(--muted))]/30">
                <div className="text-center">
                  <p className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-widest font-mono">
                    Bukti Pembayaran
                  </p>
                  <p className="font-mono font-bold text-sm mt-1">{completedTx.id}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    {formatDateIndonesia(completedTx.createdAt)}
                  </p>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[hsl(var(--muted-foreground))]">Metode</span>
                    <Badge>Metode {completedTx.method}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[hsl(var(--muted-foreground))]">Perjalanan</span>
                    <span className="font-medium">
                      {completedTx.journeyValue} {completedTx.method === 'A' ? 'stasiun' : 'km'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[hsl(var(--muted-foreground))]">Kategori</span>
                    <span className="font-medium">
                      {CATEGORY_LABELS[completedTx.passengerCategory] ?? completedTx.passengerCategory}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-[hsl(var(--muted-foreground))]">Tarif Dasar</span>
                    <span>{formatRupiah(completedTx.baseFare)}</span>
                  </div>
                  {completedTx.discountAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[hsl(var(--muted-foreground))]">
                        Diskon ({completedTx.discountPercentage}%)
                      </span>
                      <span className="text-[hsl(var(--destructive))]">
                        -{formatRupiah(completedTx.discountAmount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold">
                    <span>Tarif Akhir</span>
                    <span>{formatRupiah(completedTx.finalFare)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-[hsl(var(--muted-foreground))]">Bayar</span>
                    <span>{formatRupiah(completedTx.paymentAmount)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-[hsl(var(--success))]">
                    <span>Kembalian</span>
                    <span>{formatRupiah(completedTx.changeAmount)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={handleNewTransaction}>
                  <RefreshCw className="h-4 w-4" />
                  Transaksi Baru
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => navigate('/riwayat')}
                >
                  Lihat Riwayat
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* CANCELLED */}
        {step === 'CANCELLED' && (
          <Card className="border-[hsl(var(--destructive))]/30">
            <CardContent className="pt-6 space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--destructive))]/10 mx-auto">
                <XCircle className="h-9 w-9 text-[hsl(var(--destructive))]" />
              </div>
              <h3 className="text-xl font-bold text-[hsl(var(--destructive))]">Transaksi Dibatalkan</h3>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Transaksi tidak disimpan dan tidak memengaruhi pendapatan.
              </p>
              <Button onClick={handleNewTransaction} className="w-full">
                <RefreshCw className="h-4 w-4" />
                Mulai Transaksi Baru
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
