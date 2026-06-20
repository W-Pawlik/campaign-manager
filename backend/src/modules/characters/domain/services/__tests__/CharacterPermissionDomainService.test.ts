import { describe, expect, it } from "vitest";
import { Character } from "@modules/characters/domain/entities/Character";
import { CharacterPermissionDomainService } from "@modules/characters/domain/services/CharacterPermissionDomainService";
import { CharacterStatus } from "@modules/characters/domain/value-objects/CharacterStatus";
import { CharacterType } from "@modules/characters/domain/value-objects/CharacterType";
import { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";

function createCharacter(ownerUserId: string | null): Character {
  return Character.create({
    id: "character-1",
    campaignId: "campaign-1",
    ownerUserId,
    sheetTemplateId: null,
    name: "Aria",
    avatarUrl: null,
    type: CharacterType.playerCharacter(),
    status: CharacterStatus.draft(),
    race: null,
    characterClass: null,
    subclass: null,
    level: null,
    background: null,
    alignment: null,
    experiencePoints: null,
    armorClass: null,
    initiativeBonus: null,
    speed: null,
    maxHitPoints: null,
    currentHitPoints: null,
    temporaryHitPoints: null,
    hitDice: null,
    strength: null,
    dexterity: null,
    constitution: null,
    intelligence: null,
    wisdom: null,
    charisma: null,
    proficiencyBonus: null,
    savingThrows: null,
    skills: null,
    proficiencies: null,
    languages: null,
    attacksAndSpellcasting: null,
    spellcasting: null,
    featuresAndTraits: null,
    personalityTraits: null,
    ideals: null,
    bonds: null,
    flaws: null,
    backstory: null,
    appearance: null,
    customData: null,
    createdAt: new Date("2026-06-20T10:00:00.000Z"),
    updatedAt: new Date("2026-06-20T10:00:00.000Z"),
    deletedAt: null,
  });
}

describe("CharacterPermissionDomainService", () => {
  const service = new CharacterPermissionDomainService();

  it("allows campaign staff to manage any character", () => {
    expect(
      service.canManageCharacter(
        CampaignRole.create("GM"),
        "gm-1",
        createCharacter("player-1"),
      ),
    ).toBe(true);
  });

  it("allows player to manage only own character", () => {
    expect(
      service.canManageCharacter(
        CampaignRole.player(),
        "player-1",
        createCharacter("player-1"),
      ),
    ).toBe(true);
    expect(
      service.canManageCharacter(
        CampaignRole.player(),
        "player-1",
        createCharacter("player-2"),
      ),
    ).toBe(false);
  });
});
