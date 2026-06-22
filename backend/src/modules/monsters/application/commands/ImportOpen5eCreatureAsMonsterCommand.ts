import type { Command } from "@core/application/cqrs/Command";
import type { MonsterDetailsDTO } from "@modules/monsters/application/dto/MonsterDetailsDTO";

export interface ImportOpen5eCreatureAsMonsterInput {
  campaignId: string;
  actorUserId: string;
  resourceKey?: string;
  externalReferenceId?: string;
  nameOverride?: string;
}

export class ImportOpen5eCreatureAsMonsterCommand
  implements Command<MonsterDetailsDTO>
{
  public constructor(
    public readonly input: ImportOpen5eCreatureAsMonsterInput,
  ) {}
}
