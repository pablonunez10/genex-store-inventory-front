import api from './api';
import { Sale, SalesReport } from '../types';

export const salesService = {
  getAll: async (): Promise<Sale[]> => {
    const response = await api.get<Sale[]>('/sales');
    return response.data;
  },

  getMySales: async (): Promise<Sale[]> => {
    const response = await api.get<Sale[]>('/sales/my-sales');
    return response.data;
  },

  getReport: async (date: string): Promise<SalesReport> => {
    const response = await api.get<SalesReport>(`/sales/report?date=${date}`);
    return response.data;
  },

  create: async (items: { productId: string; quantity: number }[]): Promise<Sale> => {
    const response = await api.post<Sale>('/sales', { items });
    return response.data;
  },
};
