export class ProductNotFoundException extends Error {
  constructor(productId: string) {
    super(`Product with id ${productId} not found`);
    this.name = 'ProductNotFoundException';
  }
}
