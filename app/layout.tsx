import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CONSITEC - Registro de Ventas',
  description: 'CRM interno para gestión comercial y seguimiento de ventas.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
