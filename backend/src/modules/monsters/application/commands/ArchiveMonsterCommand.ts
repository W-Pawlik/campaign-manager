import type { Command } from "@core/application/cqrs/Command";

export interface ArchiveMonsterInput {
  campaignId: string;
  monsterId: string;
  actorUserId: string;
}

export class ArchiveMonsterCommand implements Command<void> {
  public constructor(public readonly input: ArchiveMonsterInput) {}
}
