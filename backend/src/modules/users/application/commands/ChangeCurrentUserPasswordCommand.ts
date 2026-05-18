import type { Command } from "@core/application/cqrs/Command";

export interface ChangeCurrentUserPasswordInput {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

export class ChangeCurrentUserPasswordCommand implements Command<void> {
  public constructor(public readonly input: ChangeCurrentUserPasswordInput) {}
}
