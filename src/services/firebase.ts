import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
  Auth,
} from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: 'AIzaSyAEVMXiB2S4iXRlZhQmAX1ExWSVJDXblBs',
  authDomain: 'bharatsponge.firebaseapp.com',
  projectId: 'bharatsponge',
  storageBucket: 'bharatsponge.firebasestorage.app',
  messagingSenderId: '24028159834',
  appId: '1:24028159834:web:7cfbc045dd0352a90fdd63',
  measurementId: 'G-S1B3NZC4E0',
};

// Initialize Firebase App (Singleton check for hot reload / Fast Refresh)
export const app: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth with persistent storage
let authInstance: Auth;
try {
  if (Platform.OS === 'web') {
    authInstance = getAuth(app);
  } else {
    authInstance = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  }
} catch {
  // If already initialized during Fast Refresh
  authInstance = getAuth(app);
}

export const auth = authInstance;

// Initialize Firestore
export const db: Firestore = getFirestore(app);

// Initialize Firebase Storage
export const storage: FirebaseStorage = getStorage(app);

// Safe Analytics initialization (supported on web)
let analyticsInstance: Analytics | null = null;
if (Platform.OS === 'web' && typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        analyticsInstance = getAnalytics(app);
      }
    })
    .catch(() => {
      // Analytics unsupported in current environment
    });
}

export const getFirebaseAnalytics = (): Analytics | null => analyticsInstance;
