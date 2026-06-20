import type { Command } from "@core/application/cqrs/Command";

export interface ArchiveCharacterInput {
  campaignId: string;
  characterId: string;
  actorUserId: string;
}

export class ArchiveCharacterCommand implements Command<void> {
  public constructor(public readonly input: ArchiveCharacterInput) {}
}
