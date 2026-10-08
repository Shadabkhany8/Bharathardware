import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, ReorderItemStatus } from '@/types/order.types';
import { Product } from '@/types/product.types';
import { Storage } from '@/utils/storage';
import { Config } from '@/constants/config';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  totalQuantity: number;
  totalAmount: number;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  loadFromReorder: (reorderItems: ReorderItemStatus[]) => void;
  getItemQuantity: (productId: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadCart = async () => {
    try {
      const stored = await Storage.getItem(Config.storageKeys.cart);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // Ignore parsing error
    } finally {
      setIsLoaded(true);
    }
  };

  const saveCart = async (cartItems: CartItem[]) => {
    try {
      await Storage.setItem(Config.storageKeys.cart, JSON.stringify(cartItems));
    } catch {
      // Ignore save error
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveCart(items);
    }
  }, [items, isLoaded]);

  const addToCart = (product: Product, quantity?: number) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.productId === product.id);
      const minQty = product.minimumOrderQuantity || 1;
      const initialAdd = quantity ?? minQty;

      if (existingIndex > -1) {
        const updated = [...prev];
        const existing = updated[existingIndex];
        const newQty = existing.quantity + initialAdd;
        // Cap at stock if available
        const cappedQty = product.stockQuantity ? Math.min(newQty, product.stockQuantity) : newQty;

        updated[existingIndex] = {
          ...existing,
          quantity: cappedQty,
          wholesalePrice: product.wholesalePrice, // refresh with current price
          stockQuantity: product.stockQuantity,
        };
        return updated;
      } else {
        const initialQty = Math.max(initialAdd, minQty);
        return [
          ...prev,
          {
            productId: product.id,
            productName: product.name,
            sku: product.sku,
            imageUrl: product.imageUrl,
            unit: product.unit,
            wholesalePrice: product.wholesalePrice,
            minimumOrderQuantity: minQty,
            stockQuantity: product.stockQuantity,
            quantity: initialQty,
          },
        ];
      }
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((i) => i.productId !== productId);
      }
      return prev.map((item) => {
        if (item.productId === productId) {
          const validQty = Math.max(quantity, item.minimumOrderQuantity);
          const cappedQty = item.stockQuantity ? Math.min(validQty, item.stockQuantity) : validQty;
          return { ...item, quantity: cappedQty };
        }
        return item;
      });
    });
  };

  const removeFromCart = (productId: number) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const loadFromReorder = (reorderItems: ReorderItemStatus[]) => {
    setItems((prev) => {
      const updated = [...prev];
      for (const item of reorderItems) {
        if (item.available) {
          const index = updated.findIndex((i) => i.productId === item.productId);
          const itemPayload: CartItem = {
            productId: item.productId,
            productName: item.productName,
            sku: item.sku,
            imageUrl: item.imageUrl,
            unit: item.unit,
            wholesalePrice: item.currentPrice,
            minimumOrderQuantity: item.minimumOrderQuantity,
            stockQuantity: item.availableStock,
            quantity: item.requestedQuantity,
          };
          if (index > -1) {
            updated[index] = itemPayload;
          } else {
            updated.push(itemPayload);
          }
        }
      }
      return updated;
    });
  };

  const getItemQuantity = (productId: number): number => {
    const item = items.find((i) => i.productId === productId);
    return item ? item.quantity : 0;
  };

  const itemCount = items.length;
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.wholesalePrice * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        totalQuantity,
        totalAmount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        loadFromReorder,
        getItemQuantity,
      }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
