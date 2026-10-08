import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Category } from '@/types/product.types';
import { ensureFirestoreSeeded, INITIAL_CATEGORIES } from './seed.data';
import { Storage } from '@/utils/storage';

const CATEGORIES_CACHE_KEY = '@bs_cached_categories';

export const CategoryService = {
  async getCategories(): Promise<Category[]> {
    await ensureFirestoreSeeded();

    try {
      const snap = await getDocs(collection(db, 'categories'));
      if (!snap.empty) {
        const list: Category[] = [];
        snap.forEach((d) => {
          list.push(d.data() as Category);
        });
        list.sort((a, b) => a.id - b.id);
        await Storage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify(list));
        return list;
      }
    } catch {
      // Fallback below
    }

    const cached = await Storage.getItem(CATEGORIES_CACHE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached) as Category[];
      } catch {
        // ignore
      }
    }

    return INITIAL_CATEGORIES;
  },

  async getCategoryById(id: number): Promise<Category> {
    await ensureFirestoreSeeded();

    try {
      const snap = await getDoc(doc(db, 'categories', String(id)));
      if (snap.exists()) {
        return snap.data() as Category;
      }
    } catch {
      // Fallback below
    }

    const all = await this.getCategories();
    const found = all.find((c) => c.id === id);
    if (found) return found;

    throw new Error(`Category with ID ${id} not found`);
  },
};
