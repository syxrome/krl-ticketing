// src/components/layout/Sidebar.tsx
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Calculator,
  CreditCard,
  History,
  BarChart3,
  BookOpen,
  Settings,
  Train,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/kalkulator', label: 'Kalkulator Tarif', icon: Calculator },
  { href: '/transaksi', label: 'Transaksi Tiket', icon: CreditCard },
  { href: '/riwayat', label: 'Riwayat Transaksi', icon: History },
  { href: '/laporan', label: 'Laporan Pendapatan', icon: BarChart3 },
  { href: '/dokumentasi', label: 'Dokumentasi Algoritma', icon: BookOpen },
  { href: '/pengaturan', label: 'Pengaturan Simulasi', icon: Settings },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-64 bg-[hsl(var(--card))] border-r border-[hsl(var(--border))] transition-transform duration-300 lg:relative lg:translate-x-0 lg:z-auto flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-[hsl(var(--border))]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(var(--primary))]">
              <Train className="h-5 w-5 text-[hsl(var(--primary-foreground))]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[hsl(var(--foreground))] leading-none">KRL Fare</p>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">Simulator</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-[hsl(var(--accent))] transition-colors"
            aria-label="Tutup sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                    : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[hsl(var(--border))]">
          <p className="text-xs text-[hsl(var(--muted-foreground))] text-center">
            Simulasi Akademik — Bukan Tarif Resmi KRL
          </p>
        </div>
      </aside>
    </>
  )
}
