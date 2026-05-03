import { apiRequest, apiUpload, BASE_URL, formDataAppendPart, type FormDataFilePart } from './api';
import { devLog } from '../utils/devLog';

export type AvatarUploadFile = FormDataFilePart;

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

function resolveMediaUrl(path?: string | null): string | undefined {
  if (path == null || path === '') return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  const base = BASE_URL.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

function str(v: unknown): string | undefined {
  if (v == null) return undefined;
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  return undefined;
}

function pickRecord(json: unknown): Record<string, unknown> | null {
  if (!json || typeof json !== 'object' || Array.isArray(json)) return null;
  const o = json as Record<string, unknown>;
  const data = o.data;
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    return data as Record<string, unknown>;
  }
  const user = o.user;
  if (user && typeof user === 'object' && !Array.isArray(user)) {
    return user as Record<string, unknown>;
  }
  const profile = o.profile;
  if (profile && typeof profile === 'object' && !Array.isArray(profile)) {
    return profile as Record<string, unknown>;
  }
  const result = o.result;
  if (result && typeof result === 'object' && !Array.isArray(result)) {
    return result as Record<string, unknown>;
  }
  return o;
}

function mapCategoryRef(c: Record<string, unknown>): { id: number; name: string } {
  const id = Number(c.id);
  const name =
    str(c.name) ??
    str(c.titleAr) ??
    str(c.titleEn) ??
    str(c.label) ??
    '';
  return { id, name: name || (Number.isFinite(id) ? `#${id}` : '') };
}

/** يوحّد شكل استجابة GET/PATCH /profile مع حقول متعددة من الخادم */
export function normalizeUserProfile(json: unknown): UserProfile {
  const raw = pickRecord(json);
  if (!raw) return { id: 0 };

  const first = str(raw.firstName) ?? str(raw.first_name);
  const last = str(raw.lastName) ?? str(raw.last_name);
  const joined = [first, last].filter(Boolean).join(' ').trim();

  const fullName =
    str(raw.fullName) ??
    str(raw.full_name) ??
    (joined || undefined);

  const categoriesRaw = raw.categories ?? raw.categoryAssignments ?? raw.providerCategories;
  let categories: UserProfile['categories'];
  if (Array.isArray(categoriesRaw)) {
    categories = categoriesRaw
      .map((x) => mapCategoryRef(x as Record<string, unknown>))
      .filter((c) => Number.isFinite(c.id) && c.name.length > 0);
  }

  const offeredRaw = raw.offeredServices ?? raw.offered_services;
  let offeredServices: string[] | undefined;
  if (Array.isArray(offeredRaw)) {
    offeredServices = offeredRaw.map((x) => String(x)).filter(Boolean);
  }

  const avatarRaw = str(raw.avatar) ?? str(raw.avatarUrl) ?? str(raw.avatar_url) ?? str(raw.image);

  const roleRaw = (str(raw.role) ?? str(raw.userRole) ?? '').toUpperCase();
  let role: UserProfile['role'] | undefined =
    roleRaw === 'PROVIDER' || roleRaw === 'CLIENT' ? (roleRaw as UserProfile['role']) : undefined;

  const at = raw.accountType ?? raw.account_type;
  const accountType =
    at === 'COMPANY' ? 'COMPANY'
    : at === 'INDIVIDUAL' ? 'INDIVIDUAL'
    : undefined;

  const isProv =
    raw.isProvider === true ||
    raw.isProvider === 1 ||
    str(raw.type)?.toUpperCase() === 'PROVIDER';
  if (!role && (categories?.length || offeredServices?.length || raw.providerId != null || isProv)) {
    role = 'PROVIDER';
  }

  return {
    id: Number(raw.id ?? raw.userId ?? raw.user_id ?? 0),
    fullName,
    email: str(raw.email),
    phone: str(raw.phone) ?? str(raw.mobile) ?? str(raw.phoneNumber),
    country: str(raw.country),
    nationalId: str(raw.nationalId) ?? str(raw.national_id),
    nationalAddress: str(raw.nationalAddress) ?? str(raw.national_address),
    role,
    accountType,
    avatar: resolveMediaUrl(avatarRaw),
    commercialName: str(raw.commercialName) ?? str(raw.commercial_name),
    offeredServices,
    categories,
  };
}

