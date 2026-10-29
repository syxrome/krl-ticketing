// src/tests/ui.test.tsx
import '@testing-library/jest-dom/vitest'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { TransactionProvider } from '@/context/TransactionContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { FareCalculatorPage } from '@/pages/FareCalculatorPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { HistoryPage } from '@/pages/HistoryPage'
import { TransactionPage } from '@/pages/TransactionPage'

describe('UI Testing Suite', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('FareCalculatorPage — Dynamic Form & Calculation', () => {
    it('menampilkan input jumlah stasiun saat metode A aktif secara default', () => {
      render(
        <MemoryRouter>
          <FareCalculatorPage />
        </MemoryRouter>
      )

      expect(screen.getByLabelText(/Jumlah Stasiun/i)).toBeInTheDocument()
      expect(screen.queryByLabelText(/Jarak \(km\)/i)).not.toBeInTheDocument()
    })

    it('berpindah ke input kilometer saat metode B dipilih', async () => {
      render(
        <MemoryRouter>
          <FareCalculatorPage />
        </MemoryRouter>
      )

      const methodBButton = screen.getByText(/Jarak Kilometer/i).closest('button')
      expect(methodBButton).toBeInTheDocument()
      if (methodBButton) fireEvent.click(methodBButton)

      await waitFor(() => {
        expect(screen.getByLabelText(/Jarak \(km\)/i)).toBeInTheDocument()
        expect(screen.queryByLabelText(/Jumlah Stasiun/i)).not.toBeInTheDocument()
      })
    })

    it('menampilkan hasil perhitungan tarif yang akurat', async () => {
      render(
        <MemoryRouter>
          <FareCalculatorPage />
        </MemoryRouter>
      )

      const input = screen.getByLabelText(/Jumlah Stasiun/i)
      fireEvent.change(input, { target: { value: '10' } })

      const hitungButton = screen.getByRole('button', { name: /Hitung Tarif/i })
      fireEvent.click(hitungButton)

      await waitFor(() => {
        expect(screen.getByText(/Rincian Perhitungan/i)).toBeInTheDocument()
        // 10 stasiun = 2000 + 2*500 = 3000
        expect(screen.getAllByText(/Rp\s*3\.000/i).length).toBeGreaterThan(0)
      })
    })
  })

  describe('DashboardPage — Empty State & KPI', () => {
    it('menampilkan empty state ketika belum ada riwayat transaksi', () => {
      render(
        <ThemeProvider>
          <TransactionProvider>
            <MemoryRouter>
              <DashboardPage />
            </MemoryRouter>
          </TransactionProvider>
        </ThemeProvider>
      )

      expect(screen.getByText(/Belum Ada Data Transaksi/i)).toBeInTheDocument()
      expect(screen.getByText(/Buat Transaksi Pertama/i)).toBeInTheDocument()
    })
  })

  describe('HistoryPage — Filter & Empty State', () => {
    it('menampilkan empty state ketika riwayat transaksi kosong', () => {
      render(
        <ThemeProvider>
          <TransactionProvider>
            <MemoryRouter>
              <HistoryPage />
            </MemoryRouter>
          </TransactionProvider>
        </ThemeProvider>
      )

      expect(screen.getByText(/Belum Ada Riwayat Transaksi/i)).toBeInTheDocument()
    })
  })

  describe('TransactionPage — Step Flow & Cancellation', () => {
    it('dapat berpindah dari DRAFT ke REVIEW dan membatalkan transaksi', async () => {
      render(
        <ThemeProvider>
          <TransactionProvider>
            <MemoryRouter>
              <TransactionPage />
            </MemoryRouter>
          </TransactionProvider>
        </ThemeProvider>
      )

      // Step 1: Draft
      const input = screen.getByLabelText(/Jumlah Stasiun/i)
      fireEvent.change(input, { target: { value: '8' } })

      const continueBtn = screen.getByRole('button', { name: /Hitung & Lanjutkan/i })
      fireEvent.click(continueBtn)

      // Step 2: Review
      await waitFor(() => {
        expect(screen.getByText(/Konfirmasi Perjalanan/i)).toBeInTheDocument()
      })

      // Klik tombol batalkan (icon button destructive)
      const cancelButton = screen.getByRole('button', { name: '' })
      fireEvent.click(cancelButton)

      // State: CANCELLED
      await waitFor(() => {
        expect(screen.getByText(/Transaksi Dibatalkan/i)).toBeInTheDocument()
        expect(screen.getByText(/Mulai Transaksi Baru/i)).toBeInTheDocument()
      })
    })
  })
})
