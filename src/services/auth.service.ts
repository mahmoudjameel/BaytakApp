/**
 * عقد الـ API للمصادقة (مختبر ضد الإنتاج):
 * - POST /auth/register — بدون Bearer؛ الجسم يطابق RegisterPayload؛ يعيد { userId } فقط (بدون توكن).
 *   مزوّد: categoryIds مطلوبة (حد أدنى 1) عبر register:categoryRequired.
 * - POST /auth/mobile/sign-in — بدون Bearer؛ يعيد accessToken, refreshToken, userId, expiresIn.
 */
import { apiRequest, TokenStorage } from './api';
import { devLog, devLogRedacted } from '../utils/devLog';

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
  /** مدينة من GET /cities */
  cityId?: number;
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
  cityId?: number;
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
  cityId?: number;
};

export type RegisterPayload =
  | RegisterClientPayload
  | RegisterProviderIndividualPayload
  | RegisterProviderCompanyPayload;

export const AuthService = {
  async signIn(email: string, password: string): Promise<AuthTokens> {
    devLog('auth.signIn.request', { email });
    const data = await apiRequest<AuthTokens>(
      '/auth/mobile/sign-in',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        skipAuth: true,
      },
    );
    devLogRedacted('auth.signIn.response', {
      userId: data.userId,
      expiresIn: data.expiresIn,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
    await TokenStorage.save(data.accessToken, data.refreshToken, data.userId);
    return data;
  },

  async register(payload: RegisterPayload): Promise<{ userId: number }> {
    devLog('auth.register.request', {
      ...(payload as unknown as Record<string, unknown>),
      password: '[redacted]',
    });
    const result = await apiRequest<unknown>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
      skipAuth: true,
    });
    devLog('auth.register.response', result);
    return result as { userId: number };
  },

  async requestOtp(phone: string): Promise<{ expiresAt: string; devOtp?: string }> {
    return apiRequest('/auth/mobile/request-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
      skipAuth: true,
    });
  },

  async verifyOtp(phone: string, code: string): Promise<AuthTokens> {
    const data = await apiRequest<AuthTokens>('/auth/mobile/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
      skipAuth: true,
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
