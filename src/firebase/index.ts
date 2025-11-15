'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// IMPORTANT: This function should not be exported directly to prevent server-side execution.
// It is now used exclusively within FirebaseClientProvider.
function initializeFirebase() {
  if (getApps().length > 0) {
    const app = getApp();
    return getSdks(app);
  }

  let firebaseApp;
  try {
    firebaseApp = initializeApp();
  } catch (e) {
    if (process.env.NODE_ENV === 'production') {
      console.warn(
        'Automatic Firebase initialization failed. Falling back to firebaseConfig.',
        e
      );
    }
    firebaseApp = initializeApp(firebaseConfig);
  }
  return getSdks(firebaseApp);
}

function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp),
  };
}

// Re-export providers and hooks
export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';

// This function is now internal to the firebase module.
// The public API is the FirebaseClientProvider and the hooks.
export { initializeFirebase };
