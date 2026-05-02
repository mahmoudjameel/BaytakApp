import AsyncStorage from '@react-native-async-storage/async-storage';

export const BASE_URL = 'https://api.abdallah-ghazal.cloud';

const STORAGE_KEYS = {
  ACCESS_TOKEN: '@baytak_access_token',
  REFRESH_TOKEN: '@baytak_refresh_token',
  USER_ID: '@baytak_user_id',
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
    const res = await fetch(`${BASE_URL}/auth/mobile/refresh`, {
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

export async function apiRequest<T = any>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const token = await TokenStorage.getAccess();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401 && retry) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return apiRequest<T>(path, options, false);
    }
    throw new Error('UNAUTHORIZED');
  }

  if (res.status === 204) return undefined as T;

  const json = await res.json();
  if (!res.ok) {
    const message = json?.message ?? json?.error ?? `HTTP ${res.status}`;
    throw new Error(Array.isArray(message) ? message.join(', ') : message);
  }
  return json as T;
}

export async function apiUpload<T = any>(
  path: string,
  formData: FormData,
  method = 'POST',
): Promise<T> {
  const token = await TokenStorage.getAccess();
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: formData,
  });

  if (res.status === 204) return undefined as T;
  const json = await res.json();
  if (!res.ok) {
    const message = json?.message ?? json?.error ?? `HTTP ${res.status}`;
    throw new Error(Array.isArray(message) ? message.join(', ') : message);
  }
  return json as T;
}
