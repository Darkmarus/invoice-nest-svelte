import { Injectable, Logger } from '@nestjs/common';
import { CommandBus } from './command-bus.service';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class HandlerRegistryService {
  private readonly logger = new Logger(HandlerRegistryService.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly moduleRef: ModuleRef,
  ) {}

  autoRegisterModuleHandlers(
    moduleRef: ModuleRef,
    handlerBindings: Array<{
      command: new (...args: any[]) => any;
      handler: new (...args: any[]) => any;
    }>,
  ): void {
    for (const { command, handler } of handlerBindings) {
      const handlerInstance = moduleRef.get(handler, { strict: false });
      if (handlerInstance) {
        this.commandBus.register(command, handlerInstance);
        this.logger.log(
          `Handler ${handler.name} registrado para ${command.name}`,
        );
      } else {
        this.logger.error(
          `No se pudo obtener instancia del handler ${handler.name}`,
        );
      }
    }
  }
}
