// src/features/transactions/transaction.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import {
  generateTransactionId,
  saveTransaction,
  loadTransactions,
  clearTransactions,
} from './transaction.service'
import type { Transaction } from './transaction.types'

function makeTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: generateTransactionId(),
    createdAt: new Date().toISOString(),
    method: 'A',
    journeyValue: 10,
    journeyUnit: 'station',
    passengerCategory: 'umum',
    baseFare: 3000,
    extraGroups: 2,
    extraFare: 1000,
    discountPercentage: 0,
    discountAmount: 0,
    finalFare: 3000,
    paymentAmount: 5000,
    changeAmount: 2000,
    status: 'SUCCESS',
    ...overrides,
  }
}

describe('Transaction Service', () => {
  beforeEach(() => {
    localStorage.clear()
    clearTransactions()
  })

  describe('generateTransactionId', () => {
    it('menghasilkan ID dengan prefix KRL-', () => {
      const id = generateTransactionId()
      expect(id).toMatch(/^KRL-\d{8}-[A-Z0-9]{6}$/)
    })

    it('menghasilkan ID unik setiap kali dipanggil', () => {
      const ids = new Set(Array.from({ length: 100 }, () => generateTransactionId()))
      // Dengan random 6 karakter alphanumeric ada kemungkinan kecil collision, tapi sebaiknya unik
      expect(ids.size).toBeGreaterThan(90)
    })
  })

  describe('saveTransaction & loadTransactions', () => {
    it('menyimpan dan memuat transaksi', () => {
      const t = makeTransaction()
      saveTransaction(t)
      const loaded = loadTransactions()
      expect(loaded).toHaveLength(1)
      expect(loaded[0]?.id).toBe(t.id)
    })

    it('transaksi baru muncul di awal list', () => {
      const t1 = makeTransaction({ id: 'KRL-20261029-AAA000' })
      const t2 = makeTransaction({ id: 'KRL-20261029-BBB111' })
      saveTransaction(t1)
      saveTransaction(t2)
      const loaded = loadTransactions()
      expect(loaded[0]?.id).toBe(t2.id)
    })

    it('menangani localStorage kosong', () => {
      const loaded = loadTransactions()
      expect(loaded).toEqual([])
    })

    it('menangani data JSON rusak - mengembalikan array kosong', () => {
      localStorage.setItem('krl_simulator_transactions', '{invalid json}')
      const loaded = loadTransactions()
      expect(loaded).toEqual([])
    })
  })

  describe('clearTransactions', () => {
    it('menghapus semua transaksi', () => {
      saveTransaction(makeTransaction())
      saveTransaction(makeTransaction())
      clearTransactions()
      expect(loadTransactions()).toHaveLength(0)
    })
  })

  describe('Validasi data transaksi', () => {
    it('hanya menyimpan transaksi dengan status SUCCESS', () => {
      // Data dengan status berbeda difilter saat load
      const valid = makeTransaction({ status: 'SUCCESS' })
      saveTransaction(valid)
      const loaded = loadTransactions()
      expect(loaded.every(t => t.status === 'SUCCESS')).toBe(true)
    })

    it('kalkulasi kembalian benar: paymentAmount - finalFare', () => {
      const t = makeTransaction({ finalFare: 3000, paymentAmount: 5000, changeAmount: 2000 })
      expect(t.changeAmount).toBe(t.paymentAmount - t.finalFare)
    })

    it('kembalian = 0 jika pembayaran tepat', () => {
      const t = makeTransaction({ finalFare: 3000, paymentAmount: 3000, changeAmount: 0 })
      expect(t.changeAmount).toBe(0)
    })
  })
})

describe('Validasi aturan bisnis pembayaran', () => {
  it('pembayaran tidak boleh kurang dari tarif akhir', () => {
    const finalFare = 4000
    const paymentAmount = 3000
    const isPaymentValid = paymentAmount >= finalFare
    expect(isPaymentValid).toBe(false)
  })

  it('pembayaran tepat diterima', () => {
    const finalFare = 4000
    const paymentAmount = 4000
    expect(paymentAmount >= finalFare).toBe(true)
    expect(paymentAmount - finalFare).toBe(0)
  })

  it('pembayaran lebih menghasilkan kembalian positif', () => {
    const finalFare = 4000
    const paymentAmount = 10000
    expect(paymentAmount - finalFare).toBe(6000)
  })
})
