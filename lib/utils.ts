import { SalesRow } from '@/lib/types';

const monthFormatter = new Intl.DateTimeFormat('es-PE', { month: 'long' });
const dayFormatter = new Intl.DateTimeFormat('es-PE', { weekday: 'long' });

export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

// 🔥 SAFE DATE PARSER
const safeDate = (value?: string) => {
  if (!value) return null;

  const date = new Date(`${value}T00:00:00`);
  return isNaN(date.getTime()) ? null : date;
};

// ✅ MES
export const getMonthFromDate = (value?: string) => {
  const date = safeDate(value);
  if (!date) return '';
  return monthFormatter.format(date).toUpperCase();
};

// ✅ DÍA
export const getDayFromDate = (value?: string) => {
  const date = safeDate(value);
  if (!date) return '';
  return dayFormatter.format(date).toUpperCase();
};

// ✅ AÑO
export const getYearFromDate = (value?: string) => {
  const date = safeDate(value);
  if (!date) return '';
  return date.getFullYear().toString();
};

// 🔥 PARSE CURRENCY SEGURO
export const parseCurrency = (value?: string) => {
  if (!value) return 0;

  const sanitized = value
    .toString()
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
  currencyFormatter.format(value ?? 0);

// 🔥 BÚSQUEDA SEGURA (AQUÍ ESTABA TU CRASH)
export const rowMatchesQuery = (row: SalesRow, query: string) => {
  if (!query) return true;

  const normalized = query.toLowerCase();

  const safeString = (val: unknown) =>
    (val ?? '').toString().toLowerCase();

  return Object.values(row).some((value) =>
    safeString(value).includes(normalized)
  );
};