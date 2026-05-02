import { apiRequest, apiUpload } from './api';

export type UserProfile = {
  id: number;
  fullName?: string;
  email?: string;
  phone?: string;
  country?: string;
  nationalId?: string;
  nationalAddress?: string;
  role?: 'CLIENT' | 'PROVIDER';
  accountType?: 'INDIVIDUAL' | 'COMPANY';
  avatar?: string;
  commercialName?: string;
  offeredServices?: string[];
  categories?: { id: number; name: string }[];
};

export const ProfileService = {
  async getProfile(): Promise<UserProfile> {
    return apiRequest('/profile');
  },

  async updateProfile(payload: {
    fullName?: string;
    email?: string;
    phone?: string;
    country?: string;
    nationalId?: string;
    nationalAddress?: string;
  }): Promise<UserProfile> {
    return apiRequest('/profile', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  async changePassword(currentPassword: string, newPassword: string, confirmPassword: string): Promise<void> {
    return apiRequest('/profile/password', {
      method: 'PATCH',
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
    });
  },

  async updateProviderProfile(payload: {
    offeredServices?: string[];
    categoryIds?: number[];
  }): Promise<UserProfile> {
    return apiRequest('/profile/provider', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  async updateCompanyProfile(payload: {
    commercialName?: string;
    commercialRegistrationNumber?: string;
    nationalAddress?: string;
    taxIdNumber?: string;
    phone?: string;
    email?: string;
  }): Promise<UserProfile> {
    return apiRequest('/profile/company', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  async uploadAvatar(file: any): Promise<UserProfile> {
    const form = new FormData();
    form.append('file', file);
    return apiUpload('/profile/avatar', form, 'POST');
  },
};
