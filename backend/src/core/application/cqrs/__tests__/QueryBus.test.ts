import { describe, expect, it } from "vitest";
import type { HandlerResolver } from "@core/application/cqrs/HandlerResolver";
import type { Query } from "@core/application/cqrs/Query";
import { QueryBus } from "@core/application/cqrs/QueryBus";
import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import { InfrastructureError } from "@core/application/errors/AppError";

class TestQuery implements Query<number> {
  public constructor(public readonly input: number) {}
}

class TestQueryHandler implements QueryHandler<TestQuery, number> {
  public execute(query: TestQuery): number {
    return query.input * 2;
  }
}

describe("QueryBus", () => {
  it("resolves handler by token and executes query", async () => {
    const token = Symbol.for("tests.TestQueryHandler");
    const handler = new TestQueryHandler();

    const resolver: HandlerResolver = {
      resolve<T>(resolvedToken: symbol): T {
        if (resolvedToken !== token) {
          throw new Error("unexpected token");
        }

        return handler as T;
      },
    };

    const bus = new QueryBus(resolver);
    bus.register(TestQuery.name, token);

    const result = await bus.execute(new TestQuery(21));

    expect(result).toBe(42);
  });

  it("throws infrastructure error when handler token is missing", async () => {
    const resolver: HandlerResolver = {
      resolve<T>(): T {
        throw new Error("should not be called");
      },
    };

    const bus = new QueryBus(resolver);

    await expect(bus.execute(new TestQuery(1))).rejects.toBeInstanceOf(InfrastructureError);
  });
});