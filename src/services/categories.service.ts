import { apiRequest, publicApiRequest, BASE_URL } from './api';

export type SubCategory = {
  id: number;
  categoryId: number;
  name: string;
  nameAr?: string;
  nameEn?: string;
  icon?: string;
  image?: string;
};

export type Category = {
  id: number;
  name: string;
  nameAr?: string;
  nameEn?: string;
  icon?: string;
  image?: string;
  /** فئات فرعية من الـ API (أب/أبناء) */
  subCategories?: SubCategory[];
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};

function resolveMediaUrl(path?: string | null): string | undefined {
  if (path == null || path === '') return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  const base = BASE_URL.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

function mapSubCategory(raw: Record<string, unknown>): SubCategory {
  const titleAr = raw.titleAr as string | undefined;
  const titleEn = raw.titleEn as string | undefined;
  const legacyName = raw.name as string | undefined;
  return {
    id: Number(raw.id),
    categoryId: Number(raw.categoryId ?? raw.category_id),
    name: titleAr || titleEn || legacyName || '',
    nameAr: titleAr,
    nameEn: titleEn,
    image: resolveMediaUrl((raw.icon ?? raw.image) as string | undefined),
  };
}

function mapCategoryRow(raw: Record<string, unknown>): Category {
  const titleAr = raw.titleAr as string | undefined;
  const titleEn = raw.titleEn as string | undefined;
  const legacyName = raw.name as string | undefined;
  const name = titleAr || titleEn || legacyName || '';
  const subsRaw = raw.subCategories ?? raw.sub_categories ?? raw.children;
  const subs = Array.isArray(subsRaw)
    ? subsRaw.map((s) => mapSubCategory(s as Record<string, unknown>))
    : undefined;

  return {
    id: Number(raw.id),
    name,
    nameAr: titleAr,
    nameEn: titleEn,
    image: resolveMediaUrl((raw.icon ?? raw.image) as string | undefined),
    subCategories: subs && subs.length > 0 ? subs : undefined,
  };
}

function asPaginatedCategories(json: unknown): PaginatedResponse<Category> {
  if (Array.isArray(json)) {
    const data = json.map((row) => mapCategoryRow(row as Record<string, unknown>));
    return { data, total: data.length, page: 1, limit: data.length };
  }
  if (json && typeof json === 'object') {
    const o = json as Record<string, unknown>;
    const list =
      Array.isArray(o.data) ? o.data
      : Array.isArray(o.items) ? o.items
      : Array.isArray(o.categories) ? o.categories
      : null;
    if (list) {
      const rows = list.map((item) => mapCategoryRow(item as Record<string, unknown>));
      return {
        data: rows,
        total: typeof o.total === 'number' ? o.total : rows.length,
        page: typeof o.page === 'number' ? o.page : 1,
        limit: typeof o.limit === 'number' ? o.limit : rows.length,
      };
    }
  }
  return { data: [], total: 0, page: 1, limit: 0 };
}

/** اسم العرض حسب لغة الواجهة */
export function categoryDisplayName(
  c: Pick<Category | SubCategory, 'name' | 'nameAr' | 'nameEn'>,
  preferAr: boolean,
): string {
  if (preferAr) return c.nameAr || c.name || c.nameEn || '';
  return c.nameEn || c.name || c.nameAr || '';
}

/** عناصر قابلة للاختيار: الفرعية إن وُجدت، وإلا الفئة الأم فقط */
export function getSelectableServiceItems(parent: Category): SubCategory[] {
  if (parent.subCategories?.length) return parent.subCategories;
  return [
    {
      id: parent.id,
      categoryId: parent.id,
      name: parent.name,
      nameAr: parent.nameAr,
      nameEn: parent.nameEn,
      image: parent.image,
    },
  ];
}

export const CategoriesService = {
  async getAll(params?: { search?: string; page?: number; limit?: number }): Promise<PaginatedResponse<Category>> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    const qs = query.toString();
    const json = await apiRequest<unknown>(`/categories${qs ? `?${qs}` : ''}`);
    return asPaginatedCategories(json);
  },

  async getAllPublic(params?: { search?: string; page?: number; limit?: number }): Promise<PaginatedResponse<Category>> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    const qs = query.toString();
    const json = await publicApiRequest<unknown>(`/categories${qs ? `?${qs}` : ''}`);
    return asPaginatedCategories(json);
  },

  async getOne(id: number): Promise<Category> {
    const json = await apiRequest<unknown>(`/categories/${id}`);
    if (json && typeof json === 'object') return mapCategoryRow(json as Record<string, unknown>);
    return { id, name: '' };
  },

  async getSubCategories(categoryId: number): Promise<SubCategory[]> {
    return apiRequest(`/categories/${categoryId}/sub-categories`);
  },

  async getSubCategory(categoryId: number, id: number): Promise<SubCategory> {
    return apiRequest(`/categories/${categoryId}/sub-categories/${id}`);
  },
};
