export class InvalidProductDataException extends Error {
  constructor(message: string) {
    super(`Invalid product data: ${message}`);
    this.name = 'InvalidProductDataException';
  }
}
