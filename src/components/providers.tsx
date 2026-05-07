'use client';

import { useEffect } from 'react';
import { useDataStore } from '../store/dataStore';
import '../lib/i18n';

export function Providers({ children }: { children: React.ReactNode }) {
  const fetchData = useDataStore((state) => state.fetchData);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return <>{children}</>;
}
