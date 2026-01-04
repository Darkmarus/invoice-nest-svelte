import type { ICommandHandler } from '@app/application/utils/command-handler.interface';
import { ProductNotFoundException } from '@app/domain/errors/product-not-found.error';
import { File } from '@app/domain/models/file.model';
import { ImageProduct } from '@app/domain/models/image-product.model';
import { Product } from '@app/domain/models/product.model';
import { FileRepository } from '@app/domain/repositories/file.repository';
import { ImageProductRepository } from '@app/domain/repositories/image-product.repository';
import { ProductRepository } from '@app/domain/repositories/product.repository';
import { UnitOfWork } from '@app/domain/repositories/unit-of-work.interface';
import { FileStorageService } from '@app/infrastructure/out/storage/file-storage.service';
import { UpdateProductCommand } from '../update-product.command';

export class UpdateProductHandler implements ICommandHandler<
  UpdateProductCommand,
  Product
> {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly imageProductRepository: ImageProductRepository,
    private readonly fileRepository: FileRepository,
    private readonly fileStorageService: FileStorageService,
    private readonly unitOfWork: UnitOfWork,
  ) {}

  async execute(command: UpdateProductCommand): Promise<Product> {
    return this.unitOfWork.transaction(async (trx) => {
      const existingProduct = await this.productRepository.findById(command.id);
      const newFileIds: Array<{ fileId: string; order: number }> = [];

      if (!existingProduct) {
        throw new ProductNotFoundException(command.id);
      }

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
          newFileIds.push({ fileId: savedFile.id!, order: fileData.order! });
        }
      }

      await this.imageProductRepository.deleteByProductId(command.id);

      const existingImages =
        (command.images || []).map((image) => ({
          fileId: image.imageId,
          order: image.order,
        })) ?? [];

      const allImages = [...existingImages, ...newFileIds];

      if (allImages.length > 0) {
        const imageProducts = allImages.map(({ fileId, order }) =>
          ImageProduct.create({
            productId: command.id,
            fileId,
            order,
          }),
        );

        await Promise.all(
          imageProducts.map((ip) => this.imageProductRepository.save(ip, trx)),
        );
      }

      if (command.name !== undefined) {
        existingProduct.name = command.name;
      }
      if (command.details !== undefined) {
        existingProduct.details = command.details;
      }
      if (command.price !== undefined) {
        existingProduct.price = command.price;
      }
      if (command.stock !== undefined) {
        existingProduct.stock = command.stock;
      }
      if (command.enabled !== undefined) {
        existingProduct.enabled = command.enabled;
      }

      existingProduct.updated_at = new Date();

      return await this.productRepository.update(existingProduct);
    });
  }
}
