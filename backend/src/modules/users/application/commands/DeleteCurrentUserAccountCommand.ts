import type { Command } from "@core/application/cqrs/Command";

export interface DeleteCurrentUserAccountInput {
  userId: string;
}

export class DeleteCurrentUserAccountCommand implements Command<void> {
  public constructor(public readonly input: DeleteCurrentUserAccountInput) {}
}
