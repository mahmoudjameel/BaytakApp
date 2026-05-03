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
    return apiRequest(`/providers${qs ? `?${qs}` : ''}`);
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
