import type { ICommand } from '@app/application/utils/command.interface';
import type { Product } from '@app/domain/models/product.model';

export class UpdateProductCommand implements ICommand<Product> {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly price?: number,
    public readonly stock?: number,
    public readonly enabled?: boolean,
  ) {}
}
