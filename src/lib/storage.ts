// src/lib/storage.ts
// Versioned localStorage management

export const STORAGE_VERSION = '1'

export const STORAGE_KEYS = {
  TRANSACTIONS: 'krl_simulator_transactions',
  SETTINGS: 'krl_simulator_settings',
  THEME: 'krl_simulator_theme',
  VERSION: 'krl_simulator_version',
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

/**
 * Cek apakah localStorage tersedia
 */
function isStorageAvailable(): boolean {
  try {
    const key = '__krl_test__'
    localStorage.setItem(key, '1')
    localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}

/**
 * Baca data dari localStorage dengan validasi
 */
export function storageGet<T>(key: string, fallback: T): T {
  if (!isStorageAvailable()) return fallback
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    const parsed = JSON.parse(raw) as T
    return parsed
  } catch {
    // Data rusak, kembalikan fallback
    return fallback
  }
}

/**
 * Tulis data ke localStorage
 */
export function storageSet<T>(key: string, value: T): boolean {
  if (!isStorageAvailable()) return false
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (e) {
    // Storage penuh atau error lain
    console.warn('KRL Storage: gagal menyimpan data', e)
    return false
  }
}

/**
 * Hapus data dari localStorage
 */
export function storageRemove(key: string): void {
  if (!isStorageAvailable()) return
  try {
    localStorage.removeItem(key)
  } catch {
    // ignore
  }
}

/**
 * Hapus seluruh data simulasi KRL
 */
export function storageClearAll(): void {
  if (!isStorageAvailable()) return
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key)
    })
  } catch {
    // ignore
  }
}

/**
 * Periksa versi storage, jika berbeda bersihkan data lama
 */
export function checkStorageVersion(): void {
  const stored = storageGet<string>(STORAGE_KEYS.VERSION, '')
  if (stored !== STORAGE_VERSION) {
    // Migrasi: hapus data lama yang tidak kompatibel
    storageRemove(STORAGE_KEYS.TRANSACTIONS)
    storageSet(STORAGE_KEYS.VERSION, STORAGE_VERSION)
  }
}
