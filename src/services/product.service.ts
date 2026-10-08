import { collection, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { PageResponse, Product, ProductFilterParams } from '@/types/product.types';
import { ensureFirestoreSeeded, INITIAL_PRODUCTS } from './seed.data';
import { Storage } from '@/utils/storage';

const PRODUCTS_CACHE_KEY = '@bs_cached_products';
const DELETED_PRODUCTS_KEY = '@bs_deleted_product_ids';

async function getDeletedProductIds(): Promise<Set<number>> {
  try {
    const raw = await Storage.getItem(DELETED_PRODUCTS_KEY);
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

export const ProductService = {
  async getAllRawProducts(): Promise<Product[]> {
    await ensureFirestoreSeeded();
    const deletedIds = await getDeletedProductIds();

    try {
      const snap = await getDocs(collection(db, 'products'));
      if (!snap.empty) {
        const list: Product[] = [];
        snap.forEach((d) => {
          const item = d.data() as Product;
          if (!deletedIds.has(item.id)) {
            list.push(item);
          }
        });
        list.sort((a, b) => a.id - b.id);
        await Storage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(list));
        return list;
      }
    } catch {
      // Fallback to cache
    }

    const cached = await Storage.getItem(PRODUCTS_CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as Product[];
        return parsed.filter((p) => !deletedIds.has(p.id));
      } catch {
        // ignore
      }
    }

    return INITIAL_PRODUCTS.filter((p) => !deletedIds.has(p.id));
  },

  async deleteProduct(id: number): Promise<void> {
    try {
      await deleteDoc(doc(db, 'products', String(id)));
    } catch {
      // Offline fallback
    }

    try {
      // Remove from cache
      const cached = await Storage.getItem(PRODUCTS_CACHE_KEY);
      if (cached) {
        const list = JSON.parse(cached) as Product[];
        const filtered = list.filter((p) => p.id !== id);
        await Storage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(filtered));
      }

      // Add to deleted IDs set
      const deletedRaw = await Storage.getItem(DELETED_PRODUCTS_KEY);
      const deletedList: number[] = deletedRaw ? JSON.parse(deletedRaw) : [];
      if (!deletedList.includes(id)) {
        deletedList.push(id);
        await Storage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify(deletedList));
      }
    } catch {
      // ignore
    }
  },

  async getProducts(params: ProductFilterParams = {}): Promise<PageResponse<Product>> {
    let products = await this.getAllRawProducts();

    // Filter by active status
    products = products.filter((p) => p.active !== false);

    // Filter by Category
    if (params.categoryId && params.categoryId > 0) {
      products = products.filter((p) => p.categoryId === params.categoryId);
    }

    // Filter by Query (search term in name, description, or SKU)
    if (params.query && params.query.trim()) {
      const q = params.query.trim().toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryName?.toLowerCase().includes(q)
      );
    }

    // Sort products
    if (params.sortBy) {
      const dir = params.sortDir === 'desc' ? -1 : 1;
      products.sort((a, b) => {
        if (params.sortBy === 'wholesalePrice' || params.sortBy === 'price') {
          return (a.wholesalePrice - b.wholesalePrice) * dir;
        }
        if (params.sortBy === 'name') {
          return a.name.localeCompare(b.name) * dir;
        }
        if (params.sortBy === 'stockQuantity') {
          return (a.stockQuantity - b.stockQuantity) * dir;
        }
        return (a.id - b.id) * dir;
      });
    }

    // Pagination
    const page = params.page ?? 0;
    const size = params.size ?? 12;
    const totalElements = products.length;
    const totalPages = Math.ceil(totalElements / size);
    const start = page * size;
    const paginatedItems = products.slice(start, start + size);

    return {
      content: paginatedItems,
      pageNumber: page,
      pageSize: size,
      totalElements,
      totalPages: totalPages === 0 ? 1 : totalPages,
      last: page >= totalPages - 1,
    };
  },

  async getProductById(id: number): Promise<Product> {
    await ensureFirestoreSeeded();
    const deletedIds = await getDeletedProductIds();
    if (deletedIds.has(id)) {
      throw new Error(`Product with ID ${id} not found`);
    }

    try {
      const snap = await getDoc(doc(db, 'products', String(id)));
      if (snap.exists()) {
        return snap.data() as Product;
      }
    } catch {
      // Fallback
    }

    const all = await this.getAllRawProducts();
    const found = all.find((p) => p.id === id);
    if (found) return found;

    throw new Error(`Product with ID ${id} not found`);
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const all = await this.getAllRawProducts();
    return all.filter((p) => p.active !== false).slice(0, 6);
  },

  async searchProducts(query: string, page = 0, size = 12): Promise<PageResponse<Product>> {
    return await this.getProducts({ query, page, size });
  },

  async getProductsByCategory(categoryId: number, page = 0, size = 12): Promise<PageResponse<Product>> {
    return await this.getProducts({ categoryId, page, size });
  },
};
