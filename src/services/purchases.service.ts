import api from './api';
import { PurchaseOrder } from '../types';

export const purchasesService = {
  getAll: async (): Promise<PurchaseOrder[]> => {
    const response = await api.get<PurchaseOrder[]>('/purchases');
    return response.data;
  },

  create: async (data: {
    productId: string;
    quantity: number;
    costPrice: number;
    salePrice: number;
    supplier?: string;
    invoiceNumber?: string;
    purchaseDate: string;
  }): Promise<PurchaseOrder> => {
    const response = await api.post<PurchaseOrder>('/purchases', data);
    return response.data;
  },
};
