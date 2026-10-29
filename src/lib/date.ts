// src/lib/date.ts

/**
 * Format tanggal ke format Indonesia lengkap
 */
export function formatDateIndonesia(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Jakarta',
  }).format(date)
}

/**
 * Format tanggal singkat (tanpa jam)
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(date)
}

/**
 * Format hanya tanggal untuk grouping laporan
 */
export function formatDateKey(dateString: string): string {
  const date = new Date(dateString)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Format tanggal untuk ditampilkan di laporan
 */
export function formatDateLabel(dateKey: string): string {
  const date = new Date(dateKey + 'T00:00:00')
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
  }).format(date)
}

/**
 * Ambil tanggal hari ini dalam format YYYY-MM-DD
 */
export function todayKey(): string {
  return formatDateKey(new Date().toISOString())
}
