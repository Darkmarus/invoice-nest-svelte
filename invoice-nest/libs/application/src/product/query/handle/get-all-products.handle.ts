import type { ICommandHandler } from '@app/application/utils/command-handler.interface';
import { Product } from '@app/domain/models/product.model';
import type { PaginatedResult } from '@app/domain/repositories/product-filters.interface';
import { ImageProductRepository } from '@app/domain/repositories/image-product.repository';
import { FileRepository } from '@app/domain/repositories/file.repository';
import { ProductRepository } from '@app/domain/repositories/product.repository';
import { GetAllProductsQuery } from '../get-all-products.query';

interface ProductWithImages {
  product: Product;
  images: string[];
}

export class GetAllProductsHandler implements ICommandHandler<
  GetAllProductsQuery,
  PaginatedResult<ProductWithImages>
> {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly imageProductRepository: ImageProductRepository,
    private readonly fileRepository: FileRepository,
  ) {}

  async execute(
    query: GetAllProductsQuery,
  ): Promise<PaginatedResult<ProductWithImages>> {
    const result = await this.productRepository.findWithFilters(
      query.filters,
      query.pagination,
    );

    // Fetch images for each product
    const dataWithImages = await Promise.all(
      result.data.map(async (product) => {
        const imageProducts = await this.imageProductRepository.findByProductId(
          product.id!,
        );
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
      }),
    );

    return {
      ...result,
      data: dataWithImages,
    };
  }
}
