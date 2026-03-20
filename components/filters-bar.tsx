'use client';

import { Plus, Search, SlidersHorizontal } from 'lucide-react';
import { MONTH_OPTIONS } from '@/lib/constants';
import { FilterState, SalesRow } from '@/lib/types';
import { getYearFromDate } from '@/lib/utils';

export const FiltersBar = ({
  filters,
  rows,
  onChange,
  onAddRow,
}: {
  filters: FilterState;
  rows: SalesRow[];
  onChange: (filters: FilterState) => void;
  onAddRow: () => void;
}) => {
  const years = Array.from(new Set(rows.map((row) => getYearFromDate(row.fecha)).filter(Boolean))).sort();

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-[24px] border border-slate-200 bg-slate-50/70 p-4 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex flex-1 flex-col gap-3 md:flex-row">
        <label className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={filters.search}
            onChange={(event) => onChange({ ...filters, search: event.target.value })}
            placeholder="Buscar en todas las columnas..."
            className="w-full border-none bg-transparent outline-none"
          />
        </label>

        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
          <SlidersHorizontal className="h-4 w-4 text-slate-400" />
          <select
            value={filters.month}
            onChange={(event) => onChange({ ...filters, month: event.target.value })}
            className="bg-transparent outline-none"
          >
            {MONTH_OPTIONS.map((month) => (
              <option key={month || 'all'} value={month}>
                {month || 'Todos los meses'}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
          <SlidersHorizontal className="h-4 w-4 text-slate-400" />
          <select
            value={filters.year}
            onChange={(event) => onChange({ ...filters, year: event.target.value })}
            className="bg-transparent outline-none"
          >
            <option value="">Todos los años</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        type="button"
        onClick={onAddRow}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-primary/90"
      >
        <Plus className="h-4 w-4" />
        Agregar fila
      </button>
    </div>
  );
};
