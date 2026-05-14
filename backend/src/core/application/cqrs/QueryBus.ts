import { InfrastructureError } from "@core/application/errors/AppError";
import type { HandlerResolver } from "@core/application/cqrs/HandlerResolver";
import type { Query } from "@core/application/cqrs/Query";
import type { QueryHandler } from "@core/application/cqrs/QueryHandler";

export class QueryBus {
  private readonly handlerTokens = new Map<string, symbol>();

  public constructor(private readonly handlerResolver: HandlerResolver) {}

  public register(queryName: string, handlerToken: symbol): void {
    this.handlerTokens.set(queryName, handlerToken);
  }

  public async execute<TResult>(query: Query<TResult>): Promise<TResult> {
    const queryName = query.constructor.name;
    const handlerToken = this.handlerTokens.get(queryName);

    if (!handlerToken) {
      throw new InfrastructureError(`No query handler registered for query: ${queryName}`);
    }

    const handler = this.handlerResolver.resolve<QueryHandler<Query<TResult>, TResult>>(handlerToken);

    return await handler.execute(query);
  }
}