import { apiRequest } from './api';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type Booking = {
  id: number;
  status: BookingStatus;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  address?: string;
  notes?: string;
  provider?: {
    id: number;
    fullName?: string;
    commercialName?: string;
    avatar?: string;
  };
  subCategory?: { id: number; name: string };
  createdAt?: string;
};

export const BookingsService = {
  async create(payload: {
    providerId: number;
    subCategoryId?: number;
    availabilityId?: number;
    scheduledDate: string;
    startTime: string;
    endTime: string;
    address?: string;
    notes?: string;
  }): Promise<Booking> {
    return apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async update(id: number, payload: {
    scheduledDate?: string;
    startTime?: string;
    endTime?: string;
    address?: string;
    notes?: string;
  }): Promise<Booking> {
    return apiRequest(`/bookings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  async updateStatus(id: number, status: BookingStatus): Promise<Booking> {
    return apiRequest(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async getMyBookings(): Promise<Booking[]> {
    return apiRequest('/bookings/my');
  },
};
