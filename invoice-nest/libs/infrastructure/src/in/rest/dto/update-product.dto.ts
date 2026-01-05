import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Nombre del producto',
    example: 'Laptop Dell XPS 15',
    maxLength: 120,
  })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;
  @ApiPropertyOptional({
    description: 'Nombre del producto',
    example: 'Laptop Dell XPS 15',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  details?: string;

  @ApiPropertyOptional({
    description: 'Precio del producto',
    example: 1299.99,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({
    description: 'Cantidad en stock',
    example: 50,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({
    description: 'Estado habilitado del producto',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @ApiPropertyOptional({
    description: 'Lista de imágenes del producto con su orden',
    example: [
      { imageId: '123e4567-e89b-12d3-a456-426614174000', order: 0 },
      { imageId: '123e4567-e89b-12d3-a456-426614174001', order: 1 },
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        imageId: { type: 'string' },
        order: { type: 'number' },
      },
    },
  })
  @IsOptional()
  @IsArray()
  images: Array<{ id: string; order: number }>;

  @ApiPropertyOptional({
    description: 'Lista de orden de las nuevas imágenes',
    example: [2, 6],
    type: 'array',
    items: {
      type: 'number',
    },
  })
  @IsOptional()
  @IsArray()
  newOrders?: Array<number>;
}
