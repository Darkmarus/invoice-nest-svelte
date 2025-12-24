import { Product } from '../models/product.model';
import type {
  ProductFilters,
  PaginationParams,
  PaginatedResult,
} from './product-filters.interface';

export abstract class ProductRepository {
  abstract save(product: Product, trx?: any): Promise<Product>;
  abstract findById(id: string): Promise<Product | null>;
  abstract findAll(): Promise<Product[]>;
  abstract findWithFilters(
    filters: ProductFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Product>>;
  abstract update(product: Product): Promise<Product>;
  abstract delete(id: string): Promise<void>;
}
