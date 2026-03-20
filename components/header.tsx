'use client';

import { Download } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { SalesTab } from '@/lib/types';

export const Header = ({
  activeTab,
  onExport
}: {
  activeTab?: SalesTab;
  onExport: () => void;
}) => {
  const today = format(new Date(), "EEEE, d 'de' MMMM yyyy", { locale: es });

  return (
    <header className="rounded-[32px] bg-white/95 px-6 py-6 shadow-panel backdrop-blur">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">CONSITEC CRM PRO</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary md:text-4xl">
            CONSITEC - Registro de Ventas
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">{today}</span>
            {activeTab && (
              <span className="rounded-full px-3 py-1 font-medium text-white" style={{ backgroundColor: activeTab.color }}>
                Comercial activo: {activeTab.name}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onExport}
            className="inline-flex items-center gap-2 rounded-2xl bg-accent px-5 py-3 font-semibold text-white shadow-lg shadow-accent/20 transition hover:-translate-y-0.5 hover:bg-accent/90"
          >
            <Download className="h-4 w-4" />
            Exportar a Excel
          </button>
        </div>
      </div>
    </header>
  );
};
