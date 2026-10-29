// src/features/transactions/transaction.service.ts
// Service untuk CRUD transaksi di localStorage

import { storageGet, storageSet, STORAGE_KEYS } from '@/lib/storage'
import type { Transaction, StoredTransactionData } from './transaction.types'

const DATA_VERSION = '1'

/**
 * Generate ID transaksi unik
 * Format: KRL-YYYYMMDD-XXXXXX
 */
export function generateTransactionId(): string {
  const now = new Date()
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('')
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `KRL-${date}-${random}`
}

/**
 * Validasi struktur data transaksi yang dibaca dari storage
 */
function isValidTransaction(t: unknown): t is Transaction {
  if (typeof t !== 'object' || t === null) return false
  const tx = t as Record<string, unknown>
  return (
    typeof tx['id'] === 'string' &&
    typeof tx['createdAt'] === 'string' &&
    (tx['method'] === 'A' || tx['method'] === 'B') &&
    typeof tx['journeyValue'] === 'number' &&
    typeof tx['finalFare'] === 'number' &&
    tx['status'] === 'SUCCESS'
  )
}

/**
 * Load semua transaksi dari localStorage
 */
export function loadTransactions(): Transaction[] {
  const data = storageGet<StoredTransactionData>(STORAGE_KEYS.TRANSACTIONS, {
    version: DATA_VERSION,
    transactions: [],
  })

  // Validasi versi
  if (data.version !== DATA_VERSION) {
    return []
  }

  // Filter hanya transaksi yang valid
  if (!Array.isArray(data.transactions)) return []
  return data.transactions.filter(isValidTransaction)
}

/**
 * Simpan transaksi baru
 */
export function saveTransaction(transaction: Transaction): boolean {
  const existing = loadTransactions()
  const updated: StoredTransactionData = {
    version: DATA_VERSION,
    transactions: [transaction, ...existing],
  }
  return storageSet(STORAGE_KEYS.TRANSACTIONS, updated)
}

/**
 * Hapus semua transaksi
 */
export function clearTransactions(): boolean {
  const empty: StoredTransactionData = {
    version: DATA_VERSION,
    transactions: [],
  }
  return storageSet(STORAGE_KEYS.TRANSACTIONS, empty)
}

/**
 * Cari transaksi berdasarkan ID
 */
export function findTransactionById(id: string): Transaction | undefined {
  return loadTransactions().find((t) => t.id === id)
}
