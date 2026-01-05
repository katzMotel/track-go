'use client';

import { useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppSelector(state => state.ui.theme);

  useEffect(() => {
    // Apply theme immediately
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Also apply on mount to prevent flash
  useEffect(() => {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem('shipment-tracker-state');
    if (savedTheme) {
      try {
        const parsed = JSON.parse(savedTheme);
        if (parsed.state?.ui?.theme === 'dark') {
          root.classList.add('dark');
        }
      } catch (e) {
        // Ignore errors
      }
    }
  }, []);

  return <>{children}</>;
}