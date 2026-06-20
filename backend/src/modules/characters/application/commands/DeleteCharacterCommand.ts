import type { Command } from "@core/application/cqrs/Command";

export interface DeleteCharacterInput {
  campaignId: string;
  characterId: string;
  actorUserId: string;
}

export class DeleteCharacterCommand implements Command<void> {
  public constructor(public readonly input: DeleteCharacterInput) {}
}
