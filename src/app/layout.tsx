import type { ReactNode } from 'react';

import type { Metadata } from 'next';

import { ClientProviders } from './providers/ClientProviders';

import 'antd/dist/reset.css';
import '../styles/globals.scss';

export const metadata: Metadata = {
  title: 'Список пользователей',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang='ru'>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
