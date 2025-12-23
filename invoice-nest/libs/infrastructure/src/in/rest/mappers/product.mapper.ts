import { CreateProductCommand } from '@app/application/product/command/create-product.command';
import { DeleteProductCommand } from '@app/application/product/command/delete-product.command';
import { UpdateProductCommand } from '@app/application/product/command/update-product.command';
import { GetProductByIdQuery } from '@app/application/product/query/get-product-by-id.query';
import type { Product } from '@app/domain/models/product.model';
import type { CreateProductDto } from '../dto/create-product.dto';
import { ProductResponseDto } from '../dto/product-response.dto';
import type { UpdateProductDto } from '../dto/update-product.dto';

export class ProductMapper {
  static toResponse(product: Product): ProductResponseDto {
    return {
      id: product.id ?? '',
      name: product.name,
      details: product.details,
      stock: product.stock,
      price: product.price,
      enabled: product.enabled,
      created_at: product.created_at,
      updated_at: product.updated_at,
    };
  }

  static toCreateCommand(
    createProductDto: CreateProductDto,
  ): CreateProductCommand {
    return new CreateProductCommand(
      createProductDto.name,
      createProductDto.details,
      createProductDto.price,
      createProductDto.stock,
    );
  }
  static toUpdateCommand(
    id: string,
    updateProductDto: UpdateProductDto,
  ): UpdateProductCommand {
    return new UpdateProductCommand(
      id,
      updateProductDto.name,
      updateProductDto.details,
      updateProductDto.price,
      updateProductDto.stock,
      updateProductDto.enabled,
    );
  }

  static toDeleteCommand(id: string): DeleteProductCommand {
    return new DeleteProductCommand(id);
  }

  static toGetByIdQuery(id: string): GetProductByIdQuery {
    return new GetProductByIdQuery(id);
  }
}
