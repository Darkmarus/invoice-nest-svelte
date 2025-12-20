/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Type, Logger } from '@nestjs/common';
import { CommandBus } from '@app/infrastructure/config/command-bus.service';
import type { ICommandHandler } from '@app/application/utils/command-handler.interface';
import type { ICommand } from '@app/application/utils/command.interface';
import { HANDLER_COMMAND_KEY } from './handler.decorator';

@Injectable()
export class HandlerRegistryService {
  private readonly logger = new Logger(HandlerRegistryService.name);

  constructor(private readonly commandBus: CommandBus) {}

  /**
   * Registra automáticamente un handler basándose en los metadatos del decorador @Handler
   */
  registerHandler(handler: ICommandHandler<ICommand<unknown>, unknown>): void {
    const handlerClass = handler.constructor as Type<
      ICommandHandler<ICommand<unknown>, unknown>
    >;
    let commandClass = Reflect.getMetadata(
      HANDLER_COMMAND_KEY,
      handlerClass,
    ) as Type<ICommand<unknown>> | undefined;

    // Si no hay metadatos del decorador, soportar la convención de propiedad estática `command`
    if (!commandClass && (handlerClass as any).command) {
      commandClass = (handlerClass as any).command as Type<ICommand<unknown>>;
    }

    if (!commandClass) {
      throw new Error(
        `Handler ${handlerClass.name} no tiene el decorador @Handler() o no está asociado a un comando/query`,
      );
    }

    this.commandBus.register(commandClass, handler);
    this.logger.log(
      `Handler ${handlerClass.name} registrado para ${commandClass.name}`,
    );
  }

  /**
   * Registra múltiples handlers automáticamente
   */
  registerHandlers(
    handlers: ICommandHandler<ICommand<unknown>, unknown>[],
  ): void {
    handlers.forEach((handler) => this.registerHandler(handler));
  }

  /**
   * Auto-descubre y registra todos los handlers de un módulo
   * Busca todos los providers que tienen el decorador @Handler
   */
  /**
   * Registra handlers del módulo usando bindings explicitos { command, handler }
   * El `moduleRef` se utiliza para obtener la instancia del handler y permitir
   * la inyección de dependencias por parte de Nest.
   */
  autoRegisterModuleHandlers(
    moduleRef: { get: (token: Type<unknown>) => unknown },
    handlerBindings: {
      command: Type<ICommand<unknown>>;
      handler: Type<ICommandHandler<ICommand<unknown>, unknown>>;
    }[],
  ): void {
    handlerBindings.forEach(({ command, handler: HandlerClass }) => {
      try {
        const handler = moduleRef.get(HandlerClass) as ICommandHandler<
          ICommand<unknown>,
          unknown
        >;
        if (!handler) {
          throw new Error('No se pudo obtener la instancia del handler');
        }

        this.commandBus.register(command, handler);
        this.logger.log(
          `Handler ${HandlerClass.name} registrado para ${command.name}`,
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        this.logger.error(
          `Error al registrar handler ${HandlerClass.name}: ${errorMessage}`,
        );
      }
    });
  }
}
