import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
  @ApiProperty({ description: 'Datos de la página actual', isArray: true })
  data: T[];

  @ApiProperty({ description: 'Página actual', example: 1 })
  page: number;

  @ApiProperty({ description: 'Elementos por página', example: 10 })
  limit: number;

  @ApiProperty({ description: 'Total de elementos', example: 100 })
  total: number;

  @ApiProperty({ description: 'Total de páginas', example: 10 })
  totalPages: number;
}
