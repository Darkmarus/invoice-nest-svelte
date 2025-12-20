import type { ICommandHandler } from './command-handler.interface';
import type { ICommand } from './command.interface';

export interface ICommandBus {
  register(
    commandClass: new (...args: any[]) => ICommand,
    handler: ICommandHandler<ICommand, any>,
  ): void;

  execute<TCommand extends ICommand<R>, R>(command: TCommand): Promise<R>;
}
