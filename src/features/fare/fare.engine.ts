// src/features/fare/fare.engine.ts
// Core fare calculation engine - single source of truth

import type {
  FareMethod,
  PassengerCategory,
  FareCalculationResult,
  FareBreakdown,
} from './fare.types'
import { PASSENGER_CATEGORIES } from './fare.types'

// ─── Konstanta tarif (sesuai soal, tidak boleh diubah) ───────────────────────

const METHOD_A = {
  BASE_THRESHOLD: 5,     // 1-5 stasiun
  BASE_FARE: 2000,       // tarif dasar
  EXTRA_GROUP_SIZE: 3,   // kelompok tambahan tiap 3 stasiun
  EXTRA_GROUP_FARE: 500, // tarif per kelompok tambahan
} as const

const METHOD_B = {
  BASE_THRESHOLD: 25,    // 25 km pertama
  BASE_FARE: 3000,       // tarif dasar
  EXTRA_GROUP_SIZE: 10,  // kelompok tambahan tiap 10 km
  EXTRA_GROUP_FARE: 1000,// tarif per kelompok tambahan
} as const

// ─── Fungsi bantu ────────────────────────────────────────────────────────────

/**
 * Ceil integer yang aman dari floating-point error
 * Contoh: ceil(35.1 - 25) / 10 harus = 2, bukan 1
 */
function safeCeil(value: number): number {
  // Bulatkan ke 10 desimal untuk hindari floating-point error
  const rounded = Math.round(value * 1e10) / 1e10
  return Math.ceil(rounded)
}

/**
 * Round half-up untuk nominal rupiah
 */
function roundHalfUp(value: number): number {
  return Math.floor(value + 0.5)
}

// ─── Metode A: berdasarkan jumlah stasiun ───────────────────────────────────

/**
 * Hitung tarif dasar Metode A
 * N <= 5: Rp2.000
 * N > 5: Rp2.000 + ceil((N-5)/3) * Rp500
 */
export function calculateMethodAFare(stations: number): {
  baseFare: number
  extraGroups: number
  extraFare: number
} {
  if (stations <= METHOD_A.BASE_THRESHOLD) {
    return { baseFare: METHOD_A.BASE_FARE, extraGroups: 0, extraFare: 0 }
  }
  const extraGroups = safeCeil((stations - METHOD_A.BASE_THRESHOLD) / METHOD_A.EXTRA_GROUP_SIZE)
  const extraFare = extraGroups * METHOD_A.EXTRA_GROUP_FARE
  return {
    baseFare: METHOD_A.BASE_FARE + extraFare,
    extraGroups,
    extraFare,
  }
}

// ─── Metode B: berdasarkan kilometer ────────────────────────────────────────

/**
 * Hitung tarif dasar Metode B
 * D <= 25: Rp3.000
 * D > 25: Rp3.000 + ceil((D-25)/10) * Rp1.000
 */
export function calculateMethodBFare(km: number): {
  baseFare: number
  extraGroups: number
  extraFare: number
} {
  if (km <= METHOD_B.BASE_THRESHOLD) {
    return { baseFare: METHOD_B.BASE_FARE, extraGroups: 0, extraFare: 0 }
  }
  const extraGroups = safeCeil((km - METHOD_B.BASE_THRESHOLD) / METHOD_B.EXTRA_GROUP_SIZE)
  const extraFare = extraGroups * METHOD_B.EXTRA_GROUP_FARE
  return {
    baseFare: METHOD_B.BASE_FARE + extraFare,
    extraGroups,
    extraFare,
  }
}

// ─── Diskon ──────────────────────────────────────────────────────────────────

/**
 * Hitung diskon penumpang
 */
export function calculateDiscount(
  baseFare: number,
  category: PassengerCategory
): { discountPercent: number; discountAmount: number; finalFare: number } {
  const info = PASSENGER_CATEGORIES.find((c) => c.id === category)
  const discountPercent = info?.discountPercent ?? 0
  const discountAmount = roundHalfUp((baseFare * discountPercent) / 100)
  const finalFare = Math.max(0, baseFare - discountAmount)
  return { discountPercent, discountAmount, finalFare }
}

// ─── Kalkulasi lengkap ────────────────────────────────────────────────────────

/**
 * Hitung tarif lengkap berdasarkan metode, nilai perjalanan, dan kategori penumpang
 */
export function calculateFare(
  method: FareMethod,
  journeyValue: number,
  category: PassengerCategory
): FareCalculationResult {
  let fareResult: { baseFare: number; extraGroups: number; extraFare: number }
  const journeyUnit = method === 'A' ? 'station' : 'km'

  if (method === 'A') {
    fareResult = calculateMethodAFare(journeyValue)
  } else {
    fareResult = calculateMethodBFare(journeyValue)
  }

  const discount = calculateDiscount(fareResult.baseFare, category)

  return {
    method,
    journeyValue,
    journeyUnit,
    baseFare: fareResult.baseFare,
    extraGroups: fareResult.extraGroups,
    extraFare: fareResult.extraFare,
    passengerCategory: category,
    discountPercent: discount.discountPercent,
    discountAmount: discount.discountAmount,
    finalFare: discount.finalFare,
  }
}

/**
 * Hitung tarif dengan breakdown detail untuk display
 */
export function calculateFareWithBreakdown(
  method: FareMethod,
  journeyValue: number,
  category: PassengerCategory
): FareBreakdown {
  const result = calculateFare(method, journeyValue, category)
  const config = method === 'A' ? METHOD_A : METHOD_B

  return {
    ...result,
    baseThreshold: config.BASE_THRESHOLD,
    baseThresholdFare: config.BASE_FARE,
    extraGroupSize: config.EXTRA_GROUP_SIZE,
    extraGroupFare: config.EXTRA_GROUP_FARE,
  }
}

/**
 * Export konstanta untuk tampilan dokumentasi
 */
export { METHOD_A, METHOD_B }
