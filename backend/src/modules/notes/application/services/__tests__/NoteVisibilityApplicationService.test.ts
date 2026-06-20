import { describe, expect, it, vi } from "vitest";
import type { CharacterRepository } from "@modules/characters/application/ports/CharacterRepository";
import { Character } from "@modules/characters/domain/entities/Character";
import { CharacterStatus } from "@modules/characters/domain/value-objects/CharacterStatus";
import { CharacterType } from "@modules/characters/domain/value-objects/CharacterType";
import { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import { CampaignPermissionDomainService } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";
import { NoteVisibilityApplicationService } from "@modules/notes/application/services/NoteVisibilityApplicationService";
import { NoteRelatedEntityApplicationService } from "@modules/notes/application/services/NoteRelatedEntityApplicationService";
import { Note } from "@modules/notes/domain/entities/Note";
import { NoteCategory } from "@modules/notes/domain/value-objects/NoteCategory";
import { NoteVisibility } from "@modules/notes/domain/value-objects/NoteVisibility";
import { RelatedEntityType } from "@modules/notes/domain/value-objects/RelatedEntityType";

function createCharacter(ownerUserId: string): Character {
  return Character.create({
    id: "character-1",
    campaignId: "campaign-1",
    ownerUserId,
    sheetTemplateId: null,
    name: "Aria",
    avatarUrl: null,
    type: CharacterType.playerCharacter(),
    status: CharacterStatus.create("ACTIVE"),
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

function createCharacterRepository(ownerUserId: string): CharacterRepository {
  return {
    findById: vi.fn().mockResolvedValue(createCharacter(ownerUserId)),
    create: vi.fn(),
    save: vi.fn(),
  };
}

function createNote(visibility: NoteVisibility): Note {
  return Note.create({
    id: "note-1",
    campaignId: "campaign-1",
    authorId: "player-1",
    title: "Title",
    content: "Content",
    visibility,
    category: NoteCategory.general(),
    relatedEntityType: visibility.isCharacterOwner() ? RelatedEntityType.create("CHARACTER") : null,
    relatedEntityId: visibility.isCharacterOwner() ? "character-1" : null,
    isPinned: false,
    createdAt: new Date("2026-06-20T10:00:00.000Z"),
    updatedAt: new Date("2026-06-20T10:00:00.000Z"),
    deletedAt: null,
  });
}

describe("NoteVisibilityApplicationService", () => {
  const campaignVisibilityService = new CampaignVisibilityApplicationService(
    new CampaignPermissionDomainService(),
  );

  it("hides PRIVATE_GM notes from players", async () => {
    const service = new NoteVisibilityApplicationService(
      campaignVisibilityService,
      new NoteRelatedEntityApplicationService(createCharacterRepository("player-1")),
    );

    await expect(
      service.canViewNote(createNote(NoteVisibility.create("PRIVATE_GM")), CampaignRole.player(), "player-1"),
    ).resolves.toBe(false);
  });

  it("shows CHARACTER_OWNER notes to owning player", async () => {
    const service = new NoteVisibilityApplicationService(
      campaignVisibilityService,
      new NoteRelatedEntityApplicationService(createCharacterRepository("player-1")),
    );

    await expect(
      service.canViewNote(
        createNote(NoteVisibility.create("CHARACTER_OWNER")),
        CampaignRole.player(),
        "player-1",
      ),
    ).resolves.toBe(true);
  });
});
