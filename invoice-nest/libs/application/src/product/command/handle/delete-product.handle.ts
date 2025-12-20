import type { ICommandHandler } from '@app/application/utils/command-handler.interface';
import { ProductNotFoundException } from '@app/domain/errors/product-not-found.error';
import { ProductRepository } from '@app/domain/repositories/product.repository';
import { DeleteProductCommand } from '../delete-product.command';

export class DeleteProductHandler implements ICommandHandler<
  DeleteProductCommand,
  void
> {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(command: DeleteProductCommand): Promise<void> {
    const existingProduct = await this.productRepository.findById(command.id);

    if (!existingProduct) {
      throw new ProductNotFoundException(command.id);
    }

    await this.productRepository.delete(command.id);
  }
}
