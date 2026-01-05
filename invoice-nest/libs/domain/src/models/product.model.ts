export class Product {
  private constructor(
    public readonly id: string | null,
    public name: string,
    public details: string,
    public stock: number,
    public price: number,
    public enabled: boolean,
    public readonly created_at: Date,
    public updated_at: Date,
    public readonly deleted_at: Date | null,
  ) {}

  public static create(props: {
    name: string;
    details: string;
    price: number;
    stock: number;
  }): Product {
    const now = new Date();
    return new Product(
      null,
      props.name,
      props.details,
      props.stock,
      props.price,
      false,
      now,
      now,
      null,
    );
  }

  public static rehydrate(props: {
    id: string;
    name: string;
    details: string;
    price: number;
    stock: number;
    enabled: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
  }): Product {
    return new Product(
      props.id,
      props.name,
      props.details,
      props.stock,
      props.price,
      props.enabled,
      props.created_at,
      props.updated_at,
      props.deleted_at,
    );
  }
}
