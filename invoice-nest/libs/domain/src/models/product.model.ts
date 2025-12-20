export class Product {
  private constructor(
    public readonly _id: string | null,
    public _name: string,
    public _stock: number,
    public _price: number,
    public _enabled: boolean,
    public readonly _created_at: Date,
    public _updated_at: Date,
  ) {}

  public static create(props: {
    name: string;
    price: number;
    stock: number;
  }): Product {
    const now = new Date();
    return new Product(
      null,
      props.name,
      props.stock,
      props.price,
      false,
      now,
      now,
    );
  }

  public static rehydrate(props: {
    id: string;
    name: string;
    price: number;
    stock: number;
    enabled: boolean;
    created_at: Date;
    updated_at: Date;
  }): Product {
    return new Product(
      props.id,
      props.name,
      props.price,
      props.stock,
      props.enabled,
      props.created_at,
      props.updated_at,
    );
  }
}
