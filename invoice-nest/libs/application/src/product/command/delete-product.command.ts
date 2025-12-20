import type { ICommand } from '@app/application/utils/command.interface';

export class DeleteProductCommand implements ICommand {
  constructor(public readonly id: string) {}
}
