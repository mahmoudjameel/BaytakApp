import { publicApiRequest } from './api';

export type City = {
  id: number;
  nameEn: string;
  nameAr: string;
  region?: string;
};

/** سطر عنوان وطني مرتب: «المدينة، المنطقة» أو اسم المدينة فقط */
export function formatSaudiCityNationalLine(city: City, useArabic: boolean): string {
  const name = useArabic ? city.nameAr : city.nameEn;
  const r = city.region?.trim();
  if (!r) return name;
  return useArabic ? `${name}، ${r}` : `${name}, ${r}`;
}

function scoreCityMatch(city: City, raw: string): number {
  const q = raw.trim();
  if (!q) return 99;
  const ql = q.toLowerCase();
  if (city.nameAr.startsWith(q) || city.nameEn.toLowerCase().startsWith(ql)) return 0;
  if (city.nameAr.includes(q) || city.nameEn.toLowerCase().includes(ql)) return 1;
  const reg = city.region?.trim() ?? '';
  if (reg && (reg.includes(q) || reg.toLowerCase().includes(ql))) return 2;
  return 3;
}

/** تصفية وترتيب مدن السعودية حسب نص البحث (عربي/إنجليزي/منطقة) */
export function filterSaudiCitiesForQuery(cities: City[], query: string, limit = 20): City[] {
  const q = query.trim();
  if (!q) return [];
  const ql = q.toLowerCase();
  const hits = cities.filter(
    (c) =>
      c.nameEn.toLowerCase().includes(ql) ||
      c.nameAr.includes(q) ||
      (c.region?.toLowerCase().includes(ql) ?? false) ||
      (c.region?.includes(q) ?? false),
  );
  hits.sort((a, b) => scoreCityMatch(a, q) - scoreCityMatch(b, q) || a.nameAr.localeCompare(b.nameAr, 'ar'));
  return hits.slice(0, limit);
}

export const CitiesService = {
  /** قائمة مدن السعودية — الاستجابة مصفوفة مباشرة من الخادم */
  async getAll(): Promise<City[]> {
    const json = await publicApiRequest<unknown>('/cities');
    if (Array.isArray(json)) return json as City[];
    if (json && typeof json === 'object' && Array.isArray((json as { data?: unknown }).data)) {
      return (json as { data: City[] }).data;
    }
    return [];
  },
};
