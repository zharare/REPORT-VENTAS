import { MONTH_OPTIONS } from '@/lib/constants';
import { KPIData, SalesRow, SalesTab } from '@/lib/types';
import { getMonthFromDate, parseCurrency } from '@/lib/utils';

export const calculateKpis = (rows: SalesRow[]): KPIData => {
  const currentMonth = getMonthFromDate(new Date().toISOString().slice(0, 10));
  const totalVentas = rows.reduce((sum, row) => sum + parseCurrency(row.total), 0);
  const totalFacturado = rows
    .filter((row) => row.facturado === 'Sí')
    .reduce((sum, row) => sum + parseCurrency(row.total), 0);
  const ventasDelMes = rows
    .filter((row) => row.mes === currentMonth)
    .reduce((sum, row) => sum + parseCurrency(row.total), 0);
  const numeroClientes = new Set(rows.map((row) => row.cliente.trim()).filter(Boolean)).size;
  const rowsWithTotal = rows.filter((row) => parseCurrency(row.total) > 0);
  const ticketPromedio = rowsWithTotal.length ? totalVentas / rowsWithTotal.length : 0;
  const porcentajeFacturado = totalVentas ? (totalFacturado / totalVentas) * 100 : 0;

  return {
    totalVentas,
    totalFacturado,
    ventasDelMes,
    numeroClientes,
    ticketPromedio,
    porcentajeFacturado,
  };
};

export const getMonthlySales = (rows: SalesRow[]) => {
  const data = rows.reduce<Record<string, number>>((acc, row) => {
    if (!row.mes) return acc;
    acc[row.mes] = (acc[row.mes] ?? 0) + parseCurrency(row.total);
    return acc;
  }, {});

  return Object.entries(data)
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => MONTH_OPTIONS.indexOf(a.month) - MONTH_OPTIONS.indexOf(b.month));
};

export const getSalesByAgent = (tabs: SalesTab[], tableData: Record<string, SalesRow[]>) =>
  tabs.map((tab) => ({
    agent: tab.name,
    total: (tableData[tab.id] ?? []).reduce((sum, row) => sum + parseCurrency(row.total), 0),
    color: tab.color,
  }));
