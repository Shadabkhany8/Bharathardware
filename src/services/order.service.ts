import { collection, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { PageResponse } from '@/types/product.types';
import {
  CreateOrderPayload,
  Order,
  OrderItem,
  OrderStatus,
  ReorderCheckResult,
  ReorderItemStatus,
} from '@/types/order.types';
import { AuthService } from './auth.service';
import { ProductService } from './product.service';
import { ensureFirestoreSeeded, INITIAL_ORDERS } from './seed.data';
import { Storage } from '@/utils/storage';

const ORDERS_CACHE_KEY = '@bs_cached_orders';
const DELETED_ORDERS_KEY = '@bs_deleted_order_ids';

async function getDeletedOrderIds(): Promise<Set<number>> {
  try {
    const raw = await Storage.getItem(DELETED_ORDERS_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        return new Set(arr);
      }
    }
  } catch {
    // ignore
  }
  return new Set();
}

export const OrderService = {
  async getAllRawOrders(): Promise<Order[]> {
    await ensureFirestoreSeeded();
    const deletedIds = await getDeletedOrderIds();

    try {
      const snap = await getDocs(collection(db, 'orders'));
      if (!snap.empty) {
        const list: Order[] = [];
        snap.forEach((d) => {
          const ord = d.data() as Order;
          if (!deletedIds.has(ord.id)) {
            list.push(ord);
          }
        });
        list.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        await Storage.setItem(ORDERS_CACHE_KEY, JSON.stringify(list));
        return list;
      }
    } catch {
      // Fallback to cache
    }

    const cached = await Storage.getItem(ORDERS_CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as Order[];
        return parsed.filter((o) => !deletedIds.has(o.id));
      } catch {
        // ignore
      }
    }

    return INITIAL_ORDERS.filter((o) => !deletedIds.has(o.id));
  },

  async deleteOrder(id: number): Promise<void> {
    try {
      await deleteDoc(doc(db, 'orders', String(id)));
    } catch {
      // Offline fallback
    }

    try {
      // Remove from cache
      const cached = await Storage.getItem(ORDERS_CACHE_KEY);
      if (cached) {
        const list = JSON.parse(cached) as Order[];
        const filtered = list.filter((o) => o.id !== id);
        await Storage.setItem(ORDERS_CACHE_KEY, JSON.stringify(filtered));
      }

      // Add to deleted IDs set
      const deletedRaw = await Storage.getItem(DELETED_ORDERS_KEY);
      const deletedList: number[] = deletedRaw ? JSON.parse(deletedRaw) : [];
      if (!deletedList.includes(id)) {
        deletedList.push(id);
        await Storage.setItem(DELETED_ORDERS_KEY, JSON.stringify(deletedList));
      }
    } catch {
      // ignore
    }
  },

  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    const customer = await AuthService.getStoredCustomer();
    if (!customer) {
      throw new Error('Please sign in to place a wholesale order.');
    }

    // Resolve products for all items in payload
    const orderItems: OrderItem[] = [];
    let totalAmount = 0;
    let totalQuantity = 0;

    for (let i = 0; i < payload.items.length; i++) {
      const req = payload.items[i];
      const prod = await ProductService.getProductById(req.productId);
      const subtotal = prod.wholesalePrice * req.quantity;
      totalAmount += subtotal;
      totalQuantity += req.quantity;

      orderItems.push({
        id: i + 1,
        productId: prod.id,
        productName: prod.name,
        sku: prod.sku,
        quantity: req.quantity,
        unitPrice: prod.wholesalePrice,
        subtotal,
        imageUrl: prod.imageUrl,
        currentStock: prod.stockQuantity,
        isProductActive: prod.active,
      });

      // Update product stock in Firestore
      try {
        const newStock = Math.max(0, prod.stockQuantity - req.quantity);
        await setDoc(
          doc(db, 'products', String(prod.id)),
          { ...prod, stockQuantity: newStock },
          { merge: true }
        );
      } catch {
        // Continue
      }
    }

    const orderId = Date.now();
    const orderNumber = `BS-ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowIso = new Date().toISOString();

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      customerId: customer.id,
      customerName: customer.name,
      businessName: customer.businessName,
      customerPhone: customer.phone,
      totalQuantity,
      totalAmount,
      paymentMethod: payload.paymentMethod,
      paymentStatus: 'PENDING',
      orderStatus: 'PENDING',
      deliveryAddress: payload.deliveryAddress || customer.address,
      notes: payload.notes || '',
      items: orderItems,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    // Save order in Firestore
    try {
      await setDoc(doc(db, 'orders', String(orderId)), newOrder);
    } catch {
      // If offline, store in local cache
      const cached = await this.getAllRawOrders();
      cached.unshift(newOrder);
      await Storage.setItem(ORDERS_CACHE_KEY, JSON.stringify(cached));
    }

    return newOrder;
  },

  async getMyOrders(status?: OrderStatus, page = 0, size = 15): Promise<PageResponse<Order>> {
    const customer = await AuthService.getStoredCustomer();
    let orders = await this.getAllRawOrders();

    // If regular customer, show only their orders
    if (customer && customer.role !== 'ROLE_ADMIN') {
      orders = orders.filter(
        (o) =>
          o.customerId === customer.id ||
          o.customerPhone === customer.phone ||
          o.businessName.toLowerCase() === customer.businessName.toLowerCase()
      );
    }

    if (status) {
      orders = orders.filter((o) => o.orderStatus === status);
    }

    const totalElements = orders.length;
    const totalPages = Math.ceil(totalElements / size);
    const start = page * size;
    const paginatedItems = orders.slice(start, start + size);

    return {
      content: paginatedItems,
      pageNumber: page,
      pageSize: size,
      totalElements,
      totalPages: totalPages === 0 ? 1 : totalPages,
      last: page >= totalPages - 1,
    };
  },

  async getOrderById(id: number): Promise<Order> {
    await ensureFirestoreSeeded();
    const deletedIds = await getDeletedOrderIds();
    if (deletedIds.has(id)) {
      throw new Error(`Order with ID ${id} not found`);
    }

    try {
      const snap = await getDoc(doc(db, 'orders', String(id)));
      if (snap.exists()) {
        return snap.data() as Order;
      }
    } catch {
      // Fallback
    }

    const all = await this.getAllRawOrders();
    const found = all.find((o) => o.id === id);
    if (found) return found;

    throw new Error(`Order with ID ${id} not found`);
  },

  async getRecentOrders(): Promise<Order[]> {
    const pageRes = await this.getMyOrders(undefined, 0, 5);
    return pageRes.content;
  },

  async checkReorder(id: number): Promise<ReorderCheckResult> {
    const order = await this.getOrderById(id);
    let allAvailable = true;
    let anyPriceChanged = false;

    const items: ReorderItemStatus[] = [];

    for (const item of order.items) {
      let prod;
      try {
        prod = await ProductService.getProductById(item.productId);
      } catch {
        prod = null;
      }

      if (!prod) {
        allAvailable = false;
        items.push({
          productId: item.productId,
          productName: item.productName,
          sku: item.sku,
          imageUrl: item.imageUrl || '',
          unit: 'Unit',
          requestedQuantity: item.quantity,
          minimumOrderQuantity: 1,
          orderTimePrice: item.unitPrice,
          currentPrice: item.unitPrice,
          priceChanged: false,
          availableStock: 0,
          active: false,
          available: false,
          message: 'Product discontinued or out of catalog',
        });
        continue;
      }

      const available = prod.active && prod.stockQuantity >= item.quantity;
      if (!available) allAvailable = false;

      const priceChanged = prod.wholesalePrice !== item.unitPrice;
      if (priceChanged) anyPriceChanged = true;

      items.push({
        productId: prod.id,
        productName: prod.name,
        sku: prod.sku,
        imageUrl: prod.imageUrl,
        unit: prod.unit,
        requestedQuantity: item.quantity,
        minimumOrderQuantity: prod.minimumOrderQuantity,
        orderTimePrice: item.unitPrice,
        currentPrice: prod.wholesalePrice,
        priceChanged,
        availableStock: prod.stockQuantity,
        active: prod.active,
        available,
        message: available ? 'In stock and ready for wholesale reorder' : 'Insufficient stock for requested quantity',
      });
    }

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      allAvailable,
      anyPriceChanged,
      items,
    };
  },
};
