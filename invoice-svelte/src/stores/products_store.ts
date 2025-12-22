import { writable } from 'svelte/store';
import { productApiService } from '../api/products_api';
import type { CreateProductRequest } from '../models/product_request';
import type { ProductResponse, ProductsResponse } from '../models/product_response';

export interface ProductsState {
  data: ProductResponse[];
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const initialState: ProductsState = {
  data: [],
  loading: false,
  error: null,
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

function createProductsStore() {
  const { subscribe, set, update } = writable<ProductsState>(initialState);
  let currentParams: any = {};

  const fetchData = async (params: any) => {
    currentParams = params;
    update((state) => ({ ...state, loading: true, error: null }));
    try {
      const response: ProductsResponse = await productApiService.fetchProducts(params);
      set({
        data: response.data,
        loading: false,
        error: null,
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (error) {
      update((state) => ({
        ...state,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  };

  return {
    subscribe,
    fetch: fetchData,
    create: async (data: CreateProductRequest) => {
      try {
        await productApiService.createProduct(data);
        await fetchData(currentParams);
      } catch (error) {
        throw error;
      }
    },
  };
}

export const productsStore = createProductsStore();
