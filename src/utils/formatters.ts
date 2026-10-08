import { getApiBaseUrl } from '@/services/api';
import { OrderStatus, PaymentMethod } from '@/types/order.types';

export const formatCurrency = (amount: number | string | undefined | null): string => {
  if (amount === undefined || amount === null) return '₹0';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '₹0';
  return '₹' + num.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: num % 1 === 0 ? 0 : 2,
  });
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString?: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
};

export const getOrderStatusMeta = (status: OrderStatus): { label: string; color: string; bg: string } => {
  switch (status) {
    case 'PENDING':
      return { label: 'Pending Review', color: '#D97706', bg: '#FEF3C7' };
    case 'CONFIRMED':
      return { label: 'Confirmed', color: '#0284C7', bg: '#E0F2FE' };
    case 'PROCESSING':
      return { label: 'Processing Bulk', color: '#6366F1', bg: '#EEF2FF' };
    case 'DISPATCHED':
      return { label: 'Dispatched', color: '#8B5CF6', bg: '#F5F3FF' };
    case 'DELIVERED':
      return { label: 'Delivered', color: '#16A34A', bg: '#DCFCE7' };
    case 'CANCELLED':
      return { label: 'Cancelled', color: '#DC2626', bg: '#FEE2E2' };
    default:
      return { label: status, color: '#64748B', bg: '#F1F5F9' };
  }
};

export const getPaymentMethodMeta = (method: PaymentMethod): { label: string; description: string; icon: string } => {
  switch (method) {
    case 'CASH':
      return {
        label: 'Cash on Delivery / Pickup',
        description: 'Pay cash to dispatch executive upon order delivery.',
        icon: 'banknote',
      };
    case 'QR':
      return {
        label: 'UPI QR Scan on Delivery',
        description: 'Scan Bharat Sponge business QR code via any UPI app upon delivery.',
        icon: 'qrcode',
      };
    case 'BARCODE':
      return {
        label: 'Barcode Invoice Payment',
        description: 'Scan the hardware invoice barcode at warehouse pickup / delivery counter.',
        icon: 'barcode',
      };
    default:
      return {
        label: method,
        description: 'Pay separately upon order receipt.',
        icon: 'creditcard',
      };
  }
};

const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=500';

export const resolveImageUrl = (imageUrl?: string | null): string => {
  if (!imageUrl || !imageUrl.trim()) {
    return DEFAULT_PRODUCT_IMAGE;
  }
  const clean = imageUrl.trim();
  if (
    clean.startsWith('http://') ||
    clean.startsWith('https://') ||
    clean.startsWith('data:') ||
    clean.startsWith('file://')
  ) {
    return clean;
  }
  // If relative path like "/api/uploads/products/..."
  const baseUrl = getApiBaseUrl().replace(/\/api\/?$/, '');
  const path = clean.startsWith('/') ? clean : `/${clean}`;
  return `${baseUrl}${path}`;
};
