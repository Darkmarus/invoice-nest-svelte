import 'reflect-metadata';
import type { ICommand } from '@app/application/utils/command.interface';

export const HANDLER_COMMAND_KEY = Symbol('handler:command');

/**
 * Decorador para asociar un handler con su comando/query
 * @param commandClass La clase del comando o query que maneja este handler
 */
export function Handler<T extends ICommand>(
  commandClass: new (...args: any[]) => T,
) {
  return function (target: any) {
    Reflect.defineMetadata(HANDLER_COMMAND_KEY, commandClass, target);
  };
}
