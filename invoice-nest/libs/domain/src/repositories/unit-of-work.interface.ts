export abstract class UnitOfWork {
  abstract transaction<T>(callback: (trx: any) => Promise<T>): Promise<T>;
}
