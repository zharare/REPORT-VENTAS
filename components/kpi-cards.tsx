import { BarChart3, Calculator, CircleDollarSign, FileCheck2, Percent, UsersRound } from 'lucide-react';
import { KPIData } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

const cards = [
  { key: 'totalVentas', title: 'Total Ventas', icon: CircleDollarSign },
  { key: 'totalFacturado', title: 'Total Facturado', icon: FileCheck2 },
  { key: 'ventasDelMes', title: 'Ventas del Mes', icon: BarChart3 },
  { key: 'numeroClientes', title: 'Número de Clientes', icon: UsersRound },
  { key: 'ticketPromedio', title: 'Ticket Promedio', icon: Calculator },
  { key: 'porcentajeFacturado', title: '% Facturado', icon: Percent },
] as const;

export const KpiCards = ({ kpis }: { kpis: KPIData }) => (
  <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-6">
    {cards.map((card) => {
      const Icon = card.icon;
      const value =
        card.key === 'numeroClientes'
          ? kpis[card.key]
          : card.key === 'porcentajeFacturado'
            ? `${kpis[card.key].toFixed(1)}%`
            : formatCurrency(kpis[card.key]);

      return (
        <article
          key={card.key}
          className="rounded-[28px] bg-white/95 p-5 shadow-panel backdrop-blur transition hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Live</span>
          </div>
          <p className="mt-5 text-sm font-medium text-slate-500">{card.title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-primary">{value}</p>
        </article>
      );
    })}
  </section>
);
