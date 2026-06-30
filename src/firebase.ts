import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDEHTHjhmWilX4Eb4kKs9swYMHivtuMYfY",
  authDomain: "gen-lang-client-0837755820.firebaseapp.com",
  projectId: "gen-lang-client-0837755820",
  storageBucket: "gen-lang-client-0837755820.firebasestorage.app",
  messagingSenderId: "767211658534",
  appId: "1:767211658534:web:205f72b53a81fb58c675e7"
};

const app = initializeApp(firebaseConfig);

// Initialize firestore with databaseId from config
export const db = getFirestore(app, "ai-studio-websiteportalgmh-4b3a0393-0191-4a8a-947f-ad6b5f8c644b");

export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: any, operationType: OperationType, path: string | null) {
  const isPermissionError = 
    error && (
      (error.code && error.code === 'permission-denied') ||
      (error.message && (
        error.message.includes('permission') || 
        error.message.includes('PERMISSION_DENIED') ||
        error.message.includes('Missing or insufficient permissions')
      ))
    );

  if (isPermissionError) {
    const errInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid || null,
        email: auth.currentUser?.email || null,
        emailVerified: auth.currentUser?.emailVerified || null,
        isAnonymous: auth.currentUser?.isAnonymous || null,
        tenantId: auth.currentUser?.tenantId || null,
        providerInfo: auth.currentUser?.providerData?.map(provider => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || []
      },
      operationType,
      path
    };
    const serialized = JSON.stringify(errInfo);
    console.error('Firestore Error: ', serialized);
    throw new Error(serialized);
  }
  
  throw error;
}

