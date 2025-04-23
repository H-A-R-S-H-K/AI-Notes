'use client';

import { ReactNode } from 'react';
import { ReactQueryProvider } from './react-query-provider';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ReactQueryProvider>
        {children}
      </ReactQueryProvider>
    </ThemeProvider>
  );
}