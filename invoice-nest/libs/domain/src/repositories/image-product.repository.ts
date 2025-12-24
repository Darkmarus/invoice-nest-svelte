import { ImageProduct } from '../models/image-product.model';

export abstract class ImageProductRepository {
  abstract save(imageProduct: ImageProduct, trx?: any): Promise<void>;
  abstract findByProductId(productId: string): Promise<ImageProduct[]>;
  abstract deleteByProductId(productId: string): Promise<void>;
  abstract deleteByFileId(fileId: string): Promise<void>;
}
