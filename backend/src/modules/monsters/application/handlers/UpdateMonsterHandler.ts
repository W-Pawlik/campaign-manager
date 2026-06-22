import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { ForbiddenError, NotFoundError, ValidationError } from "@core/application/errors/AppError";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import type { MonsterDetailsDTO } from "@modules/monsters/application/dto/MonsterDetailsDTO";
import type { MonsterRepository } from "@modules/monsters/application/ports/MonsterRepository";
import { mapMonsterDetailsFromDomain } from "@modules/monsters/application/services/MonsterDtoMapper";
import { buildMonsterSlugBaseFromName } from "@modules/monsters/application/services/MonsterSlugService";
import { findUniqueMonsterSlug } from "@modules/monsters/application/services/UniqueMonsterSlugFinder";
import type { UpdateMonsterCommand } from "@modules/monsters/application/commands/UpdateMonsterCommand";
import { MonsterSize } from "@modules/monsters/domain/value-objects/MonsterSize";
import { MonsterVisibility } from "@modules/monsters/domain/value-objects/MonsterVisibility";

export class UpdateMonsterHandler implements CommandHandler<UpdateMonsterCommand, MonsterDetailsDTO> {
  public constructor(
    private readonly monsterRepository: MonsterRepository,
    private readonly accessService: CampaignAccessApplicationService,
  ) {}

