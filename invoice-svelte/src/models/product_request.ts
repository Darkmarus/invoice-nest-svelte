// src/models/product_request.ts
import type { FileResponse } from './product_response';

export interface CreateProductRequest {
  name: string;
  price: number;
  stock: number;
  details: string;
  images?: File[];
}

export interface UpdateProductImage {
  id: string;
  order: number;
}

export interface CombinedImage {
  type: 'existing' | 'new';
  data: FileResponse | File;
}

export interface UpdateProductRequest {
  name?: string;
  price?: number;
  stock?: number;
  details?: string;
  enabled?: boolean;
  images?: UpdateProductImage[];
  newImages?: File[];
  newOrders?: number[];
}
