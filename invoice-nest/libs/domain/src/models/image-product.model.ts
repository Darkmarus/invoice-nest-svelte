export class ImageProduct {
  private constructor(
    public readonly productId: string,
    public readonly fileId: string,
    public readonly order: number,
  ) {}

  public static create(props: {
    productId: string;
    fileId: string;
    order?: number;
  }): ImageProduct {
    return new ImageProduct(props.productId, props.fileId, props.order ?? 0);
  }
}
