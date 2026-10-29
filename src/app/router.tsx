// src/app/router.tsx
import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { DashboardPage } from '@/pages/DashboardPage'
import { FareCalculatorPage } from '@/pages/FareCalculatorPage'
import { TransactionPage } from '@/pages/TransactionPage'
import { HistoryPage } from '@/pages/HistoryPage'
import { RevenuePage } from '@/pages/RevenuePage'
import { AlgorithmPage } from '@/pages/AlgorithmPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'kalkulator', element: <FareCalculatorPage /> },
      { path: 'transaksi', element: <TransactionPage /> },
      { path: 'riwayat', element: <HistoryPage /> },
      { path: 'laporan', element: <RevenuePage /> },
      { path: 'dokumentasi', element: <AlgorithmPage /> },
      { path: 'pengaturan', element: <SettingsPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
