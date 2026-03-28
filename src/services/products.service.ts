import api from './api';
import { Product, ProductVariant } from '../types';

export const productsService = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  create: async (data: {
    name: string;
    sku: string;
    description?: string;
    salePrice: number;
    categoryId: string;
  }): Promise<Product> => {
    const response = await api.post<Product>('/products', data);
    return response.data;
  },

  update: async (id: string, data: {
    name?: string;
    description?: string;
    salePrice?: number;
    categoryId?: string;
    currentStock?: number;
    isActive?: boolean;
  }): Promise<Product> => {
    const response = await api.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  // Variantes
  createVariant: async (productId: string, data: {
    name: string;
    sku: string;
    salePrice: number;
  }): Promise<ProductVariant> => {
    const response = await api.post<ProductVariant>(`/products/${productId}/variants`, data);
    return response.data;
  },

  updateVariant: async (variantId: string, data: {
    name?: string;
    salePrice?: number;
    currentStock?: number;
    isActive?: boolean;
  }): Promise<ProductVariant> => {
    const response = await api.put<ProductVariant>(`/products/variants/${variantId}`, data);
    return response.data;
  },

  deleteVariant: async (variantId: string): Promise<void> => {
    await api.delete(`/products/variants/${variantId}`);
  },
};
