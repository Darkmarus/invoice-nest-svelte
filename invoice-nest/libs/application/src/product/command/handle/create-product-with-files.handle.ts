import type { ICommandHandler } from '@app/application/utils/command-handler.interface';
import { ImageProduct } from '@app/domain/models/image-product.model';
import { Product } from '@app/domain/models/product.model';
import { File } from '@app/domain/models/file.model';
import { ImageProductRepository } from '@app/domain/repositories/image-product.repository';
import { ProductRepository } from '@app/domain/repositories/product.repository';
import { FileRepository } from '@app/domain/repositories/file.repository';
import { UnitOfWork } from '@app/domain/repositories/unit-of-work.interface';
import { FileStorageService } from '@app/infrastructure/out/storage/file-storage.service';
import { Injectable } from '@nestjs/common';
import { CreateProductWithFilesCommand } from '../create-product-with-files.command';

@Injectable()
export class CreateProductWithFilesHandler implements ICommandHandler<
  CreateProductWithFilesCommand,
  Product
> {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly imageProductRepository: ImageProductRepository,
    private readonly fileRepository: FileRepository,
    private readonly fileStorageService: FileStorageService,
    private readonly unitOfWork: UnitOfWork,
  ) {}

  async execute(command: CreateProductWithFilesCommand): Promise<Product> {
    return this.unitOfWork.transaction(async (trx) => {
      const fileIds: string[] = [];

      // Upload files and save file records
      if (command.files && command.files.length > 0) {
        for (const fileData of command.files) {
          const filePath = await this.fileStorageService.saveFile(
            fileData.originalName,
            fileData.buffer,
          );

          const file = File.create({
            name: fileData.originalName,
            path: filePath,
            type: fileData.mimeType,
          });

          const savedFile = await this.fileRepository.save(file, trx);
          fileIds.push(savedFile.id!);
        }
      }

      // Create product
      const product = Product.create({
        name: command.name,
        details: command.details,
        price: command.price,
        stock: command.stock,
      });

      const savedProduct = await this.productRepository.save(product, trx);

      // Link product with uploaded files
      if (fileIds.length > 0) {
        const imageProducts = fileIds.map((fileId) =>
          ImageProduct.create({
            productId: savedProduct.id!,
            fileId,
          }),
        );

        await Promise.all(
          imageProducts.map((ip) => this.imageProductRepository.save(ip, trx)),
        );
      }

      return savedProduct;
    });
  }
}
