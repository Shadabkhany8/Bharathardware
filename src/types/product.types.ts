export interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  active: boolean;
}

export interface Product {
  id: number;
  categoryId: number;
  categoryName: string;
  sku: string;
  name: string;
  description: string;
  imageUrl: string;
  unit: string;
  wholesalePrice: number;
  minimumOrderQuantity: number;
  stockQuantity: number;
  active: boolean;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ProductFilterParams {
  query?: string;
  categoryId?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface CreateProductPayload {
  categoryId: number;
  sku: string;
  name: string;
  description?: string;
  imageUrl?: string;
  unit: string;
  wholesalePrice: number;
  minimumOrderQuantity: number;
  stockQuantity: number;
  active?: boolean;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

