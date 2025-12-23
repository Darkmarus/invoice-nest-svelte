export class File {
  private constructor(
    public readonly id: string | null,
    public name: string,
    public path: string,
    public type: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  public static create(props: {
    name: string;
    path: string;
    type: string;
  }): File {
    const now = new Date();
    return new File(null, props.name, props.path, props.type, now, now);
  }

  public static rehydrate(props: {
    id: string;
    name: string;
    path: string;
    type: string;
    createdAt: Date;
    updatedAt: Date;
  }): File {
    return new File(
      props.id,
      props.name,
      props.path,
      props.type,
      props.createdAt,
      props.updatedAt,
    );
  }
}
