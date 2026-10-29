// src/context/TransactionContext.tsx
// Global state management untuk transaksi

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { Transaction } from '@/features/transactions/transaction.types'
import { loadTransactions, saveTransaction, clearTransactions } from '@/features/transactions/transaction.service'
import { checkStorageVersion } from '@/lib/storage'

interface TransactionContextValue {
  transactions: Transaction[]
  addTransaction: (t: Transaction) => boolean
  clearAll: () => boolean
  refresh: () => void
  isLoading: boolean
}

const TransactionContext = createContext<TransactionContextValue | null>(null)

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(() => {
    setIsLoading(true)
    try {
      const data = loadTransactions()
      setTransactions(data)
    } catch {
      setTransactions([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    checkStorageVersion()
    refresh()
  }, [refresh])

  const addTransaction = useCallback((t: Transaction): boolean => {
    const success = saveTransaction(t)
    if (success) {
      setTransactions((prev) => [t, ...prev])
    }
    return success
  }, [])

  const clearAll = useCallback((): boolean => {
    const success = clearTransactions()
    if (success) {
      setTransactions([])
    }
    return success
  }, [])

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, clearAll, refresh, isLoading }}>
      {children}
    </TransactionContext.Provider>
  )
}

export function useTransactions() {
  const ctx = useContext(TransactionContext)
  if (!ctx) throw new Error('useTransactions harus digunakan di dalam TransactionProvider')
  return ctx
}
