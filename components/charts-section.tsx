'use client';

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCurrency } from '@/lib/utils';

export const ChartsSection = ({
  monthlySales,
  salesByAgent,
}: {
  monthlySales: Array<{ month: string; total: number }>;
  salesByAgent: Array<{ agent: string; total: number; color: string }>;
}) => (
  <section className="grid gap-5 xl:grid-cols-[1.35fr,1fr]">
    <article className="rounded-[28px] bg-white/95 p-5 shadow-panel backdrop-blur">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/60">Analytics</p>
          <h3 className="mt-1 text-xl font-semibold text-primary">Ventas por mes</h3>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlySales}>
            <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#E6E8F2" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickFormatter={(value) => `S/${value}`} tickLine={false} axisLine={false} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Bar dataKey="total" radius={[12, 12, 0, 0]} fill="#FF8000" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>

    <article className="rounded-[28px] bg-white/95 p-5 shadow-panel backdrop-blur">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/60">Performance</p>
        <h3 className="mt-1 text-xl font-semibold text-primary">Ventas por comercial</h3>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={salesByAgent} layout="vertical" margin={{ left: 16 }}>
            <CartesianGrid horizontal={false} strokeDasharray="4 4" stroke="#E6E8F2" />
            <XAxis type="number" tickFormatter={(value) => `S/${value}`} tickLine={false} axisLine={false} />
            <YAxis dataKey="agent" type="category" tickLine={false} axisLine={false} width={90} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Bar dataKey="total" radius={[0, 12, 12, 0]}>
              {salesByAgent.map((entry) => (
                <Cell key={entry.agent} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  </section>
);
