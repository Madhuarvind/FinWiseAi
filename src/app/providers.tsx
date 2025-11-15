'use client';

import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from '@/components/ui/toaster';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FirebaseClientProvider>{children}</FirebaseClientProvider>
      <Toaster />
    </>
  );
}
