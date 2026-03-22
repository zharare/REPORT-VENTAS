import { SalesRow, SalesTab } from '@/lib/types';

export const TAB_COLORS = ['#403F6F', '#FF8000', '#16A34A', '#0EA5E9', '#DB2777', '#7C3AED'];

export const DEFAULT_TABS: SalesTab[] = [
  { id: 'abigail', name: 'ABIGAIL', color: '#403F6F' },
  { id: 'mayerli', name: 'MAYERLI', color: '#FF8000' },
  { id: 'crithian', name: 'CRITHIAN', color: '#16A34A' },
  { id: 'ingrid', name: 'INGRID', color: '#0EA5E9' },
  { id: 'fiorella', name: 'FIORELLA', color: '#DB2777' },
];

export const MONTH_OPTIONS = [
  '',
  'ENERO',
  'FEBRERO',
  'MARZO',
  'ABRIL',
  'MAYO',
  'JUNIO',
  'JULIO',
  'AGOSTO',
  'SEPTIEMBRE',
  'OCTUBRE',
  'NOVIEMBRE',
  'DICIEMBRE',
];

export const FACTURADO_OPTIONS = ['', 'Sí', 'No'] as const;
export const PAGO_CREDITO_OPTIONS = ['', 'Contado', 'Crédito', 'Pendiente'] as const;

export const TABLE_COLUMNS = [
  { key: 'cod', label: 'COD', type: 'text' },
  { key: 'cliente', label: 'CLIENTE', type: 'text' },
  { key: 'contacto', label: 'CONTACTO', type: 'text' },
  { key: 'numero', label: 'NÚMERO', type: 'text' },
  { key: 'distrito', label: 'DISTRITO', type: 'text' },
  { key: 'servicio', label: 'SERVICIO', type: 'text' },
  { key: 'grupos', label: 'GRUPOS', type: 'number' },
  { key: 'dia', label: 'DÍA', type: 'text', readOnly: true },
  { key: 'fecha', label: 'FECHA', type: 'date' },
  { key: 'mes', label: 'MES', type: 'month' },
  { key: 'total', label: 'TOTAL S/. (NO Inc. IGV)', type: 'number' },
  { key: 'facturado', label: 'FACTURADO', type: 'select' },
  { key: 'numeroFactura', label: 'N° FACTURA', type: 'text' },
  { key: 'emisionCertificadosFisico', label: 'EMISIÓN CERTIFICADOS FISICO', type: 'text' },
  { key: 'pagoCredito', label: 'PAGO y CRÉDITO', type: 'payment' },
] as TableColumn[];

export const STORAGE_KEY = 'consitec-crm-pro-store';

export const createEmptyRow = (id?: string): SalesRow => ({
  id: id ?? crypto.randomUUID(),
  cod: '',
  cliente: '',
  contacto: '',
  numero: '',
  distrito: '',
  servicio: '',
  grupos: '',
  dia: '',
  fecha: '',
  mes: '',
  total: '',
  facturado: '',
  numeroFactura: '',
  emisionCertificadosFisico: '',
  pagoCredito: '',
});

export const createInitialRows = (count = 50) =>
  Array.from({ length: count }, (_, index) => createEmptyRow(`seed-${index + 1}`));

export const INITIAL_TABLE_DATA = DEFAULT_TABS.reduce<Record<string, SalesRow[]>>((acc, tab) => {
  acc[tab.id] = createInitialRows();
  return acc;
}, {});
