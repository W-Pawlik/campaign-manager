import { InfrastructureError } from "@core/application/errors/AppError";
import type { Command } from "@core/application/cqrs/Command";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import type { HandlerResolver } from "@core/application/cqrs/HandlerResolver";

export class CommandBus {
  private readonly handlerTokens = new Map<string, symbol>();

  public constructor(private readonly handlerResolver: HandlerResolver) {}

  public register(commandName: string, handlerToken: symbol): void {
    this.handlerTokens.set(commandName, handlerToken);
  }

  public async execute<TResult>(command: Command<TResult>): Promise<TResult> {
    const commandName = command.constructor.name;
    const handlerToken = this.handlerTokens.get(commandName);

    if (!handlerToken) {
      throw new InfrastructureError(`No command handler registered for command: ${commandName}`);
    }

    const handler = this.handlerResolver.resolve<CommandHandler<Command<TResult>, TResult>>(handlerToken);

    return await handler.execute(command);
  }
}