// src/features/reports/report.test.ts
import { describe, it, expect } from 'vitest'
import { computeReport } from './report.service'
import type { Transaction } from '../transactions/transaction.types'

function makeTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: 'KRL-20261029-ABC123',
    createdAt: '2026-10-29T10:00:00.000Z',
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

describe('computeReport', () => {
  it('mengembalikan nilai nol untuk transaksi kosong', () => {
    const report = computeReport([])
    expect(report.totalTransactions).toBe(0)
    expect(report.totalRevenue).toBe(0)
    expect(report.totalDiscount).toBe(0)
    expect(report.averageRevenue).toBe(0)
    expect(report.methodACount).toBe(0)
    expect(report.methodBCount).toBe(0)
    expect(report.categoryDistribution).toHaveLength(0)
    expect(report.revenueByDate).toHaveLength(0)
  })

  it('menghitung total pendapatan dari finalFare, bukan paymentAmount', () => {
    const transactions = [
      makeTransaction({ finalFare: 3000, paymentAmount: 5000 }),
      makeTransaction({ finalFare: 4000, paymentAmount: 4000 }),
    ]
    const report = computeReport(transactions)
    expect(report.totalRevenue).toBe(7000) // bukan 9000
  })

  it('menghitung total diskon dengan benar', () => {
    const transactions = [
      makeTransaction({ discountAmount: 300 }),
      makeTransaction({ discountAmount: 500 }),
    ]
    const report = computeReport(transactions)
    expect(report.totalDiscount).toBe(800)
  })

  it('rata-rata pendapatan dihitung dengan benar', () => {
    const transactions = [
      makeTransaction({ finalFare: 3000 }),
      makeTransaction({ finalFare: 5000 }),
    ]
    const report = computeReport(transactions)
    expect(report.averageRevenue).toBe(4000)
  })

  it('rata-rata = 0 jika tidak ada transaksi', () => {
    const report = computeReport([])
    expect(report.averageRevenue).toBe(0)
  })

  it('menghitung jumlah transaksi per metode', () => {
    const transactions = [
      makeTransaction({ method: 'A' }),
      makeTransaction({ method: 'A' }),
      makeTransaction({ method: 'B' }),
    ]
    const report = computeReport(transactions)
    expect(report.methodACount).toBe(2)
    expect(report.methodBCount).toBe(1)
  })

  it('distribusi kategori penumpang benar', () => {
    const transactions = [
      makeTransaction({ passengerCategory: 'umum', finalFare: 3000 }),
      makeTransaction({ passengerCategory: 'pelajar', finalFare: 2700 }),
      makeTransaction({ passengerCategory: 'umum', finalFare: 4000 }),
    ]
    const report = computeReport(transactions)
    const umum = report.categoryDistribution.find((c) => c.category === 'umum')
    const pelajar = report.categoryDistribution.find((c) => c.category === 'pelajar')
    expect(umum?.count).toBe(2)
    expect(pelajar?.count).toBe(1)
    expect(umum?.revenue).toBe(7000)
  })

  it('pendapatan per tanggal dikelompokkan dengan benar', () => {
    const transactions = [
      makeTransaction({ createdAt: '2026-10-29T10:00:00.000Z', finalFare: 3000 }),
      makeTransaction({ createdAt: '2026-10-29T14:00:00.000Z', finalFare: 4000 }),
      makeTransaction({ createdAt: '2026-10-30T10:00:00.000Z', finalFare: 2500 }),
    ]
    const report = computeReport(transactions)
    expect(report.revenueByDate).toHaveLength(2)
    const day1 = report.revenueByDate.find((d) => d.date === '2026-10-29')
    expect(day1?.revenue).toBe(7000)
    expect(day1?.count).toBe(2)
  })

  it('kembalian tidak dihitung sebagai pendapatan', () => {
    const t = makeTransaction({ finalFare: 3000, paymentAmount: 10000, changeAmount: 7000 })
    const report = computeReport([t])
    expect(report.totalRevenue).toBe(3000)
    // changeAmount tidak termasuk
    expect(report.totalRevenue).not.toBe(10000)
  })
})
