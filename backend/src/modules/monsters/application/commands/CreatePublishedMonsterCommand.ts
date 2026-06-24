import type { Command } from "@core/application/cqrs/Command";
import type { MonsterDetailsDTO } from "@modules/monsters/application/dto/MonsterDetailsDTO";
import type { CreateCustomMonsterInput } from "@modules/monsters/application/commands/CreateCustomMonsterCommand";

export type CreatePublishedMonsterInput = Omit<CreateCustomMonsterInput, "campaignId" | "visibility">;

export class CreatePublishedMonsterCommand implements Command<MonsterDetailsDTO> {
  public constructor(public readonly input: CreatePublishedMonsterInput) {}
}