/** مسار الملف على الخادم الحالي ليس GET /profile (404) — جرّب بالترتيب. */
const PROFILE_GET_PATHS = ['/users/me', '/profile/me', '/providers/me'] as const;
const PROFILE_PATCH_PATHS = ['/users/me', '/profile/me'] as const;

function isWrongRouteError(err: unknown): boolean {
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();
  return (
    msg.includes('cannot get') ||
    msg.includes('cannot patch') ||
    msg.includes('cannot post') ||
    msg.includes('not found') ||
    msg.includes('forbidden') ||
    /\b404\b/.test(msg) ||
    /\b403\b/.test(msg)
  );
}

async function getJsonFirstPath(
  paths: readonly string[],
  init?: RequestInit,
): Promise<{ path: string; json: unknown }> {
  let lastErr: unknown;
  for (const path of paths) {
    try {
      const json = await apiRequest<unknown>(path, init);
      return { path, json };
    } catch (e) {
      lastErr = e;
      if (isWrongRouteError(e)) continue;
      throw e;
    }
  }
  throw lastErr ?? new Error('PROFILE_ROUTE_UNAVAILABLE');
}

export const ProfileService = {
  async getProfile(): Promise<UserProfile> {
    const { path, json } = await getJsonFirstPath(PROFILE_GET_PATHS);
    devLog('profile.getProfile', { usedPath: path, rawResponse: json });
    const normalized = normalizeUserProfile(json);
    devLog('profile.getProfile.normalized', normalized);
    return normalized;
  },

  async updateProfile(payload: {
    fullName?: string;
    email?: string;
    phone?: string;
    country?: string;
    nationalId?: string;
    nationalAddress?: string;
  }): Promise<UserProfile> {
    const init = { method: 'PATCH' as const, body: JSON.stringify(payload) };
    const { path, json } = await getJsonFirstPath(PROFILE_PATCH_PATHS, init);
    devLog('profile.updateProfile', { usedPath: path, rawResponse: json });
    return normalizeUserProfile(json);
  },

  async changePassword(currentPassword: string, newPassword: string, confirmPassword: string): Promise<void> {
    const body = JSON.stringify({ currentPassword, newPassword, confirmPassword });
    try {
      await apiRequest('/profile/me/password', { method: 'PATCH', body });
    } catch (e) {
      if (!isWrongRouteError(e)) throw e;
      await apiRequest('/profile/password', { method: 'PATCH', body });
    }
  },

  async updateProviderProfile(payload: {
    offeredServices?: string[];
    categoryIds?: number[];
  }): Promise<UserProfile> {
    const init = { method: 'PATCH' as const, body: JSON.stringify(payload) };
    try {
      const json = await apiRequest<unknown>('/profile/provider', init);
      return normalizeUserProfile(json);
    } catch (e) {
      if (!isWrongRouteError(e)) throw e;
      const { path, json } = await getJsonFirstPath(PROFILE_PATCH_PATHS, init);
      devLog('profile.updateProviderProfile.fallback', { usedPath: path, rawResponse: json });
      return normalizeUserProfile(json);
    }
  },

  async updateCompanyProfile(payload: {
    commercialName?: string;
    commercialRegistrationNumber?: string;
    nationalAddress?: string;
    taxIdNumber?: string;
    phone?: string;
    email?: string;
  }): Promise<UserProfile> {
    const init = { method: 'PATCH' as const, body: JSON.stringify(payload) };
    try {
      const json = await apiRequest<unknown>('/profile/company', init);
      return normalizeUserProfile(json);
    } catch (e) {
      if (!isWrongRouteError(e)) throw e;
      const { json } = await getJsonFirstPath(PROFILE_PATCH_PATHS, init);
      return normalizeUserProfile(json);
    }
  },

  async uploadAvatar(file: AvatarUploadFile): Promise<UserProfile> {
    const form = new FormData();
    formDataAppendPart(form, 'file', file);
    try {
      const json = await apiUpload<unknown>('/profile/me/avatar', form, 'POST');
      return normalizeUserProfile(json);
    } catch (e) {
      if (!isWrongRouteError(e)) throw e;
      const json = await apiUpload<unknown>('/profile/avatar', form, 'POST');
      return normalizeUserProfile(json);
    }
  },
};
