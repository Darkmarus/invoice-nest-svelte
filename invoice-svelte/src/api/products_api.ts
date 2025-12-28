import type { CreateProductRequest, UpdateProductRequest } from '../models/product_request';
import type { ProductResponse, ProductsResponse } from '../models/product_response';
import { apiUrl } from '../stores/config_store';
import { apiClient, ApiError } from './fetch_wrapper';

export interface ProductParams {
  page?: number;
  limit?: number;
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  enabled?: boolean;
  sortBy?: 'name' | 'price' | 'stock' | 'created_at' | 'updated_at';
  sortOrder?: 'ASC' | 'DESC';
}

export class ProductApiService {
  async fetchProducts(params?: ProductParams): Promise<[ApiError | null, ProductsResponse | null]> {
    return apiClient.get<ProductsResponse>(`${apiUrl()}/products`, { ...params });
  }

  async createProduct(data: CreateProductRequest): Promise<[ApiError | null, void | null]> {
    const formData = new FormData();
    const productBody = {
      name: data.name,
      details: data.details,
      price: data.price,
      stock: data.stock,
    };
    formData.append('body', JSON.stringify(productBody));
    if (data.images) {
      data.images.forEach((file, index) => {
        formData.append('files', file);
      });
    }
    return apiClient.postForm<void>(`${apiUrl()}/products`, formData);
  }

  async fetchProduct(id: string): Promise<[ApiError | null, ProductResponse | null]> {
    return apiClient.get<ProductResponse>(`${apiUrl()}/products/${id}`);
  }

  async updateProduct(id: string, data: UpdateProductRequest): Promise<[ApiError | null, ProductResponse | null]> {
    return apiClient.put<ProductResponse>(`${apiUrl()}/products/${id}`, data);
  }

  async deleteProduct(id: string): Promise<[ApiError | null, void | null]> {
    return apiClient.delete<void>(`${apiUrl()}/products/${id}`);
  }
}

export const productApiService = new ProductApiService();
