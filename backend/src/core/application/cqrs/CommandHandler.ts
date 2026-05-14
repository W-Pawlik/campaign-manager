import type { Command } from "@core/application/cqrs/Command";

export interface CommandHandler<TCommand extends Command<TResult>, TResult = void> {
  execute(command: TCommand): Promise<TResult> | TResult;
}