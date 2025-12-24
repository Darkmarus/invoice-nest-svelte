export class ImageProduct {
  private constructor(
    public readonly productId: string,
    public readonly fileId: string,
  ) {}

  public static create(props: {
    productId: string;
    fileId: string;
  }): ImageProduct {
    return new ImageProduct(props.productId, props.fileId);
  }
}
