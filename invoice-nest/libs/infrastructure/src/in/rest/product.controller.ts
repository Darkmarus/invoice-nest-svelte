import { UpdateProductCommand } from '@app/application/product/command/update-product.command';
import { CreateProductWithFilesCommand } from '@app/application/product/command/create-product-with-files.command';
import { GetAllProductsQuery } from '@app/application/product/query/get-all-products.query';
import { GetProductByIdQuery } from '@app/application/product/query/get-product-by-id.query';

import type { Product } from '@app/domain/models/product.model';
import type { PaginatedResult } from '@app/domain/repositories/product-filters.interface';
import { ImageProductRepository } from '@app/domain/repositories/image-product.repository';
import { FileRepository } from '@app/domain/repositories/file.repository';
import { CommandBus } from '@app/infrastructure/config/command-bus.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { validate } from 'class-validator';
import { CreateProductDto } from './dto/create-product.dto';
import { GetAllProductsQueryDto } from './dto/get-all-products-query.dto';
import { PaginatedResponseDto } from './dto/paginated-response.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductMapper } from './mappers/product.mapper';

interface MultipartFile {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
}

interface ProductFormData {
  body: string;
}

interface FilesData {
  files?: MultipartFile[];
}

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly imageProductRepository: ImageProductRepository,
    private readonly fileRepository: FileRepository,
  ) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 10 }]))
  @ApiConsumes('multipart/form-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Crear un nuevo producto con imágenes' })
  @ApiResponse({ status: 204, description: 'Producto creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  async create(
    @Body() body: ProductFormData,
    @UploadedFiles() filesData: FilesData,
  ): Promise<void> {
    // Parse product data from form
    const productData = JSON.parse(body.body) as CreateProductDto;
    const dtoInstance = Object.assign(new CreateProductDto(), productData);
    const errors = await validate(dtoInstance);
    if (errors.length > 0) {
      const errorMessages = errors.map(
        (err) =>
          `${err.property}: ${Object.values(err.constraints || {}).join(', ')}`,
      );
      throw new BadRequestException(errorMessages.join('; '));
    }

    const files: Array<{
      originalName: string;
      mimeType: string;
      buffer: Buffer;
    }> = [];
    if (filesData?.files && Array.isArray(filesData.files)) {
      files.push(
        ...filesData.files.map((file: MultipartFile) => ({
          originalName: file.originalname,
          mimeType: file.mimetype,
          buffer: file.buffer,
        })),
      );
    }

    const command = new CreateProductWithFilesCommand(
      productData.name,
      productData.details,
      productData.price,
      productData.stock,
      files,
    );
    await this.commandBus.execute(command);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los productos con paginación y filtros',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de productos',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/ProductResponseDto' },
        },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
        total: { type: 'number', example: 100 },
        totalPages: { type: 'number', example: 10 },
      },
    },
  })
  async findAll(
    @Query() queryParams: GetAllProductsQueryDto,
  ): Promise<PaginatedResponseDto<ProductResponseDto>> {
    const filters = {
      name: queryParams.name,
      minPrice: queryParams.minPrice,
      maxPrice: queryParams.maxPrice,
      enabled: queryParams.enabled,
      sortBy: queryParams.sortBy,
      sortOrder: queryParams.sortOrder,
    };

    const pagination = {
      page: queryParams.page ?? 1,
      limit: queryParams.limit ?? 10,
    };

    const query = new GetAllProductsQuery(filters, pagination);
    const result = await this.commandBus.execute<
      GetAllProductsQuery,
      PaginatedResult<{ product: Product; images: string[] }>
    >(query);

    return {
      data: result.data.map(({ product, images }) =>
        ProductMapper.toResponse(product, images),
      ),
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiResponse({
    status: 200,
    description: 'Producto encontrado',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async findOne(@Param('id') id: string): Promise<ProductResponseDto> {
    const query = ProductMapper.toGetByIdQuery(id);
    const result = await this.commandBus.execute<
      GetProductByIdQuery,
      { product: Product; images: string[] }
    >(query);
    return ProductMapper.toResponse(result.product, result.images);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un producto' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiResponse({
    status: 200,
    description: 'Producto actualizado',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const command = ProductMapper.toUpdateCommand(id, updateProductDto);
    const product = await this.commandBus.execute<
      UpdateProductCommand,
      Product
    >(command);
    // For update, we need to fetch images separately since the command doesn't return them
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
    return ProductMapper.toResponse(product, imagePaths);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiResponse({ status: 204, description: 'Producto eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async remove(@Param('id') id: string): Promise<void> {
    const command = ProductMapper.toDeleteCommand(id);
    await this.commandBus.execute(command);
  }
}
