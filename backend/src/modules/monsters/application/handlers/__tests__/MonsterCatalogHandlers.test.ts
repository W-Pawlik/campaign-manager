import { describe, expect, it, vi } from "vitest";
import { ForbiddenError, NotFoundError } from "@core/application/errors/AppError";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { Campaign } from "@modules/campaigns/domain/entities/Campaign";
import { CampaignMember } from "@modules/campaigns/domain/entities/CampaignMember";
import { CampaignName } from "@modules/campaigns/domain/value-objects/CampaignName";
import { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";
import { CampaignStatus } from "@modules/campaigns/domain/value-objects/CampaignStatus";
import { CampaignVisibility } from "@modules/campaigns/domain/value-objects/CampaignVisibility";
import { MemberStatus } from "@modules/campaigns/domain/value-objects/MemberStatus";
import { CopyPublishedMonsterToCampaignCommand } from "@modules/monsters/application/commands/CopyPublishedMonsterToCampaignCommand";
import { CreatePublishedMonsterCommand } from "@modules/monsters/application/commands/CreatePublishedMonsterCommand";
import { CopyPublishedMonsterToCampaignHandler } from "@modules/monsters/application/handlers/CopyPublishedMonsterToCampaignHandler";
import { CreatePublishedMonsterHandler } from "@modules/monsters/application/handlers/CreatePublishedMonsterHandler";
import { GetPublishedMonsterDetailsHandler } from "@modules/monsters/application/handlers/GetPublishedMonsterDetailsHandler";
import { ListPublishedMonstersHandler } from "@modules/monsters/application/handlers/ListPublishedMonstersHandler";
import type {
  MonsterPageResult,
  MonsterReadRepository,
} from "@modules/monsters/application/ports/MonsterReadRepository";
import type { MonsterRepository } from "@modules/monsters/application/ports/MonsterRepository";
import { GetPublishedMonsterDetailsQuery } from "@modules/monsters/application/queries/GetPublishedMonsterDetailsQuery";
import { ListPublishedMonstersQuery } from "@modules/monsters/application/queries/ListPublishedMonstersQuery";
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

function createMonsterReadRepository(
  overrides: Partial<MonsterReadRepository> = {},
): MonsterReadRepository {
  return {
    listCampaignMonsters: vi.fn().mockResolvedValue([]),
    listPublishedMonsters: vi.fn().mockResolvedValue({
      items: [],
      limit: 20,
      page: 1,
      total: 0,
      hasNext: false,
    } satisfies MonsterPageResult),
    getDetails: vi.fn().mockResolvedValue(null),
    ...overrides,
  };
}

function createPublishedMonster(): Monster {
  return Monster.create({
    id: "published-monster-1",
    campaignId: null,
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
    visibility: MonsterVisibility.create("PUBLIC"),
    status: MonsterStatus.active(),
    rawData: null,
    customData: null,
    createdById: "owner-1",
    createdAt: new Date("2026-06-22T10:00:00.000Z"),
    updatedAt: new Date("2026-06-22T10:00:00.000Z"),
    deletedAt: null,
  });
}

function createHiddenGlobalMonster(): Monster {
  return Monster.create({
    id: "hidden-global-monster-1",
    campaignId: null,
    gameSystemId: null,
    source: MonsterSource.custom(),
    externalReferenceId: null,
    name: "Secret Goblin",
    slug: "secret-goblin",
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

describe("Monster catalog handlers", () => {
  it("creates published monster as public global record", async () => {
    const repository = createMonsterRepository();
    const handler = new CreatePublishedMonsterHandler(repository);

    const result = await handler.execute(
      new CreatePublishedMonsterCommand({
        actorUserId: "gm-1",
        name: "Bog Wisp",
        challengeRating: "1",
        challengeRatingDecimal: 1,
      }),
    );

    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(result.campaignId).toBeNull();
    expect(result.source).toBe("CUSTOM");
    expect(result.visibility).toBe("PUBLIC");
    expect(result.slug).toBe("bog-wisp");
  });

  it("copies published monster to campaign", async () => {
    const repository = createMonsterRepository({
      findById: vi.fn().mockResolvedValue(createPublishedMonster()),
    });
    const handler = new CopyPublishedMonsterToCampaignHandler(
      repository,
      createAccessService(CampaignRole.owner(), "owner-1"),
    );

    const result = await handler.execute(
      new CopyPublishedMonsterToCampaignCommand({
        actorUserId: "owner-1",
        campaignId: "campaign-1",
        sourceMonsterId: "published-monster-1",
        nameOverride: "Bog Goblin",
      }),
    );

    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(result.campaignId).toBe("campaign-1");
    expect(result.name).toBe("Bog Goblin");
  });

  it("rejects copying hidden global monster through catalog flow", async () => {
    const repository = createMonsterRepository({
      findById: vi.fn().mockResolvedValue(createHiddenGlobalMonster()),
    });
    const handler = new CopyPublishedMonsterToCampaignHandler(
      repository,
      createAccessService(CampaignRole.owner(), "owner-1"),
    );

    await expect(
      handler.execute(
        new CopyPublishedMonsterToCampaignCommand({
          actorUserId: "owner-1",
          campaignId: "campaign-1",
          sourceMonsterId: "hidden-global-monster-1",
        }),
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("lists published monsters with pagination metadata", async () => {
    const monster = createPublishedMonster();
    const readRepository = createMonsterReadRepository({
      listPublishedMonsters: vi.fn().mockResolvedValue({
        items: [monster],
        limit: 10,
        page: 2,
        total: 21,
        hasNext: true,
      } satisfies MonsterPageResult),
    });
    const handler = new ListPublishedMonstersHandler(readRepository);

    const result = await handler.execute(
      new ListPublishedMonstersQuery({
        actorUserId: "user-1",
        page: 2,
        limit: 10,
        search: "goblin",
      }),
    );

    expect(result.total).toBe(21);
    expect(result.page).toBe(2);
    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.id).toBe(monster.id);
  });

  it("returns published monster details only for public global monster", async () => {
    const readRepository = createMonsterReadRepository({
      getDetails: vi.fn().mockResolvedValue(createPublishedMonster()),
    });
    const handler = new GetPublishedMonsterDetailsHandler(readRepository);

    const result = await handler.execute(
      new GetPublishedMonsterDetailsQuery({
        actorUserId: "user-1",
        monsterId: "published-monster-1",
      }),
    );

    expect(result.id).toBe("published-monster-1");
    expect(result.visibility).toBe("PUBLIC");
  });

  it("hides non-public global monster details", async () => {
    const readRepository = createMonsterReadRepository({
      getDetails: vi.fn().mockResolvedValue(createHiddenGlobalMonster()),
    });
    const handler = new GetPublishedMonsterDetailsHandler(readRepository);

    await expect(
      handler.execute(
        new GetPublishedMonsterDetailsQuery({
          actorUserId: "user-1",
          monsterId: "hidden-global-monster-1",
        }),
      ),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
