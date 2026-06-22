import type { Command } from "@core/application/cqrs/Command";
import type { MonsterDetailsDTO } from "@modules/monsters/application/dto/MonsterDetailsDTO";

export interface CopyMonsterToCampaignInput {
  sourceMonsterId: string;
  campaignId: string;
  actorUserId: string;
  nameOverride?: string;
}

export class CopyMonsterToCampaignCommand implements Command<MonsterDetailsDTO> {
  public constructor(public readonly input: CopyMonsterToCampaignInput) {}
}
