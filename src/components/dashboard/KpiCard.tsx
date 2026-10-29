// src/components/dashboard/KpiCard.tsx
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: string
  subtitle?: string
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
  trend?: number // positive = green, negative = red
}

export function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-[hsl(var(--primary))]',
  iconBg = 'bg-[hsl(var(--primary))]/10',
  trend,
}: KpiCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-[hsl(var(--muted-foreground))]">{title}</p>
            <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
            {subtitle && (
              <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">{subtitle}</p>
            )}
            {trend !== undefined && (
              <div
                className={cn(
                  'mt-2 flex items-center gap-1 text-xs font-medium',
                  trend >= 0 ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--destructive))]'
                )}
              >
                {trend >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{Math.abs(trend)}%</span>
              </div>
            )}
          </div>
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', iconBg)}>
            <Icon className={cn('h-6 w-6', iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
