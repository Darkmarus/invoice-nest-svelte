import type { CreateProductRequest, UpdateProductRequest } from '../models/product_request';
import type { ProductResponse, ProductsResponse } from '../models/product_response';
import { apiUrl } from '../stores/config_store';
import { apiClient, ApiError } from './fetch_wrapper';

export class ProductApiService {
  async fetchProducts(params?: {
    page?: number;
    limit?: number;
    name?: string;
    minPrice?: number;
    maxPrice?: number;
    enabled?: boolean;
    sortBy?: 'name' | 'price' | 'stock' | 'created_at' | 'updated_at';
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<ProductsResponse> {
    try {
      return await apiClient.get<ProductsResponse>(`${apiUrl()}/products`, params);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to fetch products: ${error.message}`);
      }
      throw error;
    }
  }

  async createProduct(data: CreateProductRequest): Promise<void> {
    try {
      await apiClient.post<void>(`${apiUrl()}/products`, data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to create product: ${error.message}`);
      }
      throw error;
    }
  }

  async fetchProduct(id: string): Promise<ProductResponse> {
    try {
      return await apiClient.get<ProductResponse>(`${apiUrl()}/products/${id}`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to fetch product: ${error.message}`);
      }
      throw error;
    }
  }

  async updateProduct(id: string, data: UpdateProductRequest): Promise<ProductResponse> {
    try {
      return await apiClient.put<ProductResponse>(`${apiUrl()}/products/${id}`, data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to update product: ${error.message}`);
      }
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await apiClient.delete<void>(`${apiUrl()}/products/${id}`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to delete product: ${error.message}`);
      }
      throw error;
    }
  }
}

export const productApiService = new ProductApiService();
