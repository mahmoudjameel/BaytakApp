import { apiRequest } from './api';

export type Address = {
  id: number;
  title?: string;
  street?: string;
  district?: string;
  city?: string;
  postalCode?: string;
  block?: string;
  phone?: string;
  isDefault?: boolean;
};

export type CreateAddressPayload = {
  title?: string;
  street?: string;
  district?: string;
  city?: string;
  postalCode?: string;
  block?: string;
  phone?: string;
  isDefault?: boolean;
};

function str(v: unknown): string | undefined {
  if (v == null || v === '') return undefined;
  return String(v);
}

function normalizeAddress(raw: unknown): Address {
  if (!raw || typeof raw !== 'object') return { id: 0 };
  const o = raw as Record<string, unknown>;
  return {
    id: Number(o.id ?? 0),
    title: str(o.title ?? o.label ?? o.name),
    street: str(o.street ?? o.streetName ?? o.street_name),
    district: str(o.district),
    city: str(o.city),
    postalCode: str(o.postalCode ?? o.postal_code ?? o.zipCode),
    block: str(o.block),
    phone: str(o.phone ?? o.phoneNumber ?? o.phone_number),
    isDefault: Boolean(o.isDefault ?? o.is_default ?? false),
  };
}

function normalizeList(json: unknown): Address[] {
  if (Array.isArray(json)) return json.map(normalizeAddress);
  if (json && typeof json === 'object') {
    const o = json as Record<string, unknown>;
    const list =
      Array.isArray(o.data) ? o.data :
      Array.isArray(o.items) ? o.items :
      Array.isArray(o.addresses) ? o.addresses : null;
    if (list) return list.map(normalizeAddress);
  }
  return [];
}

export const AddressesService = {
  async getAll(): Promise<Address[]> {
    const json = await apiRequest<unknown>('/addresses');
    return normalizeList(json);
  },

  async getOne(id: number): Promise<Address> {
    const json = await apiRequest<unknown>(`/addresses/${id}`);
    return normalizeAddress(json);
  },

  async create(payload: CreateAddressPayload): Promise<Address> {
    const json = await apiRequest<unknown>('/addresses', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return normalizeAddress(json);
  },

  async update(id: number, payload: Partial<CreateAddressPayload>): Promise<Address> {
    const json = await apiRequest<unknown>(`/addresses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    return normalizeAddress(json);
  },

  async remove(id: number): Promise<void> {
    await apiRequest<void>(`/addresses/${id}`, { method: 'DELETE' });
  },
};
