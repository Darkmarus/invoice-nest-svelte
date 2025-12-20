import type { ICommandHandler } from '@app/application/utils/command-handler.interface';
import { ProductNotFoundException } from '@app/domain/errors/product-not-found.error';
import { Product } from '@app/domain/models/product.model';
import { ProductRepository } from '@app/domain/repositories/product.repository';
import { GetProductByIdQuery } from '../get-product-by-id.query';

export class GetProductByIdHandler implements ICommandHandler<
  GetProductByIdQuery,
  Product
> {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(query: GetProductByIdQuery): Promise<Product> {
    const product = await this.productRepository.findById(query.id);

    if (!product) {
      throw new ProductNotFoundException(query.id);
    }

    return product;
  }
}
