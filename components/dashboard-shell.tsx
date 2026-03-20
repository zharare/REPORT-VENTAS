'use client';

import { supabase } from '../lib/supabase';
import { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/header';
import { KpiCards } from '@/components/kpi-cards';
import { ChartsSection } from '@/components/charts-section';
import { FiltersBar } from '@/components/filters-bar';
import { SalesTable } from '@/components/sales-table';
import { SalesTabs } from '@/components/sales-tabs';
import { useHydrated } from '@/hooks/use-hydrated';
import { exportRowsToExcel } from '@/lib/export';
import { calculateKpis, getMonthlySales, getSalesByAgent } from '@/lib/metrics';
import { FilterState } from '@/lib/types';
import { getYearFromDate, rowMatchesQuery } from '@/lib/utils';
import { useCrmStore } from '@/store/crm-store';

const DEFAULT_FILTERS: FilterState = {
  month: '',
  year: '',
  search: '',
};

export const DashboardShell = () => {
  const mounted = useHydrated();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const {
    hydrated,
    hydrateFromStorage,
    tabs,
    activeTabId,
    tableData,
    setActiveTab,
    addRow,
    updateCell,
    deleteRow,
  } = useCrmStore();

  // 🔹 carga local
  useEffect(() => {
    if (mounted && !hydrated) {
      hydrateFromStorage();
    }
  }, [mounted, hydrated, hydrateFromStorage]);

  // 🔥 carga desde Supabase
  useEffect(() => {
    const loadFromSupabase = async () => {
      const { data, error } = await supabase.from('sales').select('*');

      if (error) {
        console.log('❌ Error:', error);
        return;
      }

      if (data && data.length > 0) {
        const formatted: Record<string, any[]> = {};

        data.forEach((item) => {
          formatted[item.tab] = item.data;
        });

        useCrmStore.setState({
          tableData: formatted,
        });

        console.log('🔥 Datos cargados desde Supabase');
      }
    };

    loadFromSupabase();
  }, []);

  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];
  const activeRows = activeTab ? tableData[activeTab.id] ?? [] : [];

  const filteredRows = useMemo(
    () =>
      activeRows.filter((row) => {
        const matchesMonth = filters.month ? row.mes === filters.month : true;
        const matchesYear = filters.year
          ? getYearFromDate(row.fecha) === filters.year
          : true;
        const matchesSearch = rowMatchesQuery(row, filters.search);
        return matchesMonth && matchesYear && matchesSearch;
      }),
    [activeRows, filters]
  );

  const kpis = useMemo(() => calculateKpis(activeRows), [activeRows]);
  const monthlySales = useMemo(() => getMonthlySales(activeRows), [activeRows]);
  const salesByAgent = useMemo(
    () => getSalesByAgent(tabs, tableData),
    [tabs, tableData]
  );

  if (!mounted || !hydrated || !activeTab) {
    return <div className="min-h-screen bg-surface" />;
  }

  return (
    <main>
      <div className="min-h-screen bg-transparent px-4 py-6 text-slate-900 md:px-8 lg:px-10">
        <div className="mx-auto flex max-w-[1800px] flex-col gap-6">
          <Header
            activeTab={activeTab}
            onExport={() => exportRowsToExcel(activeTab, activeRows)}
          />

          <KpiCards kpis={kpis} />

          <ChartsSection
            monthlySales={monthlySales}
            salesByAgent={salesByAgent}
          />

          <section className="rounded-[28px] bg-white p-5 shadow-panel xl:p-6">
            <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:justify-between">
              <div>
                <p className="text-sm uppercase text-primary/60">
                  Centro de control
                </p>
                <h2 className="text-2xl font-semibold text-primary">
                  Pipeline comercial editable
                </h2>
              </div>

              <SalesTabs
                activeTabId={activeTabId}
                onTabChange={setActiveTab}
              />
            </div>

            <FiltersBar
              filters={filters}
              rows={activeRows}
              onChange={setFilters}
              onAddRow={() => activeTab && addRow(activeTab.id)}
            />

            <SalesTable
              rows={filteredRows}
              activeTabId={activeTab.id}
              onCellChange={updateCell}
              onDeleteRow={deleteRow}
            />
          </section>
        </div>
      </div>
    </main>
  );
};