// src/models/product_response.ts
export interface ProductResponse {
  id: string;
  name: string;
  details: string;
  stock: number;
  price: number;
  enabled: boolean;
  created_at: string;
  updated_at: string;
  description?: string;
  category?: string;
  images?: string[];
}

export interface ProductsResponse {
  data: ProductResponse[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
