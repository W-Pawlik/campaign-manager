import { describe, expect, it, vi } from "vitest";
import { ForbiddenError } from "@core/application/errors/AppError";
import { CreateCharacterCommand } from "@modules/characters/application/commands/CreateCharacterCommand";
import { UpdateCharacterCommand } from "@modules/characters/application/commands/UpdateCharacterCommand";
import { CreateCharacterHandler } from "@modules/characters/application/handlers/CreateCharacterHandler";
import { UpdateCharacterHandler } from "@modules/characters/application/handlers/UpdateCharacterHandler";
import type { CharacterRepository } from "@modules/characters/application/ports/CharacterRepository";
import { Character } from "@modules/characters/domain/entities/Character";
import { CharacterPermissionDomainService } from "@modules/characters/domain/services/CharacterPermissionDomainService";
import { CharacterStatus } from "@modules/characters/domain/value-objects/CharacterStatus";
import { CharacterType } from "@modules/characters/domain/value-objects/CharacterType";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CampaignMember } from "@modules/campaigns/domain/entities/CampaignMember";
import { Campaign } from "@modules/campaigns/domain/entities/Campaign";
import { CampaignName } from "@modules/campaigns/domain/value-objects/CampaignName";
import { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";
import { CampaignStatus } from "@modules/campaigns/domain/value-objects/CampaignStatus";
import { CampaignVisibility } from "@modules/campaigns/domain/value-objects/CampaignVisibility";
import { MemberStatus } from "@modules/campaigns/domain/value-objects/MemberStatus";

function createCampaign(): Campaign {
  return Campaign.create({
    id: "campaign-1",
    ownerId: "owner-1",
    name: CampaignName.create("Heroes of Waterdeep"),
    slug: "heroes-of-waterdeep",
    description: null,
    gameSystemId: null,
    status: CampaignStatus.active(),
    visibility: CampaignVisibility.private(),
    coverImageUrl: null,
    coverImageKey: null,
    defaultLanguage: null,
    currentDateInWorld: null,
    worldName: null,
    startingLevel: null,
    createdAt: new Date("2026-06-20T10:00:00.000Z"),
    updatedAt: new Date("2026-06-20T10:00:00.000Z"),
    archivedAt: null,
    deletedAt: null,
  });
}

function createCampaignMember(role: CampaignRole, userId: string): CampaignMember {
  return CampaignMember.create({
    id: "member-1",
    campaignId: "campaign-1",
    userId,
    role,
    status: MemberStatus.active(),
    nickname: null,
    joinedAt: new Date("2026-06-20T10:00:00.000Z"),
    invitedAt: null,
    invitedById: null,
    createdAt: new Date("2026-06-20T10:00:00.000Z"),
    updatedAt: new Date("2026-06-20T10:00:00.000Z"),
  });
}

function createCharacter(ownerUserId: string): Character {
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

function createAccessService(role: CampaignRole, userId: string): CampaignAccessApplicationService {
  return {
    requirePermission: vi.fn().mockResolvedValue({
      campaign: createCampaign(),
      member: createCampaignMember(role, userId),
      role,
    }),
  } as unknown as CampaignAccessApplicationService;
}

function createRepository(character: Character): CharacterRepository {
  return {
    findById: vi.fn().mockResolvedValue(character),
    create: vi.fn(),
    save: vi.fn(),
  };
}

describe("character handlers", () => {
  it("blocks player from creating character for another user", async () => {
    const repository = createRepository(createCharacter("player-1"));
    const handler = new CreateCharacterHandler(
      repository,
      createAccessService(CampaignRole.player(), "player-1"),
    );

    await expect(
      handler.execute(
        new CreateCharacterCommand({
          campaignId: "campaign-1",
          actorUserId: "player-1",
          ownerUserId: "player-2",
          name: "Aria",
        }),
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("blocks player from editing someone else's character", async () => {
    const repository = createRepository(createCharacter("player-2"));
    const handler = new UpdateCharacterHandler(
      repository,
      createAccessService(CampaignRole.player(), "player-1"),
      new CharacterPermissionDomainService(),
    );

    await expect(
      handler.execute(
        new UpdateCharacterCommand({
          campaignId: "campaign-1",
          characterId: "character-1",
          actorUserId: "player-1",
          name: "Updated",
        }),
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
    expect(repository.save).not.toHaveBeenCalled();
  });

  it("allows staff to edit any campaign character", async () => {
    const repository = createRepository(createCharacter("player-2"));
    const handler = new UpdateCharacterHandler(
      repository,
      createAccessService(CampaignRole.create("GM"), "gm-1"),
      new CharacterPermissionDomainService(),
    );

    const result = await handler.execute(
      new UpdateCharacterCommand({
        campaignId: "campaign-1",
        characterId: "character-1",
        actorUserId: "gm-1",
        status: "ACTIVE",
      }),
    );

    expect(repository.save).toHaveBeenCalledTimes(1);
    expect(result.status).toBe("ACTIVE");
  });
});
