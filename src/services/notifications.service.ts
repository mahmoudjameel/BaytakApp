import { apiRequest } from './api';

export type NotificationChannel = 'IN_APP' | 'SMS' | 'EMAIL' | 'FCM';

export const NotificationsService = {
  async registerDeviceToken(token: string, platform: 'ios' | 'android' | 'web'): Promise<void> {
    return apiRequest('/notifications/device-token', {
      method: 'POST',
      body: JSON.stringify({ token, platform }),
    });
  },

  async send(payload: {
    userId: number;
    title: string;
    body: string;
    data?: Record<string, unknown>;
    channels?: NotificationChannel[];
  }): Promise<void> {
    return apiRequest('/notifications', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
