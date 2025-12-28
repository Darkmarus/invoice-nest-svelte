import { writable } from 'svelte/store';
import { productApiService, type ProductParams } from '../api/products_api';
import type { CreateProductRequest, UpdateProductRequest } from '../models/product_request';
import type { ProductResponse } from '../models/product_response';

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
  let currentParams: ProductParams = {};

  const fetchData = async (params: ProductParams) => {
    currentParams = params;
    update((state) => ({ ...state, loading: true, error: null }));
    const [err, response] = await productApiService.fetchProducts(params);
    if (err) {
      update((state) => ({
        ...state,
        loading: false,
        error: err.message,
      }));
    } else {
      set({
        data: response!.data,
        loading: false,
        error: null,
        page: response!.page,
        limit: response!.limit,
        total: response!.total,
        totalPages: response!.totalPages,
      });
    }
  };

  return {
    subscribe,
    fetch: fetchData,
    fetchProduct: async (id: string) => {
      const [err, product] = await productApiService.fetchProduct(id);
      if (err) {
        throw new Error(err.message);
      }
      return product;
    },
    create: async (data: CreateProductRequest) => {
      const [err] = await productApiService.createProduct(data);
      if (err) {
        throw new Error(err.message);
      }
      await fetchData(currentParams);
    },
    update: async (id: string, data: UpdateProductRequest) => {
      const [err] = await productApiService.updateProduct(id, data);
      if (err) {
        throw new Error(err.message);
      }
      await fetchData(currentParams);
    },
    delete: async (id: string) => {
      const [err] = await productApiService.deleteProduct(id);
      if (err) {
        throw new Error(err.message);
      }
      await fetchData(currentParams);
    },
  };
}

export const productsStore = createProductsStore();
