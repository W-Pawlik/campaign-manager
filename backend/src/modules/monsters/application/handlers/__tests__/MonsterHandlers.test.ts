import { describe, expect, it, vi } from "vitest";
import { ForbiddenError } from "@core/application/errors/AppError";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { Campaign } from "@modules/campaigns/domain/entities/Campaign";
import { CampaignMember } from "@modules/campaigns/domain/entities/CampaignMember";
import { CampaignName } from "@modules/campaigns/domain/value-objects/CampaignName";
import { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";
import { CampaignStatus } from "@modules/campaigns/domain/value-objects/CampaignStatus";
import { CampaignVisibility } from "@modules/campaigns/domain/value-objects/CampaignVisibility";
import { MemberStatus } from "@modules/campaigns/domain/value-objects/MemberStatus";
import { CopyMonsterToCampaignCommand } from "@modules/monsters/application/commands/CopyMonsterToCampaignCommand";
import { CreateCustomMonsterCommand } from "@modules/monsters/application/commands/CreateCustomMonsterCommand";
import { CopyMonsterToCampaignHandler } from "@modules/monsters/application/handlers/CopyMonsterToCampaignHandler";
import { CreateCustomMonsterHandler } from "@modules/monsters/application/handlers/CreateCustomMonsterHandler";
import type { MonsterRepository } from "@modules/monsters/application/ports/MonsterRepository";
import { Monster } from "@modules/monsters/domain/entities/Monster";
import { MonsterSize } from "@modules/monsters/domain/value-objects/MonsterSize";
import { MonsterSource } from "@modules/monsters/domain/value-objects/MonsterSource";
import { MonsterStatus } from "@modules/monsters/domain/value-objects/MonsterStatus";
import { MonsterVisibility } from "@modules/monsters/domain/value-objects/MonsterVisibility";

function createCampaign(): Campaign {
  return Campaign.create({
    id: "campaign-1",
    ownerId: "owner-1",
    name: CampaignName.create("Bestiary"),
    slug: "bestiary",
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
    createdAt: new Date("2026-06-22T10:00:00.000Z"),
    updatedAt: new Date("2026-06-22T10:00:00.000Z"),
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
    joinedAt: new Date("2026-06-22T10:00:00.000Z"),
    invitedAt: null,
    invitedById: null,
    createdAt: new Date("2026-06-22T10:00:00.000Z"),
    updatedAt: new Date("2026-06-22T10:00:00.000Z"),
  });
}

function createAccessService(role: CampaignRole, userId: string): CampaignAccessApplicationService {
  return {
    requirePermission: vi.fn().mockResolvedValue({
      campaign: createCampaign(),
      member: createCampaignMember(role, userId),
      role,
    }),
    requireMembership: vi.fn().mockResolvedValue({
      campaign: createCampaign(),
      member: createCampaignMember(role, userId),
      role,
    }),
  } as unknown as CampaignAccessApplicationService;
}

function createMonsterRepository(overrides: Partial<MonsterRepository> = {}): MonsterRepository {
  return {
    findById: vi.fn().mockResolvedValue(null),
    findByCampaignIdAndSlug: vi.fn().mockResolvedValue(null),
    create: vi.fn(),
    save: vi.fn(),
    ...overrides,
  };
}

function createGlobalMonster(): Monster {
  return Monster.create({
    id: "monster-global-1",
    campaignId: null,
    gameSystemId: null,
    source: MonsterSource.create("OPEN5E"),
    externalReferenceId: "open5e-goblin",
    name: "Goblin",
    slug: "goblin",
    size: MonsterSize.create("SMALL"),
    type: "humanoid",
    subtype: "goblinoid",
    alignment: "neutral evil",
    armorClass: 15,
    armorClassDetails: "leather armor, shield",
    hitPoints: 7,
    hitDice: "2d6",
    speed: { walk: "30 ft." },
    strength: 8,
    dexterity: 14,
    constitution: 10,
    intelligence: 10,
    wisdom: 8,
    charisma: 8,
    savingThrows: null,
    skills: { stealth: 6 },
    damageResistances: null,
    damageImmunities: null,
    conditionImmunities: null,
    damageVulnerabilities: null,
    senses: "darkvision 60 ft.",
    languages: "Common, Goblin",
    challengeRating: "1/4",
    challengeRatingDecimal: 0.25,
    proficiencyBonus: 2,
    xp: 50,
    traits: [{ name: "Nimble Escape" }],
    actions: [{ name: "Scimitar" }],
    bonusActions: null,
    reactions: null,
    legendaryActions: null,
    lairActions: null,
    regionalEffects: null,
    spellcasting: null,
    description: "Small raider",
    sourceBook: "MM",
    pageNumber: "166",
    visibility: MonsterVisibility.gmOnly(),
    status: MonsterStatus.active(),
    rawData: { source: "open5e" },
    customData: null,
    createdById: null,
    createdAt: new Date("2026-06-22T10:00:00.000Z"),
    updatedAt: new Date("2026-06-22T10:00:00.000Z"),
    deletedAt: null,
  });
}

function createCampaignMonster(): Monster {
  return Monster.create({
    id: "monster-campaign-1",
    campaignId: "campaign-1",
    gameSystemId: null,
    source: MonsterSource.custom(),
    externalReferenceId: null,
    name: "Ashen Goblin",
    slug: "ashen-goblin",
    size: MonsterSize.create("SMALL"),
    type: "humanoid",
    subtype: null,
    alignment: null,
    armorClass: 13,
    armorClassDetails: null,
    hitPoints: 12,
    hitDice: "3d6",
    speed: null,
    strength: 10,
    dexterity: 14,
    constitution: 12,
    intelligence: 10,
    wisdom: 8,
    charisma: 8,
    savingThrows: null,
    skills: null,
    damageResistances: null,
    damageImmunities: null,
    conditionImmunities: null,
    damageVulnerabilities: null,
    senses: null,
    languages: null,
    challengeRating: "1/2",
    challengeRatingDecimal: 0.5,
    proficiencyBonus: 2,
    xp: 100,
    traits: null,
    actions: null,
    bonusActions: null,
    reactions: null,
    legendaryActions: null,
    lairActions: null,
    regionalEffects: null,
    spellcasting: null,
    description: null,
    sourceBook: null,
    pageNumber: null,
    visibility: MonsterVisibility.gmOnly(),
    status: MonsterStatus.active(),
    rawData: null,
    customData: null,
    createdById: "owner-1",
    createdAt: new Date("2026-06-22T10:00:00.000Z"),
    updatedAt: new Date("2026-06-22T10:00:00.000Z"),
    deletedAt: null,
  });
}

describe("Monster handlers", () => {
  it("creates custom monster with campaign defaults", async () => {
    const repository = createMonsterRepository();
    const handler = new CreateCustomMonsterHandler(
      repository,
      createAccessService(CampaignRole.create("GM"), "gm-1"),
    );

    const result = await handler.execute(
      new CreateCustomMonsterCommand({
        campaignId: "campaign-1",
        actorUserId: "gm-1",
        name: "Ashen Troll",
        strength: 18,
        constitution: 16,
      }),
    );

    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(result.source).toBe("CUSTOM");
    expect(result.visibility).toBe("GM_ONLY");
    expect(result.status).toBe("ACTIVE");
    expect(result.slug).toBe("ashen-troll");
  });

  it("copies global monster into campaign as a separate snapshot", async () => {
    const sourceMonster = createGlobalMonster();
    const repository = createMonsterRepository({
      findById: vi.fn().mockResolvedValue(sourceMonster),
    });
    const handler = new CopyMonsterToCampaignHandler(
      repository,
      createAccessService(CampaignRole.owner(), "owner-1"),
    );

    const result = await handler.execute(
      new CopyMonsterToCampaignCommand({
        sourceMonsterId: sourceMonster.id,
        campaignId: "campaign-1",
        actorUserId: "owner-1",
        nameOverride: "Goblin Mutant",
      }),
    );

    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(result.campaignId).toBe("campaign-1");
    expect(result.name).toBe("Goblin Mutant");
    expect(result.slug).toBe("goblin-mutant");
    expect(result.source).toBe("OPEN5E");
  });

  it("rejects copying campaign-scoped monster as source", async () => {
    const repository = createMonsterRepository({
      findById: vi.fn().mockResolvedValue(createCampaignMonster()),
    });
    const handler = new CopyMonsterToCampaignHandler(
      repository,
      createAccessService(CampaignRole.owner(), "owner-1"),
    );

    await expect(
      handler.execute(
        new CopyMonsterToCampaignCommand({
          sourceMonsterId: "monster-campaign-1",
          campaignId: "campaign-2",
          actorUserId: "owner-1",
        }),
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});
