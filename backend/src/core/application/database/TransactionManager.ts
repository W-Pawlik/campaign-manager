export interface TransactionManager {
  runInTransaction<TResult>(operation: () => Promise<TResult>): Promise<TResult>;
}