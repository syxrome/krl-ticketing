// src/features/fare/fare.types.ts

export type FareMethod = 'A' | 'B'

export type JourneyUnit = 'station' | 'km'

export type PassengerCategory = 'umum' | 'pelajar' | 'lansia' | 'anak'

export interface PassengerCategoryInfo {
  id: PassengerCategory
  label: string
  discountPercent: number
}

export const PASSENGER_CATEGORIES: PassengerCategoryInfo[] = [
  { id: 'umum', label: 'Umum', discountPercent: 0 },
  { id: 'pelajar', label: 'Pelajar', discountPercent: 10 },
  { id: 'lansia', label: 'Lansia', discountPercent: 20 },
  { id: 'anak', label: 'Anak-anak', discountPercent: 50 },
]

export interface FareCalculationResult {
  method: FareMethod
  journeyValue: number
  journeyUnit: JourneyUnit
  baseFare: number
  extraGroups: number
  extraFare: number
  passengerCategory: PassengerCategory
  discountPercent: number
  discountAmount: number
  finalFare: number
}

export interface FareBreakdown extends FareCalculationResult {
  baseThreshold: number
  baseThresholdFare: number
  extraGroupSize: number
  extraGroupFare: number
}
