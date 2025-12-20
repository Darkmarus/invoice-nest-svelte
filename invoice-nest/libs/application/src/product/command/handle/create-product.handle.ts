import type { ICommandHandler } from '@app/application/utils/command-handler.interface';
import { Product } from '@app/domain/models/product.model';
import { ProductRepository } from '@app/domain/repositories/product.repository';
import { CreateProductCommand } from '../create-product.command';

export class CreateProductHandler implements ICommandHandler<
  CreateProductCommand,
  Product
> {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(command: CreateProductCommand): Promise<Product> {
    const product = Product.create({
      name: command.name,
      price: command.price,
      stock: command.stock,
    });

    return await this.productRepository.save(product);
  }
}
