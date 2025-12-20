import type { ICommandHandler } from '@app/application/utils/command-handler.interface';
import { ProductNotFoundException } from '@app/domain/errors/product-not-found.error';
import { Product } from '@app/domain/models/product.model';
import { ProductRepository } from '@app/domain/repositories/product.repository';

import { UpdateProductCommand } from '../update-product.command';

export class UpdateProductHandler implements ICommandHandler<
  UpdateProductCommand,
  Product
> {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(command: UpdateProductCommand): Promise<Product> {
    const existingProduct = await this.productRepository.findById(command.id);

    if (!existingProduct) {
      throw new ProductNotFoundException(command.id);
    }

    if (command.name !== undefined) {
      existingProduct._name = command.name;
    }
    if (command.price !== undefined) {
      existingProduct._price = command.price;
    }
    if (command.stock !== undefined) {
      existingProduct._stock = command.stock;
    }
    if (command.enabled !== undefined) {
      existingProduct._enabled = command.enabled;
    }

    existingProduct._updated_at = new Date();

    return await this.productRepository.update(existingProduct);
  }
}
