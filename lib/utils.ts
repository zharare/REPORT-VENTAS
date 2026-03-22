import { SalesRow } from '@/lib/types';

const monthFormatter = new Intl.DateTimeFormat('es-PE', { month: 'long' });
const dayFormatter = new Intl.DateTimeFormat('es-PE', { weekday: 'long' });

export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

// 🔥 SEGURIDAD TOTAL EN FECHAS
export const getMonthFromDate = (value?: string) => {
  if (!value) return '';
  const date = new Date(`${value}T00:00:00`);
  if (isNaN(date.getTime())) return '';
  return monthFormatter.format(date).toUpperCase();
};

export const getDayFromDate = (value?: string) => {
  if (!value) return '';
  const date = new Date(`${value}T00:00:00`);
  if (isNaN(date.getTime())) return '';
  return dayFormatter.format(date).toUpperCase();
};

export const getYearFromDate = (value?: string) => {
  if (!value) return '';
  const date = new Date(`${value}T00:00:00`);
  if (isNaN(date.getTime())) return '';
  return date.getFullYear().toString();
};

// 🔥 AQUÍ ESTABA UNO DE LOS CRASH
export const parseCurrency = (value?: string | null) => {
  if (!value) return 0;

  const sanitized = String(value)
    .replace(/[^\d.,-]/g, '')
    .replace(',', '.');

  const parsed = Number.parseFloat(sanitized);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const currencyFormatter = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
  maximumFractionDigits: 2,
});

export const formatCurrency = (value: number) =>
  currencyFormatter.format(value);

// 🔥 ESTE ERA EL ERROR DE .trim()
export const rowMatchesQuery = (row: SalesRow, query: string) => {
  if (!query) return true;

  const normalized = String(query).trim().toLowerCase();
  if (!normalized) return true;

  return Object.values(row ?? {}).some((value) => {
    if (value === null || value === undefined) return false;
    return String(value).toLowerCase().includes(normalized);
  });
};