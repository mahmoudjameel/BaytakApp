import { apiRequest } from './api';
import { PaginatedResponse } from './categories.service';

export type Provider = {
  id: number;
  fullName?: string;
  commercialName?: string;
  email?: string;
  phone?: string;
  nationalAddress?: string;
  accountType: 'INDIVIDUAL' | 'COMPANY';
  isAvailable?: boolean;
  rating?: number;
  reviewCount?: number;
  avatar?: string;
  categories?: { id: number; name: string }[];
};

export type ProviderReview = {
  id: number;
  rating: number;
  comment?: string;
  createdAt: string;
  reviewer?: { id: number; fullName: string };
};

function normalizeProviderList(json: unknown): PaginatedResponse<Provider> {
  if (Array.isArray(json)) {
    return { data: json as Provider[], total: json.length, page: 1, limit: json.length };
  }
  if (json && typeof json === 'object') {
    const o = json as Record<string, unknown>;
    const list =
      Array.isArray(o.data) ? o.data :
      Array.isArray(o.items) ? o.items :
      Array.isArray(o.providers) ? o.providers : null;
    if (list) {
      return {
        data: list as Provider[],
        total: typeof o.total === 'number' ? o.total : list.length,
        page: typeof o.page === 'number' ? o.page : 1,
        limit: typeof o.limit === 'number' ? o.limit : list.length,
      };
    }
  }
  return { data: [], total: 0, page: 1, limit: 0 };
}

export const ProvidersService = {
  async getAll(params?: {
    search?: string;
    categoryId?: number;
    isAvailable?: boolean;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Provider>> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.categoryId) query.set('categoryId', String(params.categoryId));
    if (params?.isAvailable !== undefined) query.set('isAvailable', String(params.isAvailable));
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    const qs = query.toString();
    const json = await apiRequest<unknown>(`/providers${qs ? `?${qs}` : ''}`);
    return normalizeProviderList(json);
  },

  async getOne(id: number): Promise<Provider> {
    return apiRequest(`/providers/${id}`);
  },

  async getReviews(providerId: number): Promise<ProviderReview[]> {
    return apiRequest(`/providers/${providerId}/reviews`);
  },

  async createReview(providerId: number, rating: number, comment?: string): Promise<ProviderReview> {
    return apiRequest(`/providers/${providerId}/reviews`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
    });
  },

  async updateReview(providerId: number, id: number, rating?: number, comment?: string): Promise<ProviderReview> {
    return apiRequest(`/providers/${providerId}/reviews/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ rating, comment }),
    });
  },

  async deleteReview(providerId: number, id: number): Promise<void> {
    return apiRequest(`/providers/${providerId}/reviews/${id}`, { method: 'DELETE' });
  },

  async setAvailability(providerId: number, slots: { dayOfWeek?: number | null; startTime: string; endTime: string }[]): Promise<void> {
    return apiRequest(`/providers/${providerId}/availability/bulk`, {
      method: 'POST',
      body: JSON.stringify({ slots }),
    });
  },
};
