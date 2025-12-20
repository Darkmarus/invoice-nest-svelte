import { CreateProductCommand } from '@app/application/product/command/create-product.command';
import { DeleteProductCommand } from '@app/application/product/command/delete-product.command';
import { CreateProductHandler } from '@app/application/product/command/handle/create-product.handle';
import { DeleteProductHandler } from '@app/application/product/command/handle/delete-product.handle';
import { UpdateProductHandler } from '@app/application/product/command/handle/update-product.handle';
import { UpdateProductCommand } from '@app/application/product/command/update-product.command';
import { GetAllProductsQuery } from '@app/application/product/query/get-all-products.query';
import { GetProductByIdQuery } from '@app/application/product/query/get-product-by-id.query';
import { GetAllProductsHandler } from '@app/application/product/query/handle/get-all-products.handle';
import { GetProductByIdHandler } from '@app/application/product/query/handle/get-product-by-id.handle';
import { ProductRepository } from '@app/domain/repositories/product.repository';
import { HandlerRegistryService } from '@app/infrastructure/config/handler-registry.service';
import { PersistenceModule } from '@app/infrastructure/out/persistence/persistence.module';
import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CommandBus } from './command-bus.service';

@Module({
  imports: [PersistenceModule],
  providers: [
    HandlerRegistryService,
    CommandBus,
    {
      provide: CreateProductHandler,
      useFactory: (repo: ProductRepository) => new CreateProductHandler(repo),
      inject: [ProductRepository],
    },
    {
      provide: UpdateProductHandler,
      useFactory: (repo: ProductRepository) => new UpdateProductHandler(repo),
      inject: [ProductRepository],
    },
    {
      provide: DeleteProductHandler,
      useFactory: (repo: ProductRepository) => new DeleteProductHandler(repo),
      inject: [ProductRepository],
    },
    {
      provide: GetProductByIdHandler,
      useFactory: (repo: ProductRepository) => new GetProductByIdHandler(repo),
      inject: [ProductRepository],
    },
    {
      provide: GetAllProductsHandler,
      useFactory: (repo: ProductRepository) => new GetAllProductsHandler(repo),
      inject: [ProductRepository],
    },
  ],
  exports: [CommandBus],
})
export class CommandModule implements OnModuleInit {
  constructor(
    private readonly handlerRegistry: HandlerRegistryService,
    private readonly moduleRef: ModuleRef,
  ) {}

  onModuleInit() {
    // Auto-registro automático de todos los handlers del módulo
    // Solo necesitas agregar el handler aquí y en providers, el resto es automático
    const handlerBindings = [
      { command: CreateProductCommand, handler: CreateProductHandler },
      { command: UpdateProductCommand, handler: UpdateProductHandler },
      { command: DeleteProductCommand, handler: DeleteProductHandler },
      { command: GetAllProductsQuery, handler: GetAllProductsHandler },
      { command: GetProductByIdQuery, handler: GetProductByIdHandler },
    ];

    this.handlerRegistry.autoRegisterModuleHandlers(
      this.moduleRef,
      handlerBindings,
    );
  }
}
