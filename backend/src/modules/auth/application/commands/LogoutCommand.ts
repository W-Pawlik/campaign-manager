import type { Command } from "@core/application/cqrs/Command";

export class LogoutCommand implements Command<void> {
  public constructor(public readonly refreshToken: string) {}
}
