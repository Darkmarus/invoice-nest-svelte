// command-bus.service.ts
import type { ICommandBus } from '@app/application/utils/command-bus.interface';
import type { ICommandHandler } from '@app/application/utils/command-handler.interface';
import type { ICommand } from '@app/application/utils/command.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommandBus implements ICommandBus {
  private readonly handlers = new Map<string, ICommandHandler<any, any>>();

  register<TCommand extends ICommand<T>, T>(
    commandClass: new (...args: any[]) => TCommand,
    handler: ICommandHandler<TCommand, T>,
  ): void {
    this.handlers.set(commandClass.name, handler);
  }

  execute<TCommand extends ICommand<T>, T>(command: TCommand): Promise<T> {
    const commandName = command.constructor.name;
    const handler = this.handlers.get(commandName);

    if (!handler) {
      throw new Error(`No handler registered for command: ${commandName}`);
    }

    return handler.execute(command) as Promise<T>;
  }
}
