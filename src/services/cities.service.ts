import { publicApiRequest } from './api';

export type City = {
  id: number;
  nameEn: string;
  nameAr: string;
  region?: string;
};

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
