import { randomUUID } from "node:crypto";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import {
  NotFoundError,
  ValidationError,
} from "@core/application/errors/AppError";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import { Open5eInvalidResponseError } from "@modules/external-references/application/errors/Open5eErrors";
import type { Open5eExternalReferenceResolver } from "@modules/external-references/application/services/Open5eExternalReferenceResolver";
import { EXTERNAL_RESOURCE_TYPE } from "@modules/external-references/domain/value-objects/ExternalResourceType";
import type { ImportOpen5eCreatureAsMonsterCommand } from "@modules/monsters/application/commands/ImportOpen5eCreatureAsMonsterCommand";
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

function toNullableString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function toNullableNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function mapMonsterSize(value: unknown): MonsterSize | null {
  if (typeof value !== "string" || value.trim().length === 0) {
    return null;
  }

  return MonsterSize.create(value);
}

function getNormalizedCreatureData(normalizedData: unknown): Record<string, unknown> {
  if (normalizedData === null || typeof normalizedData !== "object") {
    throw new Open5eInvalidResponseError();
  }

  return normalizedData as Record<string, unknown>;
}

export class ImportOpen5eCreatureAsMonsterHandler
  implements
    CommandHandler<ImportOpen5eCreatureAsMonsterCommand, MonsterDetailsDTO>
{
  public constructor(
    private readonly monsterRepository: MonsterRepository,
    private readonly accessService: CampaignAccessApplicationService,
    private readonly open5eExternalReferenceResolver: Open5eExternalReferenceResolver,
  ) {}

  public async execute(
    command: ImportOpen5eCreatureAsMonsterCommand,
  ): Promise<MonsterDetailsDTO> {
    const resourceKey = command.input.resourceKey?.trim();
    const externalReferenceId = command.input.externalReferenceId?.trim();

    if (
      (resourceKey === undefined || resourceKey.length === 0) &&
      (externalReferenceId === undefined || externalReferenceId.length === 0)
    ) {
      throw new ValidationError(
        "resourceKey or externalReferenceId must be provided",
      );
    }

    await this.accessService.requirePermission(
      command.input.campaignId,
      command.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.MONSTER_CREATE,
    );

    const reference =
      externalReferenceId !== undefined && externalReferenceId.length > 0
        ? await this.open5eExternalReferenceResolver.getById(externalReferenceId)
        : await this.open5eExternalReferenceResolver.getOrRefresh(
            EXTERNAL_RESOURCE_TYPE.CREATURE,
            resourceKey!,
          );

    if (reference === null) {
      throw new NotFoundError("External reference not found");
    }

    if (reference.resourceType.value !== EXTERNAL_RESOURCE_TYPE.CREATURE) {
      throw new ValidationError("Only CREATURE resources can be imported as monsters");
    }

    const normalizedData = getNormalizedCreatureData(reference.normalizedData);
    const name = command.input.nameOverride?.trim() || reference.name;
    const baseSlug = buildMonsterSlugBaseFromName(name);
    const slug = await findUniqueMonsterSlug(
      this.monsterRepository,
      command.input.campaignId,
      baseSlug,
    );
    const createdAt = new Date();
    const monster = Monster.create({
      id: randomUUID(),
      campaignId: command.input.campaignId,
      gameSystemId: null,
      source: MonsterSource.open5e(),
      externalReferenceId: reference.id,
      name,
      slug,
      size: mapMonsterSize(normalizedData.size),
      type: toNullableString(normalizedData.type),
      subtype: toNullableString(normalizedData.subtype),
      alignment: toNullableString(normalizedData.alignment),
      armorClass: toNullableNumber(normalizedData.armorClass),
      armorClassDetails: toNullableString(normalizedData.armorClassDetails),
      hitPoints: toNullableNumber(normalizedData.hitPoints),
      hitDice: toNullableString(normalizedData.hitDice),
      speed: normalizedData.speed ?? null,
      strength: toNullableNumber(normalizedData.strength),
      dexterity: toNullableNumber(normalizedData.dexterity),
      constitution: toNullableNumber(normalizedData.constitution),
      intelligence: toNullableNumber(normalizedData.intelligence),
      wisdom: toNullableNumber(normalizedData.wisdom),
      charisma: toNullableNumber(normalizedData.charisma),
      savingThrows: normalizedData.savingThrows ?? null,
      skills: normalizedData.skills ?? null,
      damageResistances: normalizedData.damageResistances ?? null,
      damageImmunities: normalizedData.damageImmunities ?? null,
      conditionImmunities: normalizedData.conditionImmunities ?? null,
      damageVulnerabilities: normalizedData.damageVulnerabilities ?? null,
      senses: toNullableString(normalizedData.senses),
      languages: toNullableString(normalizedData.languages),
      challengeRating: toNullableString(normalizedData.challengeRating),
      challengeRatingDecimal: toNullableNumber(
        normalizedData.challengeRatingDecimal,
      ),
      proficiencyBonus: toNullableNumber(normalizedData.proficiencyBonus),
      xp: toNullableNumber(normalizedData.xp),
      traits: normalizedData.traits ?? null,
      actions: normalizedData.actions ?? null,
      bonusActions: normalizedData.bonusActions ?? null,
      reactions: normalizedData.reactions ?? null,
      legendaryActions: normalizedData.legendaryActions ?? null,
      lairActions: normalizedData.lairActions ?? null,
      regionalEffects: normalizedData.regionalEffects ?? null,
      spellcasting: normalizedData.spellcasting ?? null,
      description: toNullableString(normalizedData.description),
      sourceBook:
        toNullableString(normalizedData.sourceDocumentName) ??
        reference.sourceDocumentName,
      pageNumber: null,
      visibility: MonsterVisibility.gmOnly(),
      status: MonsterStatus.active(),
      rawData: reference.rawData,
      customData: normalizedData,
      createdById: command.input.actorUserId,
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
    });

    await this.monsterRepository.create(monster);

    return mapMonsterDetailsFromDomain(monster);
  }
}
