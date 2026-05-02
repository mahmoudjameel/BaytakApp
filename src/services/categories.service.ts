import { apiRequest } from './api';

export type Category = {
  id: number;
  name: string;
  nameAr?: string;
  icon?: string;
  image?: string;
};

export type SubCategory = {
  id: number;
  name: string;
  nameAr?: string;
  categoryId: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};

export const CategoriesService = {
  async getAll(params?: { search?: string; page?: number; limit?: number }): Promise<PaginatedResponse<Category>> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    const qs = query.toString();
    return apiRequest(`/categories${qs ? `?${qs}` : ''}`);
  },

  async getOne(id: number): Promise<Category> {
    return apiRequest(`/categories/${id}`);
  },

  async getSubCategories(categoryId: number): Promise<SubCategory[]> {
    return apiRequest(`/categories/${categoryId}/sub-categories`);
  },

  async getSubCategory(categoryId: number, id: number): Promise<SubCategory> {
    return apiRequest(`/categories/${categoryId}/sub-categories/${id}`);
  },
};
