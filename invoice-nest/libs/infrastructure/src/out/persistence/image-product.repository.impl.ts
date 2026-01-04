/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { ImageProduct } from '@app/domain/models/image-product.model';
import { ImageProductRepository } from '@app/domain/repositories/image-product.repository';
import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';

@Injectable()
export class ImageProductRepositoryImpl implements ImageProductRepository {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async save(
    imageProduct: ImageProduct,
    trx?: Knex.Transaction,
  ): Promise<void> {
    const db = trx || this.knex;
    await db('image_products').insert({
      product_id: imageProduct.productId,
      file_id: imageProduct.fileId,
      order: imageProduct.order,
    });
  }

  async findByProductId(productId: string): Promise<ImageProduct[]> {
    const results = await this.knex('image_products')
      .where({ product_id: productId })
      .orderBy('order')
      .select('*');

    return results.map((result) =>
      ImageProduct.create({
        productId: result.product_id as string,
        fileId: result.file_id as string,
        order: result.order as number,
      }),
    );
  }

  async deleteByProductId(productId: string): Promise<void> {
    await this.knex('image_products').where({ product_id: productId }).del();
  }

  async deleteByFileId(fileId: string): Promise<void> {
    await this.knex('image_products').where({ file_id: fileId }).del();
  }
}
