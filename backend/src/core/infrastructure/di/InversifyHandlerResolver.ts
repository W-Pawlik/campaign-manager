import type { Container } from "inversify";
import type { HandlerResolver } from "@core/application/cqrs/HandlerResolver";

export class InversifyHandlerResolver implements HandlerResolver {
  public constructor(private readonly container: Container) {}

  public resolve<T>(token: symbol): T {
    return this.container.get<T>(token);
  }
}