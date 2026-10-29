// src/components/charts/RevenueChart.tsx
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { DailyRevenue } from '@/features/reports/report.service'
import { formatRupiah } from '@/lib/currency'
import { TrendingUp } from 'lucide-react'

interface RevenueChartProps {
  data: DailyRevenue[]
}

function formatYAxis(value: number): string {
  if (value >= 1_000_000) return `Rp${(value / 1_000_000).toFixed(1)}jt`
  if (value >= 1_000) return `Rp${(value / 1_000).toFixed(0)}rb`
  return `Rp${value}`
}

export function RevenueChart({ data }: RevenueChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-[hsl(var(--muted-foreground))]">
        <div className="text-center">
          <TrendingUp className="mx-auto h-8 w-8 mb-2 opacity-30" />
          <p className="text-sm">Belum ada data pendapatan</p>
        </div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="dateLabel"
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          axisLine={{ stroke: 'hsl(var(--border))' }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={formatYAxis}
          tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          formatter={(value: unknown) => [formatRupiah(Number(value ?? 0)), 'Pendapatan']}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#2563eb"
          strokeWidth={2}
          fill="url(#revenueGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
