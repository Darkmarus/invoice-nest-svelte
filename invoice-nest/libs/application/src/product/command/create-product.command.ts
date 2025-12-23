import type { ICommand } from '@app/application/utils/command.interface';

export class CreateProductCommand implements ICommand {
  constructor(
    public readonly name: string,
    public readonly details: string,
    public readonly price: number,
    public readonly stock: number,
  ) {}
}
