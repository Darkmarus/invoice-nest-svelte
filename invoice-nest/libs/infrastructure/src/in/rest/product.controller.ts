import { UpdateProductCommand } from '@app/application/product/command/update-product.command';
import { GetAllProductsQuery } from '@app/application/product/query/get-all-products.query';
import { GetProductByIdQuery } from '@app/application/product/query/get-product-by-id.query';
import { CommandBus } from '@app/infrastructure/config/command-bus.service';
import type { Product } from '@app/domain/models/product.model';
import type { PaginatedResult } from '@app/domain/repositories/product-filters.interface';
import {
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
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { GetAllProductsQueryDto } from './dto/get-all-products-query.dto';
import { PaginatedResponseDto } from './dto/paginated-response.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductMapper } from './mappers/product.mapper';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({ status: 204, description: 'Producto creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  async create(@Body() createProductDto: CreateProductDto): Promise<void> {
    const command = ProductMapper.toCreateCommand(createProductDto);
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
      PaginatedResult<Product>
    >(query);

    return {
      data: result.data.map((product) => ProductMapper.toResponse(product)),
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
    const product = await this.commandBus.execute<GetProductByIdQuery, Product>(
      query,
    );
    return ProductMapper.toResponse(product);
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
    return ProductMapper.toResponse(product);
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
