import { apiRequest, apiUpload, formDataAppendPart, type FormDataFilePart } from './api';
import { PaginatedResponse } from './categories.service';

export type ProductUploadFile = FormDataFilePart;

export type Product = {
  id: number;
  title?: string;
  name?: string;
  description?: string;
  price?: number;
  isActive?: boolean;
  images?: string[];
  rating?: number;
  reviewCount?: number;
  provider?: { id: number; fullName?: string; commercialName?: string };
  category?: { id: number; name: string };
  subCategory?: { id: number; name: string };
};

export type ProductReview = {
  id: number;
  rating: number;
  comment?: string;
  createdAt: string;
  reviewer?: { id: number; fullName: string };
};

function normalizeProductList(json: unknown): PaginatedResponse<Product> {
  if (Array.isArray(json)) {
    return { data: json as Product[], total: json.length, page: 1, limit: json.length };
  }
  if (json && typeof json === 'object') {
    const o = json as Record<string, unknown>;
    const list =
      Array.isArray(o.data) ? o.data :
      Array.isArray(o.items) ? o.items :
      Array.isArray(o.products) ? o.products : null;
    if (list) {
      return {
        data: list as Product[],
        total: typeof o.total === 'number' ? o.total : list.length,
        page: typeof o.page === 'number' ? o.page : 1,
        limit: typeof o.limit === 'number' ? o.limit : list.length,
      };
    }
  }
  return { data: [], total: 0, page: 1, limit: 0 };
}

export const ProductsService = {
  async getAll(params?: {
    categoryId?: number;
    subCategoryId?: number;
    providerId?: number;
    search?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Product>> {
    const query = new URLSearchParams();
    if (params?.categoryId) query.set('categoryId', String(params.categoryId));
    if (params?.subCategoryId) query.set('subCategoryId', String(params.subCategoryId));
    if (params?.providerId) query.set('providerId', String(params.providerId));
    if (params?.search) query.set('search', params.search);
    if (params?.isActive !== undefined) query.set('isActive', String(params.isActive));
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    const qs = query.toString();
    const json = await apiRequest<unknown>(`/products${qs ? `?${qs}` : ''}`);
    return normalizeProductList(json);
  },

  async getOne(id: number): Promise<Product> {
    return apiRequest(`/products/${id}`);
  },

  async create(data: {
    title: string;
    description?: string;
    price: number;
    categoryId?: number;
    subCategoryId?: number;
  }, files?: ProductUploadFile[]): Promise<Product> {
    const form = new FormData();
    form.append('data', JSON.stringify(data));
    if (files?.length) {
      files.forEach((file) => formDataAppendPart(form, 'files', file));
    }
    return apiUpload('/products', form, 'POST');
  },

  async update(id: number, data: Partial<{
    title: string;
    description: string;
    price: number;
    isActive: boolean;
  }>, files?: ProductUploadFile[]): Promise<Product> {
    const form = new FormData();
    form.append('data', JSON.stringify(data));
    if (files?.length) {
      files.forEach((file) => formDataAppendPart(form, 'files', file));
    }
    return apiUpload(`/products/${id}`, form, 'PATCH');
  },

  async remove(id: number): Promise<void> {
    return apiRequest(`/products/${id}`, { method: 'DELETE' });
  },

  async getReviews(productId: number): Promise<ProductReview[]> {
    return apiRequest(`/products/${productId}/reviews`);
  },

  async createReview(productId: number, rating: number, comment?: string): Promise<ProductReview> {
    return apiRequest(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
    });
  },

  async updateReview(productId: number, id: number, rating?: number, comment?: string): Promise<ProductReview> {
    return apiRequest(`/products/${productId}/reviews/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ rating, comment }),
    });
  },

  async deleteReview(productId: number, id: number): Promise<void> {
    return apiRequest(`/products/${productId}/reviews/${id}`, { method: 'DELETE' });
  },
};
