'use client';

import { FirebaseClientProvider } from '@/firebase';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
      {children}
    </FirebaseClientProvider>
  );
}
