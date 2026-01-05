import type { ICommand } from '@app/application/utils/command.interface';
import type { Product } from '@app/domain/models/product.model';

interface FileData {
  originalName: string;
  mimeType: string;
  buffer: Buffer;
  order?: number;
}

export class UpdateProductCommand implements ICommand<Product> {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly details?: string,
    public readonly price?: number,
    public readonly stock?: number,
    public readonly enabled?: boolean,
    public readonly images?: Array<{ id: string; order: number }>,
    public readonly files?: FileData[],
  ) {}
}
