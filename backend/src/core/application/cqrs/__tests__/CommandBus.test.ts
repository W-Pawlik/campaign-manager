import { describe, expect, it } from "vitest";
import type { Command } from "@core/application/cqrs/Command";
import { CommandBus } from "@core/application/cqrs/CommandBus";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import type { HandlerResolver } from "@core/application/cqrs/HandlerResolver";
import { InfrastructureError } from "@core/application/errors/AppError";

class TestCommand implements Command<string> {
  public constructor(public readonly value: string) {}
}

class TestCommandHandler implements CommandHandler<TestCommand, string> {
  public execute(command: TestCommand): string {
    return `handled:${command.value}`;
  }
}

describe("CommandBus", () => {
  it("resolves handler by token and executes command", async () => {
    const token = Symbol.for("tests.TestCommandHandler");
    const handler = new TestCommandHandler();

    const resolver: HandlerResolver = {
      resolve<T>(resolvedToken: symbol): T {
        if (resolvedToken !== token) {
          throw new Error("unexpected token");
        }

        return handler as T;
      },
    };

    const bus = new CommandBus(resolver);
    bus.register(TestCommand.name, token);

    const result = await bus.execute(new TestCommand("ok"));

    expect(result).toBe("handled:ok");
  });

  it("throws infrastructure error when handler token is missing", async () => {
    const resolver: HandlerResolver = {
      resolve<T>(): T {
        throw new Error("should not be called");
      },
    };

    const bus = new CommandBus(resolver);

    await expect(bus.execute(new TestCommand("x"))).rejects.toBeInstanceOf(InfrastructureError);
  });
});