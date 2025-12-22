// src/models/product_request.ts
export interface CreateProductRequest {
  name: string;
  price: number;
  stock: number;
}

export interface UpdateProductRequest {
  name?: string;
  price?: number;
  stock?: number;
  enabled?: boolean;
}
