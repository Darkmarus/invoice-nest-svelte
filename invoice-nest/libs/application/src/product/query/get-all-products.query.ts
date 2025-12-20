import type { ICommand } from '@app/application/utils/command.interface';
import type {
  ProductFilters,
  PaginationParams,
  PaginatedResult,
} from '@app/domain/repositories/product-filters.interface';
import type { Product } from '@app/domain/models/product.model';

export class GetAllProductsQuery implements ICommand<PaginatedResult<Product>> {
  constructor(
    public readonly filters: ProductFilters,
    public readonly pagination: PaginationParams,
  ) {}
}
