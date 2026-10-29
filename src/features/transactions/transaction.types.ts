// src/features/transactions/transaction.types.ts

import type { FareMethod, PassengerCategory, JourneyUnit } from '../fare/fare.types'

export type TransactionStatus = 'SUCCESS'

export interface Transaction {
  id: string
  createdAt: string           // ISO 8601
  method: FareMethod
  journeyValue: number
  journeyUnit: JourneyUnit
  passengerCategory: PassengerCategory
  baseFare: number
  extraGroups: number
  extraFare: number
  discountPercentage: number
  discountAmount: number
  finalFare: number
  paymentAmount: number
  changeAmount: number
  status: TransactionStatus
}

/**
 * State mesin transaksi
 */
export type TransactionStep = 'DRAFT' | 'REVIEW' | 'PAYMENT' | 'SUCCESS' | 'CANCELLED'

export interface TransactionState {
  step: TransactionStep
  method: FareMethod | null
  journeyValue: number | null
  passengerCategory: PassengerCategory | null
  calculationResult: {
    baseFare: number
    extraGroups: number
    extraFare: number
    discountPercent: number
    discountAmount: number
    finalFare: number
  } | null
  paymentAmount: number | null
  changeAmount: number | null
  completedTransaction: Transaction | null
  error: string | null
}

export interface StoredTransactionData {
  version: string
  transactions: Transaction[]
}
