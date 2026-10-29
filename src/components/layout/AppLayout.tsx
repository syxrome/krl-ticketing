// src/components/layout/AppLayout.tsx
import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/kalkulator': 'Kalkulator Tarif',
  '/transaksi': 'Transaksi Tiket',
  '/riwayat': 'Riwayat Transaksi',
  '/laporan': 'Laporan Pendapatan',
  '/dokumentasi': 'Dokumentasi Algoritma',
  '/pengaturan': 'Pengaturan Simulasi',
}

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const pageTitle = PAGE_TITLES[location.pathname] ?? 'KRL Fare Simulator'

  return (
    <div className="flex h-screen overflow-hidden bg-[hsl(var(--background))]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          onMenuToggle={() => setSidebarOpen((o) => !o)}
          pageTitle={pageTitle}
        />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
