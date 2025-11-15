import AppShell from '@/components/AppShell';
import * as React from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
