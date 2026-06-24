import type { Command } from "@core/application/cqrs/Command";
import type { MonsterDetailsDTO } from "@modules/monsters/application/dto/MonsterDetailsDTO";

export interface CopyPublishedMonsterToCampaignInput {
  actorUserId: string;
  campaignId: string;
  sourceMonsterId: string;
  nameOverride?: string;
}

export class CopyPublishedMonsterToCampaignCommand
  implements Command<MonsterDetailsDTO>
{
  public constructor(
    public readonly input: CopyPublishedMonsterToCampaignInput,
  ) {}
}
