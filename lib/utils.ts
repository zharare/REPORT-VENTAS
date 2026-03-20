import { SalesRow } from '@/lib/types';

const monthFormatter = new Intl.DateTimeFormat('es-PE', { month: 'long' });
const dayFormatter = new Intl.DateTimeFormat('es-PE', { weekday: 'long' });

export const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

export const getMonthFromDate = (value: string) => {
  if (!value) return '';
  const date = new Date(`${value}T00:00:00`);
  return monthFormatter.format(date).toUpperCase();
};

export const getDayFromDate = (value: string) => {
  if (!value) return '';
  const date = new Date(`${value}T00:00:00`);
  return dayFormatter.format(date).toUpperCase();
};

export const getYearFromDate = (value: string) => {
  if (!value) return '';
  return new Date(`${value}T00:00:00`).getFullYear().toString();
};

export const parseCurrency = (value: string) => {
  const sanitized = value.replace(/[^\d.,-]/g, '').replace(',', '.');
  const parsed = Number.parseFloat(sanitized);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const currencyFormatter = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
  maximumFractionDigits: 2,
});

export const formatCurrency = (value: number) => currencyFormatter.format(value);

export const rowMatchesQuery = (row: SalesRow, query: string) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  return Object.values(row).some((value) => String(value).toLowerCase().includes(normalized));
};
