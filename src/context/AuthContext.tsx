import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { AuthService } from '@/services/auth.service';
import { CustomerProfile } from '@/types/customer.types';
import { LoginPayload, RegisterPayload } from '@/types/auth.types';

interface AuthContextType {
  customer: CustomerProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AuthService.getStoredToken();
      const storedCustomer = await AuthService.getStoredCustomer();

      if (storedToken && storedCustomer) {
        setToken(storedToken);
        setCustomer(storedCustomer);
        // Silently refresh profile in background
        try {
          const fresh = await AuthService.getMe();
          setCustomer(fresh);
        } catch {
          // Keep stored customer if offline or expired
        }
      }
    } catch {
      // Ignore initialization error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStoredAuth();

    // Sync with Firebase Auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const freshToken = await firebaseUser.getIdToken();
          setToken(freshToken);
          const freshProfile = await AuthService.getMe();
          setCustomer(freshProfile);
        } catch {
          // Ignore background sync errors
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const res = await AuthService.login(payload);
      setToken(res.token);
      setCustomer(res.customer);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const res = await AuthService.register(payload);
      setToken(res.token);
      setCustomer(res.customer);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await AuthService.logout();
    setToken(null);
    setCustomer(null);
  };

  const refreshProfile = async () => {
    try {
      const fresh = await AuthService.getMe();
      setCustomer(fresh);
    } catch {
      // Ignore error
    }
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        token,
        isAuthenticated: !!token && !!customer,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
