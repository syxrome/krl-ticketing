// src/features/reports/report.service.ts
// Layanan laporan pendapatan

import type { Transaction } from '../transactions/transaction.types'
import { formatDateKey, formatDateLabel } from '@/lib/date'

export interface ReportSummary {
  totalTransactions: number
  totalRevenue: number
  totalDiscount: number
  averageRevenue: number
  methodACount: number
  methodBCount: number
  categoryDistribution: CategoryStat[]
  revenueByDate: DailyRevenue[]
}

export interface CategoryStat {
  category: string
  label: string
  count: number
  revenue: number
  percentage: number
}

export interface DailyRevenue {
  date: string
  dateLabel: string
  revenue: number
  count: number
}

const CATEGORY_LABELS: Record<string, string> = {
  umum: 'Umum',
  pelajar: 'Pelajar',
  lansia: 'Lansia',
  anak: 'Anak-anak',
}

/**
 * Hitung laporan dari daftar transaksi
 */
export function computeReport(transactions: Transaction[]): ReportSummary {
  if (transactions.length === 0) {
    return {
      totalTransactions: 0,
      totalRevenue: 0,
      totalDiscount: 0,
      averageRevenue: 0,
      methodACount: 0,
      methodBCount: 0,
      categoryDistribution: [],
      revenueByDate: [],
    }
  }

  // Total pendapatan (finalFare, bukan paymentAmount)
  const totalRevenue = transactions.reduce((sum, t) => sum + t.finalFare, 0)
  const totalDiscount = transactions.reduce((sum, t) => sum + t.discountAmount, 0)
  const averageRevenue = transactions.length > 0 ? Math.round(totalRevenue / transactions.length) : 0

  const methodACount = transactions.filter((t) => t.method === 'A').length
  const methodBCount = transactions.filter((t) => t.method === 'B').length

  // Distribusi kategori
  const categoryMap = new Map<string, { count: number; revenue: number }>()
  for (const t of transactions) {
    const existing = categoryMap.get(t.passengerCategory) ?? { count: 0, revenue: 0 }
    categoryMap.set(t.passengerCategory, {
      count: existing.count + 1,
      revenue: existing.revenue + t.finalFare,
    })
  }

  const categoryDistribution: CategoryStat[] = Array.from(categoryMap.entries()).map(
    ([category, { count, revenue }]) => ({
      category,
      label: CATEGORY_LABELS[category] ?? category,
      count,
      revenue,
      percentage: Math.round((count / transactions.length) * 100),
    })
  )

  // Pendapatan per tanggal
  const dateMap = new Map<string, { revenue: number; count: number }>()
  for (const t of transactions) {
    const key = formatDateKey(t.createdAt)
    const existing = dateMap.get(key) ?? { revenue: 0, count: 0 }
    dateMap.set(key, {
      revenue: existing.revenue + t.finalFare,
      count: existing.count + 1,
    })
  }

  const revenueByDate: DailyRevenue[] = Array.from(dateMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, { revenue, count }]) => ({
      date,
      dateLabel: formatDateLabel(date),
      revenue,
      count,
    }))

  return {
    totalTransactions: transactions.length,
    totalRevenue,
    totalDiscount,
    averageRevenue,
    methodACount,
    methodBCount,
    categoryDistribution,
    revenueByDate,
  }
}
