export type Role = 'ROLE_CUSTOMER' | 'ROLE_ADMIN';

export interface CustomerProfile {
  id: number;
  customerCode: string;
  name: string;
  businessName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  role: Role;
  active: boolean;
  createdAt: string;
}

export interface UpdateCustomerPayload {
  name: string;
  businessName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface CustomerAddress {
  id: string;
  type: string;
  businessName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}
