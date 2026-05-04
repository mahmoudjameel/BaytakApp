import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import {
  messageFromApiErrorJson,
  messageFromInvalidJsonResponse,
  messageFromNonJsonResponse,
} from '../utils/apiErrors';

export const BASE_URL = 'https://api.abdallah-ghazal.cloud';

function getApiBase(): string {
  if (Platform.OS === 'web') {
    return '/api';
  }
  return BASE_URL;
}

const STORAGE_KEYS = {
  ACCESS_TOKEN: '@baytak_access_token',
  REFRESH_TOKEN: '@baytak_refresh_token',
  USER_ID: '@baytak_user_id',
  LAST_LOGIN_EMAIL: '@baytak_last_login_email',
};

/** آخر بريد نجح تسجيل الدخول به — لتعبئة شاشة الدخول فقط (لا تُخزَّن كلمة المرور). */
export const LastLoginStorage = {
  async getEmail(): Promise<string | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.LAST_LOGIN_EMAIL);
  },
  async saveEmail(email: string): Promise<void> {
    const e = email.trim().toLowerCase();
    if (e) await AsyncStorage.setItem(STORAGE_KEYS.LAST_LOGIN_EMAIL, e);
  },
};

export const TokenStorage = {
  async getAccess(): Promise<string | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },
  async getRefresh(): Promise<string | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },
  async getUserId(): Promise<string | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
  },
  async save(accessToken: string, refreshToken: string, userId: number): Promise<void> {
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.ACCESS_TOKEN, accessToken],
      [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
      [STORAGE_KEYS.USER_ID, String(userId)],
    ]);
  },
  async clear(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_ID,
    ]);
  },
};

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await TokenStorage.getRefresh();
  if (!refreshToken) return null;
  try {
    const res = await fetch(`${getApiBase()}/auth/mobile/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) {
      await TokenStorage.clear();
      return null;
    }
    const data = await res.json();
    await TokenStorage.save(data.accessToken, data.refreshToken, data.userId ?? 0);
    return data.accessToken;
  } catch {
    return null;
  }
}

type ApiRequestOptions = RequestInit & { skipAuth?: boolean };

const REQUEST_TIMEOUT_MS = 12000;

function withTimeout(signal?: AbortSignal): { signal: AbortSignal; cancel: () => void } {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  if (signal) signal.addEventListener('abort', () => controller.abort());
  return { signal: controller.signal, cancel: () => clearTimeout(id) };
}

export async function apiRequest<T = any>(
  path: string,
  options: ApiRequestOptions = {},
  retry = true,
): Promise<T> {
  const { skipAuth, ...fetchOptions } = options;
  const token = skipAuth ? null : await TokenStorage.getAccess();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const { signal, cancel } = withTimeout(fetchOptions.signal as AbortSignal | undefined);
  let res: Response;
  try {
    res = await fetch(`${getApiBase()}${path}`, { ...fetchOptions, headers, signal });
  } finally {
    cancel();
  }

  /** جلسة منتهية: نحدّث التوكن ونعيد الطلب. لا ينطبق على مسارات المصادقة (skipAuth) مثل تسجيل الدخول — هناك 401 تعني بيانات خاطئة. */
  if (res.status === 401 && retry && !skipAuth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return apiRequest<T>(path, options as ApiRequestOptions, false);
    }
    throw new Error('UNAUTHORIZED');
  }

  if (res.status === 204) return undefined as T;

  const json = await res.json();
  if (!res.ok) {
    throw new Error(messageFromApiErrorJson(json));
  }
  return json as T;
}

/** طلب بدون Bearer — لمسارات يجب أن تكون عامة على الخادم (مثل قائمة الفئات أثناء التسجيل). */
export async function publicApiRequest<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(`${getApiBase()}${path}`, { ...options, headers });

  if (res.status === 204) return undefined as T;

  const json = await res.json();
  if (!res.ok) {
    throw new Error(messageFromApiErrorJson(json));
  }
  return json as T;
}

/** Blob (ويب) أو { uri } (React Native) — تعريفات DOM لـ FormData أضيق من وقت التشغيل */
export type FormDataFilePart = Blob | { uri: string; name?: string; type?: string };

export function formDataAppendPart(form: FormData, name: string, part: FormDataFilePart): void {
  (form as unknown as { append(key: string, value: unknown): void }).append(name, part);
}

/** يقرأ جسم الرد كـ JSON؛ إذا وصل HTML (يُبدأ بـ <) يعطي رسالة واضحة بدل JSON Parse error */
async function readResponseJson(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text?.trim()) return undefined;
  const trimmed = text.trim();
  if (trimmed.startsWith('<')) {
    throw new Error(messageFromNonJsonResponse(res.status));
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error(messageFromInvalidJsonResponse(res.status));
  }
}

export async function apiUpload<T = any>(
  path: string,
  formData: FormData,
  method = 'POST',
): Promise<T> {
  const token = await TokenStorage.getAccess();
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const { signal, cancel } = withTimeout(undefined);
  let res: Response;
  try {
    res = await fetch(`${getApiBase()}${path}`, {
      method,
      headers,
      body: formData,
      signal,
    });
  } finally {
    cancel();
  }

  if (res.status === 204) return undefined as T;
  const json = await readResponseJson(res);
  if (!res.ok) {
    throw new Error(messageFromApiErrorJson(json));
  }
  return json as T;
}
