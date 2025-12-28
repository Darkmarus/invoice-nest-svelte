// src/models/product_request.ts
export interface CreateProductRequest {
  name: string;
  price: number;
  stock: number;
  details: string;
  images?: File[];
}

export interface UpdateProductRequest {
  name?: string;
  price?: number;
  stock?: number;
  details?: string;
  enabled?: boolean;
}
