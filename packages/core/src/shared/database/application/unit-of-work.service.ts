export abstract class IUnitOfWorkService<T = unknown> {
  abstract transaction<R>(callback: (transaction: T) => Promise<R>): Promise<R>;
}
