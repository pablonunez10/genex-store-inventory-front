export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'VENDEDOR';
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  currentStock: number;
  salePrice: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrder {
  id: string;
  productId: string;
  quantity: number;
  costPrice: string;
  salePrice: string;
  totalCost: string;
  supplier?: string;
  invoiceNumber?: string;
  purchaseDate: string;
  createdBy: string;
  createdAt: string;
  product?: Product;
}

export interface Sale {
  id: string;
  totalAmount: string;
  sellerId: string;
  sellerName: string;
  saleDate: string;
  createdAt: string;
  items: SaleItem[];
}

export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: string;
  subtotal: string;
}

export interface SalesReport {
  date: string;
  summary: {
    totalAmount: number;
    totalSales: number;
    totalItems: number;
  };
  sales: Sale[];
}
