import type { ICommand } from './command.interface';

export interface ICommandHandler<TCommand extends ICommand<T>, T> {
  execute(request: TCommand): Promise<T>;
}
