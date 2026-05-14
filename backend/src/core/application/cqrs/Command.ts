export type Command<TResult = void> = object & {
  readonly _commandResult?: TResult;
};
