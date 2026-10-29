// src/lib/currency.ts

/**
 * Format angka ke format mata uang Rupiah Indonesia
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format angka ke format singkat Rupiah (tanpa simbol)
 */
export function formatRupiahShort(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Parse string rupiah ke number (hapus titik dan koma)
 */
export function parseRupiah(value: string): number {
  const cleaned = value.replace(/[^0-9]/g, '')
  return parseInt(cleaned, 10) || 0
}
