import { apiRequest, TokenStorage, BASE_URL } from './api';

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  userId: number;
};

export type RegisterClientPayload = {
  role: 'CLIENT';
  accountType: 'INDIVIDUAL';
  fullName: string;
  email: string;
  phone: string;
  password: string;
};

export type RegisterProviderIndividualPayload = {
  role: 'PROVIDER';
  accountType: 'INDIVIDUAL';
  fullName: string;
  email: string;
  phone: string;
  password: string;
  nationalAddress: string;
  categoryIds: number[];
};

export type RegisterProviderCompanyPayload = {
  role: 'PROVIDER';
  accountType: 'COMPANY';
  email: string;
  phone: string;
  password: string;
  commercialRegistrationNumber: string;
  taxIdNumber: string;
  commercialName: string;
  nationalAddress?: string;
  categoryIds: number[];
};

export type RegisterPayload =
  | RegisterClientPayload
  | RegisterProviderIndividualPayload
  | RegisterProviderCompanyPayload;

export const AuthService = {
  async signIn(email: string, password: string): Promise<AuthTokens> {
    const data = await apiRequest<AuthTokens>('/auth/mobile/sign-in', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    await TokenStorage.save(data.accessToken, data.refreshToken, data.userId);
    return data;
  },

  async register(payload: RegisterPayload): Promise<{ userId: number }> {
    return apiRequest<{ userId: number }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async requestOtp(phone: string): Promise<{ expiresAt: string; devOtp?: string }> {
    return apiRequest('/auth/mobile/request-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  },

  async verifyOtp(phone: string, code: string): Promise<AuthTokens> {
    const data = await apiRequest<AuthTokens>('/auth/mobile/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
    });
    await TokenStorage.save(data.accessToken, data.refreshToken, data.userId);
    return data;
  },

  async signOut(): Promise<void> {
    const refreshToken = await TokenStorage.getRefresh();
    if (refreshToken) {
      await apiRequest('/auth/mobile/sign-out', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      }).catch(() => {});
    }
    await TokenStorage.clear();
  },
};
