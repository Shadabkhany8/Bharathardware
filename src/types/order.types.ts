export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'DISPATCHED'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentMethod = 'CASH' | 'QR' | 'BARCODE';

export type PaymentStatus = 'PENDING' | 'PAID';

export interface CartItem {
  productId: number;
  productName: string;
  sku: string;
  imageUrl: string;
  unit: string;
  wholesalePrice: number;
  minimumOrderQuantity: number;
  stockQuantity: number;
  quantity: number;
}

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface CreateOrderPayload {
  items: OrderItemRequest[];
  paymentMethod: PaymentMethod;
  deliveryAddress: string;
  notes?: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  imageUrl?: string;
  currentStock?: number;
  isProductActive?: boolean;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerId: number;
  customerName: string;
  businessName: string;
  customerPhone: string;
  totalQuantity: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  deliveryAddress: string;
  notes?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ReorderItemStatus {
  productId: number;
  productName: string;
  sku: string;
  imageUrl: string;
  unit: string;
  requestedQuantity: number;
  minimumOrderQuantity: number;
  orderTimePrice: number;
  currentPrice: number;
  priceChanged: boolean;
  availableStock: number;
  active: boolean;
  available: boolean;
  message: string;
}

export interface ReorderCheckResult {
  orderId: number;
  orderNumber: string;
  allAvailable: boolean;
  anyPriceChanged: boolean;
  items: ReorderItemStatus[];
}

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  confirmedOrders: number;
  processingOrders: number;
  dispatchedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalCustomers: number;
}

