'use client';

import React, { type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase/index';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

// This component is now the single source of truth for initializing Firebase.
// It ensures that initialization logic only ever runs on the client.
export function FirebaseClientProvider({
  children,
}: FirebaseClientProviderProps) {
  // initializeFirebase() is called here, within a 'use client' component boundary.
  const { firebaseApp, auth, firestore } = initializeFirebase();

  return (
    <FirebaseProvider
      firebaseApp={firebaseApp}
      auth={auth}
      firestore={firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
