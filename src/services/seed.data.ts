import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from './firebase';
import { Category, Product } from '@/types/product.types';
import { Order } from '@/types/order.types';
import { Storage } from '@/utils/storage';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Abrasive Sponges & Blocks',
    description: 'Industrial grade flexible sanding and abrasive sponge blocks for wood, metal, and drywall.',
    imageUrl: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=500&auto=format&fit=crop',
    active: true,
  },
  {
    id: 2,
    name: 'Polishing & Buffing Pads',
    description: 'High density foam buffing pads and compounding sponges for automotive and metal finishing.',
    imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&auto=format&fit=crop',
    active: true,
  },
  {
    id: 3,
    name: 'Industrial Scouring Pads',
    description: 'Heavy-duty nylon mesh scouring pads for industrial machinery cleaning, rust prep, and degreasing.',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop',
    active: true,
  },
  {
    id: 4,
    name: 'Metal & Rust Prep Sponges',
    description: 'Silicon carbide abrasive sponges designed for weld blending, rust removal, and contour sanding.',
    imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=500&auto=format&fit=crop',
    active: true,
  },
  {
    id: 5,
    name: 'Hardware & Finishing Accessories',
    description: 'Specialty sponge holders, interface backing pads, and bulk wholesale rolls.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop',
    active: true,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    categoryId: 1,
    categoryName: 'Abrasive Sponges & Blocks',
    sku: 'BS-SP-101',
    name: 'Bharat SuperGrit Sanding Sponge (Medium 120)',
    description: 'Four-sided abrasive foam sponge for profiled woodwork and metal surfaces. Washable and reusable.',
    imageUrl: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=500&auto=format&fit=crop',
    unit: 'Box of 24',
    wholesalePrice: 480.0,
    minimumOrderQuantity: 5,
    stockQuantity: 250,
    active: true,
  },
  {
    id: 2,
    categoryId: 1,
    categoryName: 'Abrasive Sponges & Blocks',
    sku: 'BS-SP-102',
    name: 'Bharat UltraFine Flexible Foam Pad (Grit 320)',
    description: 'High-flexibility thin foam abrasive pad ideal for curved auto body panels and primer scuffing.',
    imageUrl: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=500&auto=format&fit=crop',
    unit: 'Box of 50',
    wholesalePrice: 850.0,
    minimumOrderQuantity: 3,
    stockQuantity: 180,
    active: true,
  },
  {
    id: 3,
    categoryId: 1,
    categoryName: 'Abrasive Sponges & Blocks',
    sku: 'BS-SP-103',
    name: 'Bharat Dual-Density Sanding Block (Coarse 60)',
    description: 'Rigid dense core with coarse aluminum oxide coating for rapid material removal on hardwoods and iron.',
    imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=500&auto=format&fit=crop',
    unit: 'Pack of 12',
    wholesalePrice: 360.0,
    minimumOrderQuantity: 10,
    stockQuantity: 400,
    active: true,
  },
  {
    id: 4,
    categoryId: 2,
    categoryName: 'Polishing & Buffing Pads',
    sku: 'BS-POL-201',
    name: 'ProBuff Waffle Foam Polishing Pad (6-Inch)',
    description: 'Precision cut waffle face prevents swirl marks and distributes cutting compound evenly across panels.',
    imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&auto=format&fit=crop',
    unit: 'Pack of 5',
    wholesalePrice: 650.0,
    minimumOrderQuantity: 4,
    stockQuantity: 120,
    active: true,
  },
  {
    id: 5,
    categoryId: 2,
    categoryName: 'Polishing & Buffing Pads',
    sku: 'BS-POL-202',
    name: 'Microfiber Finishing Sponge Applicator',
    description: 'Dense polyurethane sponge wrapped in scratch-free microfiber for ceramic coatings and sealant wax.',
    imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&auto=format&fit=crop',
    unit: 'Pack of 10',
    wholesalePrice: 420.0,
    minimumOrderQuantity: 8,
    stockQuantity: 300,
    active: true,
  },
  {
    id: 6,
    categoryId: 3,
    categoryName: 'Industrial Scouring Pads',
    sku: 'BS-IND-301',
    name: 'Heavy Duty Industrial Green Scourer (Extra Coarse)',
    description: 'Industrial web scouring pad for commercial equipment, foundry cleaning, and heavy rust preparation.',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop',
    unit: 'Carton of 60',
    wholesalePrice: 1200.0,
    minimumOrderQuantity: 2,
    stockQuantity: 85,
    active: true,
  },
  {
    id: 7,
    categoryId: 3,
    categoryName: 'Industrial Scouring Pads',
    sku: 'BS-IND-302',
    name: 'Non-Scratch Blue Industrial Degreasing Sponge',
    description: 'Tough cellulose core combined with non-woven scrubbing surface for factory maintenance and tooling.',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop',
    unit: 'Carton of 48',
    wholesalePrice: 960.0,
    minimumOrderQuantity: 3,
    stockQuantity: 140,
    active: true,
  },
  {
    id: 8,
    categoryId: 4,
    categoryName: 'Metal & Rust Prep Sponges',
    sku: 'BS-RST-401',
    name: 'Diamond Hand Polishing Sponge (Grit 200)',
    description: 'Electroplated diamond abrasive surface on ergonomic EVA foam base. Cuts through granite, glass, and hardened steel.',
    imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=500&auto=format&fit=crop',
    unit: 'Piece',
    wholesalePrice: 290.0,
    minimumOrderQuantity: 10,
    stockQuantity: 320,
    active: true,
  },
  {
    id: 9,
    categoryId: 4,
    categoryName: 'Metal & Rust Prep Sponges',
    sku: 'BS-RST-402',
    name: 'Silicon Carbide Contoured Rust Stripper Block',
    description: 'Beveled edge sanding sponge engineered to access grooves, welded seams, and pipe perimeters.',
    imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=500&auto=format&fit=crop',
    unit: 'Box of 20',
    wholesalePrice: 580.0,
    minimumOrderQuantity: 5,
    stockQuantity: 210,
    active: true,
  },
  {
    id: 10,
    categoryId: 5,
    categoryName: 'Hardware & Finishing Accessories',
    sku: 'BS-ACC-501',
    name: 'Hook & Loop Sponge Interface Cushion Pad (5-Inch)',
    description: 'Soft density foam interface pad to minimize burn-through on orbital disc sanders.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop',
    unit: 'Pack of 4',
    wholesalePrice: 380.0,
    minimumOrderQuantity: 5,
    stockQuantity: 160,
    active: true,
  },
  {
    id: 11,
    categoryId: 5,
    categoryName: 'Hardware & Finishing Accessories',
    sku: 'BS-ACC-502',
    name: 'Continuous Abrasive Foam Roll (115mm x 25M, Grit 180)',
    description: 'Perforated sponge roll in dispensing box. Tear off exact length needed for workshops and fabrication lines.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop',
    unit: 'Roll',
    wholesalePrice: 1450.0,
    minimumOrderQuantity: 2,
    stockQuantity: 75,
    active: true,
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 101,
    orderNumber: 'BS-ORD-2026-101',
    customerId: 1,
    customerName: 'Rajesh Sharma',
    businessName: 'Sharma Hardware & Tools Mart',
    customerPhone: '9876543210',
    totalQuantity: 10,
    totalAmount: 4800,
    paymentMethod: 'CASH',
    paymentStatus: 'PENDING',
    orderStatus: 'CONFIRMED',
    deliveryAddress: 'Shop No. 42, Iron & Hardware Market, Indore, MP',
    notes: 'Please dispatch morning slot before 12 PM',
    items: [
      {
        id: 1,
        productId: 1,
        productName: 'Bharat SuperGrit Sanding Sponge (Medium 120)',
        sku: 'BS-SP-101',
        quantity: 10,
        unitPrice: 480,
        subtotal: 4800,
        imageUrl: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=500&auto=format&fit=crop',
        currentStock: 240,
        isProductActive: true,
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 102,
    orderNumber: 'BS-ORD-2026-102',
    customerId: 1,
    customerName: 'Rajesh Sharma',
    businessName: 'Sharma Hardware & Tools Mart',
    customerPhone: '9876543210',
    totalQuantity: 6,
    totalAmount: 5100,
    paymentMethod: 'QR',
    paymentStatus: 'PAID',
    orderStatus: 'DELIVERED',
    deliveryAddress: 'Shop No. 42, Iron & Hardware Market, Indore, MP',
    notes: 'UPI payment verified upon receipt',
    items: [
      {
        id: 2,
        productId: 2,
        productName: 'Bharat UltraFine Flexible Foam Pad (Grit 320)',
        sku: 'BS-SP-102',
        quantity: 6,
        unitPrice: 850,
        subtotal: 5100,
        imageUrl: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=500&auto=format&fit=crop',
        currentStock: 174,
        isProductActive: true,
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
];

let isSeeding = false;
let isSeeded = false;

export async function ensureFirestoreSeeded(): Promise<void> {
  if (isSeeded || isSeeding) return;
  isSeeding = true;

  try {
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));

    if (categoriesSnapshot.empty) {
      // Seed Firestore with initial categories & products in batch
      const batch = writeBatch(db);

      // Seed categories
      for (const cat of INITIAL_CATEGORIES) {
        const catRef = doc(db, 'categories', String(cat.id));
        batch.set(catRef, cat);
      }

      // Seed products
      for (const prod of INITIAL_PRODUCTS) {
        const prodRef = doc(db, 'products', String(prod.id));
        batch.set(prodRef, prod);
      }

      // Seed sample orders
      for (const ord of INITIAL_ORDERS) {
        const ordRef = doc(db, 'orders', String(ord.id));
        batch.set(ordRef, ord);
      }

      await batch.commit();
    }

    isSeeded = true;
  } catch {
    // If Firestore rules are locked or offline, keep in-memory / storage
    const cachedCategories = await Storage.getItem('@bs_cached_categories');
    if (!cachedCategories) {
      await Storage.setItem('@bs_cached_categories', JSON.stringify(INITIAL_CATEGORIES));
      await Storage.setItem('@bs_cached_products', JSON.stringify(INITIAL_PRODUCTS));
      await Storage.setItem('@bs_cached_orders', JSON.stringify(INITIAL_ORDERS));
    }
  } finally {
    isSeeding = false;
  }
}
