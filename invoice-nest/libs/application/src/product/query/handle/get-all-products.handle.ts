import type { ICommandHandler } from '@app/application/utils/command-handler.interface';
import { Product } from '@app/domain/models/product.model';
import type { PaginatedResult } from '@app/domain/repositories/product-filters.interface';
import { ProductRepository } from '@app/domain/repositories/product.repository';
import { GetAllProductsQuery } from '../get-all-products.query';

export class GetAllProductsHandler implements ICommandHandler<
  GetAllProductsQuery,
  PaginatedResult<Product>
> {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(query: GetAllProductsQuery): Promise<PaginatedResult<Product>> {
    return await this.productRepository.findWithFilters(
      query.filters,
      query.pagination,
    );
  }
}
