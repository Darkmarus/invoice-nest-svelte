import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({
    description: 'ID único del producto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Laptop Dell XPS 15',
  })
  name: string;

  @ApiProperty({
    description: 'descripción del producto',
    example: 'Aparato electrodoméstico',
  })
  details: string;

  @ApiProperty({
    description: 'Cantidad en stock',
    example: 50,
  })
  stock: number;

  @ApiProperty({
    description: 'Precio del producto',
    example: 1299.99,
  })
  price: number;

  @ApiProperty({
    description: 'Estado habilitado del producto',
    example: true,
  })
  enabled: boolean;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-15T10:30:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-20T14:45:00Z',
  })
  updated_at: Date;

  @ApiProperty({
    description: 'Lista de imágenes del producto con su orden',
    example: [
      { path: '/uploads/image1.jpg', order: 0 },
      { path: '/uploads/image2.png', order: 1 },
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        path: { type: 'string' },
        order: { type: 'number' },
      },
    },
  })
  images: Array<{ path: string; order: number }>;
}
