export interface ProductFilters {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  enabled?: boolean;
  sortBy?: 'name' | 'price' | 'stock' | 'created_at' | 'updated_at';
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
