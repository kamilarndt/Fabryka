import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ChakraProvider } from '@chakra-ui/react';
import { Providers } from '../components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NextFab - System Zarządzania Produkcją',
  description: 'Zaawansowany system zarządzania produkcją dla Fabryki Dekoracji',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
