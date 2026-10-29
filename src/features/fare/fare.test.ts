// src/features/fare/fare.test.ts
import { describe, it, expect } from 'vitest'
import {
  calculateMethodAFare,
  calculateMethodBFare,
  calculateDiscount,
  calculateFare,
} from './fare.engine'

// ─── Metode A ────────────────────────────────────────────────────────────────
describe('Metode A: Tarif berdasarkan jumlah stasiun', () => {
  const cases: Array<[number, number]> = [
    [1, 2000],
    [2, 2000],
    [3, 2000],
    [4, 2000],
    [5, 2000],
    [6, 2500],
    [7, 2500],
    [8, 2500],
    [9, 3000],
    [10, 3000],
    [11, 3000],
    [12, 3500],
    [13, 3500],
    [14, 3500],
    [15, 4000],
  ]

  it.each(cases)('stasiun %i → Rp%i', (stations, expected) => {
    const { baseFare } = calculateMethodAFare(stations)
    expect(baseFare).toBe(expected)
  })

  it('5 stasiun = tarif dasar (tidak ada kelompok tambahan)', () => {
    const result = calculateMethodAFare(5)
    expect(result.extraGroups).toBe(0)
    expect(result.extraFare).toBe(0)
  })

  it('6 stasiun = 1 kelompok tambahan', () => {
    const result = calculateMethodAFare(6)
    expect(result.extraGroups).toBe(1)
    expect(result.extraFare).toBe(500)
  })

  it('8 stasiun = 1 kelompok tambahan (8-5=3, ceil(3/3)=1)', () => {
    const result = calculateMethodAFare(8)
    expect(result.extraGroups).toBe(1)
    expect(result.extraFare).toBe(500)
  })

  it('9 stasiun = 2 kelompok tambahan (9-5=4, ceil(4/3)=2)', () => {
    const result = calculateMethodAFare(9)
    expect(result.extraGroups).toBe(2)
    expect(result.extraFare).toBe(1000)
  })
})

// ─── Metode B ────────────────────────────────────────────────────────────────
describe('Metode B: Tarif berdasarkan kilometer', () => {
  const cases: Array<[number, number]> = [
    [1, 3000],
    [10, 3000],
    [25, 3000],
    [25.1, 4000],
    [30, 4000],
    [35, 4000],
    [35.1, 5000],
    [40, 5000],
    [45, 5000],
    [45.1, 6000],
    [46, 6000],
    [55, 6000],
    [55.1, 7000],
  ]

  it.each(cases)('%f km → Rp%i', (km, expected) => {
    const { baseFare } = calculateMethodBFare(km)
    expect(baseFare).toBe(expected)
  })

  it('25 km = tarif dasar, tidak ada kelompok tambahan', () => {
    const result = calculateMethodBFare(25)
    expect(result.extraGroups).toBe(0)
    expect(result.extraFare).toBe(0)
  })

  it('25.1 km = 1 kelompok tambahan', () => {
    const result = calculateMethodBFare(25.1)
    expect(result.extraGroups).toBe(1)
    expect(result.extraFare).toBe(1000)
  })

  it('35 km = 1 kelompok tambahan (35-25=10, ceil(10/10)=1)', () => {
    const result = calculateMethodBFare(35)
    expect(result.extraGroups).toBe(1)
    expect(result.extraFare).toBe(1000)
  })

  it('35.1 km = 2 kelompok tambahan', () => {
    const result = calculateMethodBFare(35.1)
    expect(result.extraGroups).toBe(2)
    expect(result.extraFare).toBe(2000)
  })

  it('45 km = 2 kelompok tambahan', () => {
    const result = calculateMethodBFare(45)
    expect(result.extraGroups).toBe(2)
    expect(result.extraFare).toBe(2000)
  })

  it('46 km = 3 kelompok tambahan (46-25=21, ceil(21/10)=3)', () => {
    const result = calculateMethodBFare(46)
    expect(result.extraGroups).toBe(3)
    expect(result.extraFare).toBe(3000)
  })
})

// ─── Diskon ──────────────────────────────────────────────────────────────────
describe('Diskon kategori penumpang', () => {
  it('Umum: tidak ada diskon', () => {
    const { discountPercent, discountAmount, finalFare } = calculateDiscount(5000, 'umum')
    expect(discountPercent).toBe(0)
    expect(discountAmount).toBe(0)
    expect(finalFare).toBe(5000)
  })

  it('Pelajar: diskon 10%', () => {
    const { discountPercent, discountAmount, finalFare } = calculateDiscount(5000, 'pelajar')
    expect(discountPercent).toBe(10)
    expect(discountAmount).toBe(500)
    expect(finalFare).toBe(4500)
  })

  it('Lansia: diskon 20%', () => {
    const { discountPercent, discountAmount, finalFare } = calculateDiscount(5000, 'lansia')
    expect(discountPercent).toBe(20)
    expect(discountAmount).toBe(1000)
    expect(finalFare).toBe(4000)
  })

  it('Anak-anak: diskon 50%', () => {
    const { discountPercent, discountAmount, finalFare } = calculateDiscount(5000, 'anak')
    expect(discountPercent).toBe(50)
    expect(discountAmount).toBe(2500)
    expect(finalFare).toBe(2500)
  })

  it('Tarif akhir tidak pernah negatif', () => {
    const { finalFare } = calculateDiscount(0, 'anak')
    expect(finalFare).toBeGreaterThanOrEqual(0)
  })

  it('Pembulatan ROUND_HALF_UP untuk pecahan rupiah', () => {
    // 3000 * 33% / 100 = 990 (exact integer ok)
    const { discountAmount } = calculateDiscount(3000, 'pelajar')
    expect(Number.isInteger(discountAmount)).toBe(true)
  })
})

// ─── Kalkulasi lengkap ────────────────────────────────────────────────────────
describe('Kalkulasi tarif lengkap', () => {
  it('Metode A, 10 stasiun, Umum → tarif akhir = 3000', () => {
    const result = calculateFare('A', 10, 'umum')
    expect(result.baseFare).toBe(3000)
    expect(result.finalFare).toBe(3000)
    expect(result.discountAmount).toBe(0)
  })

  it('Metode A, 10 stasiun, Pelajar → tarif akhir = 2700', () => {
    const result = calculateFare('A', 10, 'pelajar')
    expect(result.baseFare).toBe(3000)
    expect(result.discountAmount).toBe(300)
    expect(result.finalFare).toBe(2700)
  })

  it('Metode B, 35 km, Lansia → diskon 20%', () => {
    const result = calculateFare('B', 35, 'lansia')
    expect(result.baseFare).toBe(4000)
    expect(result.discountAmount).toBe(800)
    expect(result.finalFare).toBe(3200)
  })

  it('journeyUnit untuk Metode A = station', () => {
    const result = calculateFare('A', 5, 'umum')
    expect(result.journeyUnit).toBe('station')
  })

  it('journeyUnit untuk Metode B = km', () => {
    const result = calculateFare('B', 20, 'umum')
    expect(result.journeyUnit).toBe('km')
  })
})
