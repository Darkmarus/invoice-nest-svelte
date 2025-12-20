import { ICommand } from '@app/application/utils/command.interface';
import type { Product } from '@app/domain/models/product.model';

export class GetProductByIdQuery implements ICommand<Product> {
  constructor(public readonly id: string) {}
}
