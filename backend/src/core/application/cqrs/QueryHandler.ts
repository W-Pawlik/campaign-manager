import type { Query } from "@core/application/cqrs/Query";

export interface QueryHandler<TQuery extends Query<TResult>, TResult> {
  execute(query: TQuery): Promise<TResult> | TResult;
}