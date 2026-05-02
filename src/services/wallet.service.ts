import { apiRequest } from './api';

export type Wallet = {
  id: number;
  balance: number;
  currency?: string;
  userId?: number;
};

export type WalletTransaction = {
  id: number;
  amount: number;
  description?: string;
  reference?: string;
  createdAt?: string;
  type?: 'CREDIT' | 'DEBIT';
};

export const WalletService = {
  async getWallet(): Promise<Wallet> {
    return apiRequest('/wallet');
  },

  async getTransactions(): Promise<WalletTransaction[]> {
    return apiRequest('/wallet/transactions');
  },

  async createTransaction(payload: {
    amount: number;
    description?: string;
    reference?: string;
  }): Promise<WalletTransaction> {
    return apiRequest('/wallet/transactions', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
