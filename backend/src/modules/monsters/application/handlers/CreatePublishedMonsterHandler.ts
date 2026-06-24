import { randomUUID } from "node:crypto";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import type { CreatePublishedMonsterCommand } from "@modules/monsters/application/commands/CreatePublishedMonsterCommand";
import type { MonsterDetailsDTO } from "@modules/monsters/application/dto/MonsterDetailsDTO";
import type { MonsterRepository } from "@modules/monsters/application/ports/MonsterRepository";
import { mapMonsterDetailsFromDomain } from "@modules/monsters/application/services/MonsterDtoMapper";
import { buildMonsterSlugBaseFromName } from "@modules/monsters/application/services/MonsterSlugService";
import { findUniqueMonsterSlug } from "@modules/monsters/application/services/UniqueMonsterSlugFinder";
import { Monster } from "@modules/monsters/domain/entities/Monster";
import { MonsterSize } from "@modules/monsters/domain/value-objects/MonsterSize";
import { MonsterSource } from "@modules/monsters/domain/value-objects/MonsterSource";
import { MonsterStatus } from "@modules/monsters/domain/value-objects/MonsterStatus";
import { MonsterVisibility } from "@modules/monsters/domain/value-objects/MonsterVisibility";

function mapMonsterSize(value: string | null | undefined): MonsterSize | null {
  if (value === undefined || value === null) {
    return null;
  }

  return MonsterSize.create(value);
}

export class CreatePublishedMonsterHandler
  implements CommandHandler<CreatePublishedMonsterCommand, MonsterDetailsDTO>
{
  public constructor(private readonly monsterRepository: MonsterRepository) {}

  public async execute(
    command: CreatePublishedMonsterCommand,
  ): Promise<MonsterDetailsDTO> {
    const baseSlug = buildMonsterSlugBaseFromName(command.input.name);
    const slug = await findUniqueMonsterSlug(
      this.monsterRepository,
      null,
      baseSlug,
    );
    const createdAt = new Date();
    const monster = Monster.create({
      id: randomUUID(),
      campaignId: null,
      gameSystemId: command.input.gameSystemId ?? null,
      source: MonsterSource.custom(),
      externalReferenceId: null,
      name: command.input.name.trim(),
      slug,
      size: mapMonsterSize(command.input.size),
      type: command.input.type ?? null,
      subtype: command.input.subtype ?? null,
      alignment: command.input.alignment ?? null,
      armorClass: command.input.armorClass ?? null,
      armorClassDetails: command.input.armorClassDetails ?? null,
      hitPoints: command.input.hitPoints ?? null,
      hitDice: command.input.hitDice ?? null,
      speed: command.input.speed ?? null,
      strength: command.input.strength ?? null,
      dexterity: command.input.dexterity ?? null,
      constitution: command.input.constitution ?? null,
      intelligence: command.input.intelligence ?? null,
      wisdom: command.input.wisdom ?? null,
      charisma: command.input.charisma ?? null,
      savingThrows: command.input.savingThrows ?? null,
      skills: command.input.skills ?? null,
      damageResistances: command.input.damageResistances ?? null,
      damageImmunities: command.input.damageImmunities ?? null,
      conditionImmunities: command.input.conditionImmunities ?? null,
      damageVulnerabilities: command.input.damageVulnerabilities ?? null,
      senses: command.input.senses ?? null,
      languages: command.input.languages ?? null,
      challengeRating: command.input.challengeRating ?? null,
      challengeRatingDecimal: command.input.challengeRatingDecimal ?? null,
      proficiencyBonus: command.input.proficiencyBonus ?? null,
      xp: command.input.xp ?? null,
      traits: command.input.traits ?? null,
      actions: command.input.actions ?? null,
      bonusActions: command.input.bonusActions ?? null,
      reactions: command.input.reactions ?? null,
      legendaryActions: command.input.legendaryActions ?? null,
      lairActions: command.input.lairActions ?? null,
      regionalEffects: command.input.regionalEffects ?? null,
      spellcasting: command.input.spellcasting ?? null,
      description: command.input.description ?? null,
      sourceBook: command.input.sourceBook ?? null,
      pageNumber: command.input.pageNumber ?? null,
      visibility: MonsterVisibility.create("PUBLIC"),
      status: MonsterStatus.active(),
      rawData: null,
      customData: command.input.customData ?? null,
      createdById: command.input.actorUserId,
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
    });

    await this.monsterRepository.create(monster);

    return mapMonsterDetailsFromDomain(monster);
  }
}
