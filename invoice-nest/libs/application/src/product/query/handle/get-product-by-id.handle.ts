import type { ICommandHandler } from '@app/application/utils/command-handler.interface';
import { ProductNotFoundException } from '@app/domain/errors/product-not-found.error';
import { Product } from '@app/domain/models/product.model';
import { ImageProductRepository } from '@app/domain/repositories/image-product.repository';
import { FileRepository } from '@app/domain/repositories/file.repository';
import { ProductRepository } from '@app/domain/repositories/product.repository';
import { GetProductByIdQuery } from '../get-product-by-id.query';

interface ProductWithImages {
  product: Product;
  images: string[];
}

export class GetProductByIdHandler implements ICommandHandler<
  GetProductByIdQuery,
  ProductWithImages
> {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly imageProductRepository: ImageProductRepository,
    private readonly fileRepository: FileRepository,
  ) {}

  async execute(query: GetProductByIdQuery): Promise<ProductWithImages> {
    const product = await this.productRepository.findById(query.id);

    if (!product) {
      throw new ProductNotFoundException(query.id);
    }

    // Fetch image products
    const imageProducts = await this.imageProductRepository.findByProductId(
      query.id,
    );

    // Fetch file details for each image
    const imagePaths: string[] = [];
    for (const imageProduct of imageProducts) {
      const file = await this.fileRepository.findById(imageProduct.fileId);
      if (file) {
        imagePaths.push(file.path);
      }
    }

    return {
      product,
      images: imagePaths,
    };
  }
}
