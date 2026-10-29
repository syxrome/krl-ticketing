// src/components/layout/Header.tsx
import { Menu, Moon, Sun, Train } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  onMenuToggle: () => void
  pageTitle: string
}

export function Header({ onMenuToggle, pageTitle }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/95 backdrop-blur px-4 lg:px-6">
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-md hover:bg-[hsl(var(--accent))] transition-colors"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile brand */}
      <div className="flex items-center gap-2 lg:hidden">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[hsl(var(--primary))]">
          <Train className="h-4 w-4 text-[hsl(var(--primary-foreground))]" />
        </div>
        <span className="font-semibold text-sm">KRL Fare Simulator</span>
      </div>

      {/* Page title desktop */}
      <div className="hidden lg:block">
        <h1 className="text-lg font-semibold">{pageTitle}</h1>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle tema"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </header>
  )
}
