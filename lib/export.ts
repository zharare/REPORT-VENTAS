import * as XLSX from 'xlsx';
import { SalesRow, SalesTab } from '@/lib/types';

export const exportRowsToExcel = (tab: SalesTab, rows: SalesRow[]) => {
  const worksheet = XLSX.utils.json_to_sheet(
    rows.map((row) => ({
      COD: row.cod,
      CLIENTE: row.cliente,
      CONTACTO: row.contacto,
      NÚMERO: row.numero,
      DISTRITO: row.distrito,
      SERVICIO: row.servicio,
      GRUPOS: row.grupos,
      DÍA: row.dia,
      FECHA: row.fecha,
      MES: row.mes,
      'TOTAL S/. (NO Inc. IGV)': row.total,
      FACTURADO: row.facturado,
      'N° FACTURA': row.numeroFactura,
      'EMISIÓN CERTIFICADOS FISICO': row.emisionCertificadosFisico,
      'PAGO y CRÉDITO': row.pagoCredito,
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, tab.name);
  XLSX.writeFile(workbook, `CONSITEC_${tab.name}_ventas.xlsx`);
};
