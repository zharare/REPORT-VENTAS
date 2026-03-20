export type InvoiceStatus = 'Sí' | 'No' | '';
export type PaymentStatus = 'Contado' | 'Crédito' | 'Pendiente' | '';

export type SalesRow = {
  id: string;
  cod: string;
  cliente: string;
  contacto: string;
  numero: string;
  distrito: string;
  servicio: string;
  grupos: string;
  dia: string;
  fecha: string;
  mes: string;
  total: string;
  facturado: InvoiceStatus;
  numeroFactura: string;
  emisionCertificadosFisico: string;
  pagoCredito: PaymentStatus;
};

export type SalesTab = {
  id: string;
  name: string;
  color: string;
};

export type UiPreferences = {
  darkMode: boolean;
};

export type CRMState = {
  tabs: SalesTab[];
  activeTabId: string;
  tableData: Record<string, SalesRow[]>;
  ui: UiPreferences;
};

export type KPIData = {
  totalVentas: number;
  totalFacturado: number;
  ventasDelMes: number;
  numeroClientes: number;
  ticketPromedio: number;
  porcentajeFacturado: number;
};

export type FilterState = {
  month: string;
  year: string;
  search: string;
};
