export type Query<TResult> = object & {
  readonly _queryResult?: TResult;
};