  public async execute(command: UpdateMonsterCommand): Promise<MonsterDetailsDTO> {
    if (
      command.input.name === undefined &&
      command.input.size === undefined &&
      command.input.type === undefined &&
      command.input.subtype === undefined &&
      command.input.alignment === undefined &&
      command.input.armorClass === undefined &&
      command.input.armorClassDetails === undefined &&
      command.input.hitPoints === undefined &&
      command.input.hitDice === undefined &&
      command.input.speed === undefined &&
      command.input.strength === undefined &&
      command.input.dexterity === undefined &&
      command.input.constitution === undefined &&
      command.input.intelligence === undefined &&
      command.input.wisdom === undefined &&
      command.input.charisma === undefined &&
      command.input.savingThrows === undefined &&
      command.input.skills === undefined &&
      command.input.damageResistances === undefined &&
      command.input.damageImmunities === undefined &&
      command.input.conditionImmunities === undefined &&
      command.input.damageVulnerabilities === undefined &&
      command.input.senses === undefined &&
      command.input.languages === undefined &&
      command.input.challengeRating === undefined &&
      command.input.challengeRatingDecimal === undefined &&
      command.input.proficiencyBonus === undefined &&
      command.input.xp === undefined &&
      command.input.traits === undefined &&
      command.input.actions === undefined &&
      command.input.bonusActions === undefined &&
      command.input.reactions === undefined &&
      command.input.legendaryActions === undefined &&
      command.input.lairActions === undefined &&
      command.input.regionalEffects === undefined &&
      command.input.spellcasting === undefined &&
      command.input.description === undefined &&
      command.input.sourceBook === undefined &&
      command.input.pageNumber === undefined &&
      command.input.visibility === undefined &&
      command.input.customData === undefined
    ) {
      throw new ValidationError("At least one field must be provided for update");
    }

    await this.accessService.requirePermission(
      command.input.campaignId,
      command.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.MONSTER_UPDATE,
    );
    const monster = await this.monsterRepository.findById(command.input.monsterId);

    if (monster === null || monster.campaignId !== command.input.campaignId) {
      throw new NotFoundError("Monster not found");
    }

    if (monster.isGlobal()) {
      throw new ForbiddenError("Global monsters cannot be edited directly");
    }

    let slug: string | undefined;

    if (command.input.name !== undefined && command.input.name.trim() !== monster.name) {
      const baseSlug = buildMonsterSlugBaseFromName(command.input.name);
      slug = await findUniqueMonsterSlug(this.monsterRepository, monster.campaignId, baseSlug, monster.id);
    }

    const updatedMonster = monster.withUpdates({
      ...(command.input.name === undefined ? {} : { name: command.input.name.trim() }),
      ...(slug === undefined ? {} : { slug }),
      ...(command.input.size === undefined ? {} : { size: command.input.size === null ? null : MonsterSize.create(command.input.size) }),
      ...(command.input.type === undefined ? {} : { type: command.input.type }),
      ...(command.input.subtype === undefined ? {} : { subtype: command.input.subtype }),
      ...(command.input.alignment === undefined ? {} : { alignment: command.input.alignment }),
      ...(command.input.armorClass === undefined ? {} : { armorClass: command.input.armorClass }),
      ...(command.input.armorClassDetails === undefined ? {} : { armorClassDetails: command.input.armorClassDetails }),
      ...(command.input.hitPoints === undefined ? {} : { hitPoints: command.input.hitPoints }),
      ...(command.input.hitDice === undefined ? {} : { hitDice: command.input.hitDice }),
      ...(command.input.speed === undefined ? {} : { speed: command.input.speed }),
      ...(command.input.strength === undefined ? {} : { strength: command.input.strength }),
      ...(command.input.dexterity === undefined ? {} : { dexterity: command.input.dexterity }),
      ...(command.input.constitution === undefined ? {} : { constitution: command.input.constitution }),
      ...(command.input.intelligence === undefined ? {} : { intelligence: command.input.intelligence }),
      ...(command.input.wisdom === undefined ? {} : { wisdom: command.input.wisdom }),
      ...(command.input.charisma === undefined ? {} : { charisma: command.input.charisma }),
      ...(command.input.savingThrows === undefined ? {} : { savingThrows: command.input.savingThrows }),
      ...(command.input.skills === undefined ? {} : { skills: command.input.skills }),
      ...(command.input.damageResistances === undefined ? {} : { damageResistances: command.input.damageResistances }),
      ...(command.input.damageImmunities === undefined ? {} : { damageImmunities: command.input.damageImmunities }),
      ...(command.input.conditionImmunities === undefined ? {} : { conditionImmunities: command.input.conditionImmunities }),
      ...(command.input.damageVulnerabilities === undefined ? {} : { damageVulnerabilities: command.input.damageVulnerabilities }),
      ...(command.input.senses === undefined ? {} : { senses: command.input.senses }),
      ...(command.input.languages === undefined ? {} : { languages: command.input.languages }),
      ...(command.input.challengeRating === undefined ? {} : { challengeRating: command.input.challengeRating }),
      ...(command.input.challengeRatingDecimal === undefined ? {} : { challengeRatingDecimal: command.input.challengeRatingDecimal }),
      ...(command.input.proficiencyBonus === undefined ? {} : { proficiencyBonus: command.input.proficiencyBonus }),
      ...(command.input.xp === undefined ? {} : { xp: command.input.xp }),
      ...(command.input.traits === undefined ? {} : { traits: command.input.traits }),
      ...(command.input.actions === undefined ? {} : { actions: command.input.actions }),
      ...(command.input.bonusActions === undefined ? {} : { bonusActions: command.input.bonusActions }),
      ...(command.input.reactions === undefined ? {} : { reactions: command.input.reactions }),
      ...(command.input.legendaryActions === undefined ? {} : { legendaryActions: command.input.legendaryActions }),
      ...(command.input.lairActions === undefined ? {} : { lairActions: command.input.lairActions }),
      ...(command.input.regionalEffects === undefined ? {} : { regionalEffects: command.input.regionalEffects }),
      ...(command.input.spellcasting === undefined ? {} : { spellcasting: command.input.spellcasting }),
      ...(command.input.description === undefined ? {} : { description: command.input.description }),
      ...(command.input.sourceBook === undefined ? {} : { sourceBook: command.input.sourceBook }),
      ...(command.input.pageNumber === undefined ? {} : { pageNumber: command.input.pageNumber }),
      ...(command.input.visibility === undefined ? {} : { visibility: MonsterVisibility.create(command.input.visibility) }),
      ...(command.input.customData === undefined ? {} : { customData: command.input.customData }),
    });

    await this.monsterRepository.save(updatedMonster);

    return mapMonsterDetailsFromDomain(updatedMonster);
  }
}
