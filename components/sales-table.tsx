'use client';

import { Trash2 } from 'lucide-react';
import { FACTURADO_OPTIONS, MONTH_OPTIONS, PAGO_CREDITO_OPTIONS, TABLE_COLUMNS } from '@/lib/constants';
import { SalesRow } from '@/lib/types';
import { cn } from '@/lib/utils';

const inputBaseClass =
  'w-full min-w-[120px] rounded-xl border border-transparent bg-transparent px-3 py-2 text-sm outline-none transition focus:border-primary/30 focus:bg-white focus:shadow-sm';

export const SalesTable = ({
  rows,
  activeTabId,
  onCellChange,
  onDeleteRow,
}: {
  rows: SalesRow[];
  activeTabId: string;
  onCellChange: (tabId: string, rowId: string, field: keyof SalesRow, value: string) => void;
  onDeleteRow: (tabId: string, rowId: string) => void;
}) => (
  <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white">
    <div className="max-h-[700px] overflow-auto">
      <table className="min-w-full border-separate border-spacing-0 text-left">
        <thead className="sticky top-0 z-10 bg-primary text-white shadow-md">
          <tr>
            {TABLE_COLUMNS.map((column) => (
              <th key={column.key} className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em]">
                {column.label}
              </th>
            ))}
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em]">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => {
            const rowTone = row.facturado === 'Sí' ? 'bg-success/70' : row.facturado === 'No' ? 'bg-warning/80' : 'bg-white';

            return (
              <tr key={row.id} className={cn('border-b border-slate-100 align-top', rowTone, rowIndex % 2 === 1 && 'bg-opacity-80')}>
                {TABLE_COLUMNS.map((column) => {
                  const value = row[column.key as keyof SalesRow] as string;
                  return (
                    <td key={column.key} className="border-b border-slate-100 px-2 py-1.5">
                      {column.type === 'select' ? (
                        <select
                          value={value}
                          onChange={(event) => onCellChange(activeTabId, row.id, column.key as keyof SalesRow, event.target.value)}
                          className={inputBaseClass}
                        >
                          {FACTURADO_OPTIONS.map((option) => (
                            <option key={option || 'empty'} value={option}>
                              {option || 'Seleccionar'}
                            </option>
                          ))}
                        </select>
                      ) : column.type === 'payment' ? (
                        <select
                          value={value}
                          onChange={(event) => onCellChange(activeTabId, row.id, column.key as keyof SalesRow, event.target.value)}
                          className={inputBaseClass}
                        >
                          {PAGO_CREDITO_OPTIONS.map((option) => (
                            <option key={option || 'empty'} value={option}>
                              {option || 'Seleccionar'}
                            </option>
                          ))}
                        </select>
                      ) : column.type === 'month' ? (
                        <select
                          value={value}
                          onChange={(event) => onCellChange(activeTabId, row.id, column.key as keyof SalesRow, event.target.value)}
                          className={inputBaseClass}
                        >
                          {MONTH_OPTIONS.map((option) => (
                            <option key={option || 'empty'} value={option}>
                              {option || 'Seleccionar'}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
  type={column.type === 'number' ? 'number' : column.type === 'date' ? 'date' : 'text'}
  value={value}
  readOnly={'readOnly' in column && column.readOnly === true}
  onChange={(event) =>
    onCellChange(activeTabId, row.id, column.key as keyof SalesRow, event.target.value)
  }
  className={cn(
    inputBaseClass,
    'readOnly' in column && column.readOnly && 'cursor-not-allowed bg-slate-100 text-slate-500'
  )}
/>
                      )}
                    </td>
                  );
                })}
                <td className="border-b border-slate-100 px-3 py-2">
                  <button
                    type="button"
                    onClick={() => onDeleteRow(activeTabId, row.id)}
                    className="rounded-xl p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                    aria-label="Eliminar fila"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);
