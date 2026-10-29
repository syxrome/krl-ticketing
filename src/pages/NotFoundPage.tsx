// src/pages/NotFoundPage.tsx
import { Link } from 'react-router-dom'
import { Train, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 text-center p-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[hsl(var(--primary))]/10">
        <Train className="h-10 w-10 text-[hsl(var(--primary))]" />
      </div>
      <div>
        <h1 className="text-6xl font-bold text-[hsl(var(--muted-foreground))]">404</h1>
        <h2 className="mt-2 text-2xl font-semibold">Halaman Tidak Ditemukan</h2>
        <p className="mt-2 text-[hsl(var(--muted-foreground))]">
          Halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
      </div>
      <Button asChild>
        <Link to="/">
          <Home className="h-4 w-4" />
          Kembali ke Dashboard
        </Link>
      </Button>
    </div>
  )
}
