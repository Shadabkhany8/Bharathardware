import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { request } from './api';
import { CustomerAddress, CustomerProfile, UpdateCustomerPayload } from '@/types/customer.types';
import { AuthService } from './auth.service';
import { Storage } from '@/utils/storage';
import { Config } from '@/constants/config';

export const CustomerService = {
  async getProfile(): Promise<CustomerProfile> {
    return await AuthService.getMe();
  },

  async updateProfile(payload: UpdateCustomerPayload): Promise<CustomerProfile> {
    const stored = await AuthService.getStoredCustomer();
    const updated: CustomerProfile = {
      ...(stored || {
        id: 1,
        customerCode: 'CUST-01',
        phone: '9876543210',
        email: auth.currentUser?.email || 'customer@bharatsponge.com',
        role: 'ROLE_CUSTOMER',
        active: true,
        createdAt: new Date().toISOString(),
      }),
      name: payload.name,
      businessName: payload.businessName,
      address: payload.address,
      city: payload.city,
      state: payload.state,
      pincode: payload.pincode,
    };

    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        await setDoc(doc(db, 'users', currentUser.uid), updated, { merge: true });
      } catch {
        // Continue if Firestore is offline
      }
    }

    await Storage.setItem(Config.storageKeys.authUser, JSON.stringify(updated));

    // Optional sync with backend API if accessible
    try {
      await request<CustomerProfile>('/customers/me', {
        method: 'PUT',
        body: payload,
        requiresAuth: true,
      });
    } catch {
      // Backend offline is ok
    }

    return updated;
  },

  async getAddresses(): Promise<CustomerAddress[]> {
    try {
      return await request<CustomerAddress[]>('/customers/me/addresses', {
        method: 'GET',
        requiresAuth: true,
      });
    } catch {
      const stored = await AuthService.getStoredCustomer();
      if (stored) {
        return [
          {
            id: 'addr-default',
            type: 'Primary Warehouse',
            businessName: stored.businessName,
            address: stored.address,
            city: stored.city,
            state: stored.state,
            pincode: stored.pincode,
            phone: stored.phone,
          },
        ];
      }
      return [];
    }
  },
};
