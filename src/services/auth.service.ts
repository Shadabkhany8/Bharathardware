import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { request } from './api';
import { AuthResponse, LoginPayload, RegisterPayload } from '@/types/auth.types';
import { CustomerProfile } from '@/types/customer.types';
import { Storage } from '@/utils/storage';
import { Config } from '@/constants/config';

const ADMIN_EMAIL = 'bharatsponge@gmail.com';
const ADMIN_LEGACY_EMAIL = 'admin@bharatsponge.com';

export const AuthService = {
  /**
   * Helper to format email if user entered mobile number
   */
  normalizeEmail(identifier: string): string {
    const trimmed = identifier.trim().toLowerCase();
    if (trimmed.includes('@')) {
      return trimmed;
    }
    // If entered phone number, format as username email
    const cleanedDigits = trimmed.replace(/\D/g, '');
    return `${cleanedDigits || trimmed}@bharatsponge.com`;
  },

  /**
   * Builds customer profile object from Firebase user and optional Firestore data
   */
  buildProfile(
    user: User,
    existingData?: Partial<CustomerProfile>,
    fallbackPayload?: Partial<RegisterPayload>
  ): CustomerProfile {
    const email = (user.email || existingData?.email || '').toLowerCase();
    const isAdmin = email === ADMIN_EMAIL || email === ADMIN_LEGACY_EMAIL;

    return {
      id: existingData?.id || (isAdmin ? 1 : Math.floor(Math.random() * 10000) + 100),
      customerCode:
        existingData?.customerCode ||
        (isAdmin ? 'ADMIN-01' : `CUST-BS-${Math.floor(1000 + Math.random() * 9000)}`),
      name:
        existingData?.name ||
        user.displayName ||
        fallbackPayload?.name ||
        (isAdmin ? 'Arbaz khan (Owner)' : 'Wholesale Dealer'),
      businessName:
        existingData?.businessName ||
        fallbackPayload?.businessName ||
        (isAdmin ? 'Bharat Sponge' : 'Retail Hardware Enterprise'),
      phone:
        existingData?.phone ||
        user.phoneNumber ||
        fallbackPayload?.phone ||
        (isAdmin ? Config.ownerPhone : '9876543210'),
      email: user.email || existingData?.email || fallbackPayload?.email || '',
      address:
        existingData?.address ||
        fallbackPayload?.address ||
        (isAdmin ? 'Sanwer Road Industrial Area' : 'Main Hardware Market'),
      city: existingData?.city || fallbackPayload?.city || 'Indore',
      state: existingData?.state || fallbackPayload?.state || 'Madhya Pradesh',
      pincode: existingData?.pincode || fallbackPayload?.pincode || '452015',
      role: isAdmin ? 'ROLE_ADMIN' : existingData?.role || 'ROLE_CUSTOMER',
      active: true,
      createdAt: existingData?.createdAt || new Date().toISOString(),
    };
  },

  /**
   * Authenticates user via Firebase Auth and sets session storage
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const email = this.normalizeEmail(payload.identifier);
    const password = payload.password;
    const isAdminCredentials =
      (email === ADMIN_EMAIL && (password === 'Bharat@123' || password === 'Admin@123')) ||
      (email === ADMIN_LEGACY_EMAIL && (password === 'Admin@123' || password === 'Bharat@123'));

    let firebaseUser: User | null = null;
    let token = '';

    try {
      // 1. Attempt standard Firebase Auth sign-in
      const credential = await signInWithEmailAndPassword(auth, email, password);
      firebaseUser = credential.user;
      token = await firebaseUser.getIdToken();
    } catch (firebaseErr: any) {
      const code = firebaseErr?.code;

      // 2. Auto-provision admin or demo credentials on fresh Firebase project
      if (
        (code === 'auth/user-not-found' ||
          code === 'auth/invalid-credential' ||
          code === 'auth/invalid-login-credentials') &&
        (isAdminCredentials || (email === 'customer@bharatsponge.com' && password === 'Password@123'))
      ) {
        try {
          const newCredential = await createUserWithEmailAndPassword(auth, email, password);
          firebaseUser = newCredential.user;
          token = await firebaseUser.getIdToken();
          const displayName = isAdminCredentials ? 'Arbaz khan (Owner)' : 'Demo Dealer';
          await updateProfile(firebaseUser, { displayName });
        } catch {
          // If creation fails (e.g. email exists with diff password), rethrow original
          throw new Error('Invalid email or password for Firebase authentication.');
        }
      } else {
        // Fallback to Java backend or local session if Firebase is offline or blocked
        try {
          const backendData = await request<AuthResponse>('/auth/login', {
            method: 'POST',
            body: payload,
          });
          if (backendData?.token) {
            await Storage.setItem(Config.storageKeys.authToken, backendData.token);
            await Storage.setItem(
              Config.storageKeys.authUser,
              JSON.stringify(backendData.customer)
            );
            return backendData;
          }
        } catch {
          // If offline and admin credentials match, provide resilient offline access
          if (isAdminCredentials) {
            const adminOffline: CustomerProfile = {
              id: 1,
              customerCode: 'ADMIN-01',
              name: 'Arbaz khan (Owner)',
              businessName: 'Bharat Sponge',
              phone: Config.ownerPhone,
              email: ADMIN_EMAIL,
              address: 'Sanwer Road Industrial Area',
              city: 'Indore',
              state: 'Madhya Pradesh',
              pincode: '452015',
              role: 'ROLE_ADMIN',
              active: true,
              createdAt: new Date().toISOString(),
            };
            const offlineToken = 'offline-admin-token-' + Date.now();
            await Storage.setItem(Config.storageKeys.authToken, offlineToken);
            await Storage.setItem(Config.storageKeys.authUser, JSON.stringify(adminOffline));
            return {
              token: offlineToken,
              tokenType: 'Bearer',
              customer: adminOffline,
            };
          }
        }

        const msg =
          firebaseErr?.code === 'auth/invalid-credential' ||
          firebaseErr?.code === 'auth/user-not-found' ||
          firebaseErr?.code === 'auth/wrong-password'
            ? 'Invalid credentials. Please verify your email and password.'
            : firebaseErr?.message || 'Login failed. Please check your credentials or network.';
        throw new Error(msg);
      }
    }

    if (!firebaseUser) {
      throw new Error('Authentication failed: No user returned');
    }

    // 3. Retrieve or synchronize profile in Firestore
    let customerProfile: CustomerProfile;
    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        customerProfile = this.buildProfile(
          firebaseUser,
          userSnapshot.data() as Partial<CustomerProfile>
        );
      } else {
        customerProfile = this.buildProfile(firebaseUser);
        await setDoc(userDocRef, customerProfile);
      }
    } catch {
      // If Firestore is restricted by rules or offline, build from Auth user
      customerProfile = this.buildProfile(firebaseUser);
    }

    // 4. Save session to AsyncStorage
    await Storage.setItem(Config.storageKeys.authToken, token);
    await Storage.setItem(Config.storageKeys.authUser, JSON.stringify(customerProfile));

    return {
      token,
      tokenType: 'Bearer',
      customer: customerProfile,
    };
  },

  /**
   * Registers a new wholesale customer in Firebase Auth & Firestore
   */
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const email = payload.email.trim().toLowerCase();
    let firebaseUser: User;
    let token = '';

    try {
      const credential = await createUserWithEmailAndPassword(auth, email, payload.password);
      firebaseUser = credential.user;
      token = await firebaseUser.getIdToken();
      await updateProfile(firebaseUser, { displayName: payload.name });
    } catch (firebaseErr: any) {
      if (firebaseErr?.code === 'auth/email-already-in-use') {
        // Attempt sign-in with existing user credentials
        try {
          const cred = await signInWithEmailAndPassword(auth, email, payload.password);
          firebaseUser = cred.user;
          token = await firebaseUser.getIdToken();
        } catch {
          throw new Error('This email is already registered. Please sign in with your password.');
        }
      } else {
        // Also check if Java backend is accepting registration
        try {
          const backendData = await request<AuthResponse>('/auth/register', {
            method: 'POST',
            body: payload,
          });
          if (backendData?.token) {
            await Storage.setItem(Config.storageKeys.authToken, backendData.token);
            await Storage.setItem(
              Config.storageKeys.authUser,
              JSON.stringify(backendData.customer)
            );
            return backendData;
          }
        } catch {
          // ignore backend fallback if failed
        }
        throw new Error(firebaseErr?.message || 'Failed to create account with Firebase.');
      }
    }

    const customerProfile = this.buildProfile(firebaseUser, undefined, payload);

    try {
      await setDoc(doc(db, 'users', firebaseUser.uid), customerProfile);
    } catch {
      // Keep going if Firestore is offline
    }

    await Storage.setItem(Config.storageKeys.authToken, token);
    await Storage.setItem(Config.storageKeys.authUser, JSON.stringify(customerProfile));

    return {
      token,
      tokenType: 'Bearer',
      customer: customerProfile,
    };
  },

  /**
   * Returns current authenticated customer profile
   */
  async getMe(): Promise<CustomerProfile> {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const snapshot = await getDoc(userDocRef);
        if (snapshot.exists()) {
          const profile = this.buildProfile(
            currentUser,
            snapshot.data() as Partial<CustomerProfile>
          );
          await Storage.setItem(Config.storageKeys.authUser, JSON.stringify(profile));
          return profile;
        }
      } catch {
        // Ignore firestore error
      }
    }

    const stored = await this.getStoredCustomer();
    if (stored) return stored;

    try {
      return await request<CustomerProfile>('/auth/me', {
        method: 'GET',
        requiresAuth: true,
      });
    } catch {
      throw new Error('User not authenticated');
    }
  },

  /**
   * Signs out from Firebase and cleans local session
   */
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch {
      // Ignore signOut errors
    }
    await Storage.removeItem(Config.storageKeys.authToken);
    await Storage.removeItem(Config.storageKeys.authUser);
  },

  async getStoredToken(): Promise<string | null> {
    return await Storage.getItem(Config.storageKeys.authToken);
  },

  async getStoredCustomer(): Promise<CustomerProfile | null> {
    const raw = await Storage.getItem(Config.storageKeys.authUser);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as CustomerProfile;
    } catch {
      return null;
    }
  },
};
