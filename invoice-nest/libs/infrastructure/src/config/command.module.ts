import { UploadFileCommand } from '@app/application/file/command/upload-file.command';
import { UploadFileHandler } from '@app/application/file/command/handle/upload-file.handle';
import { CreateProductWithFilesCommand } from '@app/application/product/command/create-product-with-files.command';
import { DeleteProductCommand } from '@app/application/product/command/delete-product.command';
import { CreateProductWithFilesHandler } from '@app/application/product/command/handle/create-product-with-files.handle';
import { DeleteProductHandler } from '@app/application/product/command/handle/delete-product.handle';
import { UpdateProductHandler } from '@app/application/product/command/handle/update-product.handle';
import { UpdateProductCommand } from '@app/application/product/command/update-product.command';
import { GetAllProductsQuery } from '@app/application/product/query/get-all-products.query';
import { GetProductByIdQuery } from '@app/application/product/query/get-product-by-id.query';
import { GetAllProductsHandler } from '@app/application/product/query/handle/get-all-products.handle';
import { GetProductByIdHandler } from '@app/application/product/query/handle/get-product-by-id.handle';
import { FileRepository } from '@app/domain/repositories/file.repository';
import { ImageProductRepository } from '@app/domain/repositories/image-product.repository';
import { ProductRepository } from '@app/domain/repositories/product.repository';
import { HandlerRegistryService } from '@app/infrastructure/config/handler-registry.service';
import { FileStorageService } from '@app/infrastructure/out/storage/file-storage.service';
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
      provide: CreateProductWithFilesHandler,
      useClass: CreateProductWithFilesHandler,
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
      useFactory: (
        productRepo: ProductRepository,
        imageProductRepo: ImageProductRepository,
        fileRepo: FileRepository,
      ) => new GetProductByIdHandler(productRepo, imageProductRepo, fileRepo),
      inject: [ProductRepository, ImageProductRepository, FileRepository],
    },
    {
      provide: GetAllProductsHandler,
      useFactory: (
        productRepo: ProductRepository,
        imageProductRepo: ImageProductRepository,
        fileRepo: FileRepository,
      ) => new GetAllProductsHandler(productRepo, imageProductRepo, fileRepo),
      inject: [ProductRepository, ImageProductRepository, FileRepository],
    },
    {
      provide: UploadFileHandler,
      useFactory: (repo: FileRepository, storage: FileStorageService) =>
        new UploadFileHandler(repo, storage),
      inject: [FileRepository, FileStorageService],
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
      {
        command: CreateProductWithFilesCommand,
        handler: CreateProductWithFilesHandler,
      },
      { command: UpdateProductCommand, handler: UpdateProductHandler },
      { command: DeleteProductCommand, handler: DeleteProductHandler },
      { command: GetAllProductsQuery, handler: GetAllProductsHandler },
      { command: GetProductByIdQuery, handler: GetProductByIdHandler },
      { command: UploadFileCommand, handler: UploadFileHandler },
    ];

    this.handlerRegistry.autoRegisterModuleHandlers(
      this.moduleRef,
      handlerBindings,
    );
  }
}
