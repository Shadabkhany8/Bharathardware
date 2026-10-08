import { CustomerProfile } from './customer.types';

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  businessName: string;
  phone: string;
  email: string;
  password: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  customer: CustomerProfile;
}
