import { DeleteProductCommand } from '@app/application/product/command/delete-product.command';
import { UpdateProductCommand } from '@app/application/product/command/update-product.command';
import { GetProductByIdQuery } from '@app/application/product/query/get-product-by-id.query';
import type { Product } from '@app/domain/models/product.model';
import { ProductResponseDto } from '../dto/product-response.dto';
import type { UpdateProductDto } from '../dto/update-product.dto';

export class ProductMapper {
  static toResponse(
    product: Product,
    images: Array<{ path: string; order: number }> = [],
  ): ProductResponseDto {
    return {
      id: product.id ?? '',
      name: product.name,
      details: product.details,
      stock: product.stock,
      price: product.price,
      enabled: product.enabled,
      created_at: product.created_at,
      updated_at: product.updated_at,
      images,
    };
  }

  static toUpdateCommand(
    id: string,
    updateProductDto: UpdateProductDto,
    files?: Array<{
      originalName: string;
      mimeType: string;
      buffer: Buffer;
      order?: number;
    }>,
  ): UpdateProductCommand {
    return new UpdateProductCommand(
      id,
      updateProductDto.name,
      updateProductDto.details,
      updateProductDto.price,
      updateProductDto.stock,
      updateProductDto.enabled,
      updateProductDto.images,
      files,
    );
  }

  static toDeleteCommand(id: string): DeleteProductCommand {
    return new DeleteProductCommand(id);
  }

  static toGetByIdQuery(id: string): GetProductByIdQuery {
    return new GetProductByIdQuery(id);
  }
}
