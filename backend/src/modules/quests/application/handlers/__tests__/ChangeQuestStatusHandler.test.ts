import { describe, expect, it, vi } from "vitest";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import { CampaignPermissionDomainService } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";
import { ChangeQuestStatusCommand } from "@modules/quests/application/commands/ChangeQuestStatusCommand";
import { ChangeQuestStatusHandler } from "@modules/quests/application/handlers/ChangeQuestStatusHandler";
import type { QuestReadRepository } from "@modules/quests/application/ports/QuestReadRepository";
import type { QuestRepository } from "@modules/quests/application/ports/QuestRepository";
import { Quest } from "@modules/quests/domain/entities/Quest";
import { QuestPriority } from "@modules/quests/domain/value-objects/QuestPriority";
import { QuestStatus } from "@modules/quests/domain/value-objects/QuestStatus";
import { QuestType } from "@modules/quests/domain/value-objects/QuestType";
import { QuestVisibility } from "@modules/quests/domain/value-objects/QuestVisibility";

function createQuest(status: QuestStatus): Quest {
  return Quest.create({
    id: "quest-1",
    campaignId: "campaign-1",
    title: "Recover the relic",
    description: "Bring back the lost relic.",
    status,
    type: QuestType.create("MAIN"),
    visibility: QuestVisibility.public(),
    priority: QuestPriority.high(),
    giverNpcId: null,
    relatedLocationId: null,
    startedAt: null,
    completedAt: null,
    failedAt: null,
    rewardDescription: null,
    gmNotes: "GM secret",
    createdById: "gm-1",
    createdAt: new Date("2026-06-21T10:00:00.000Z"),
    updatedAt: new Date("2026-06-21T10:00:00.000Z"),
    deletedAt: null,
  });
}

function createAccessService(role: CampaignRole): CampaignAccessApplicationService {
  return {
    requireMembership: vi.fn(),
    requirePermission: vi.fn().mockResolvedValue({ role }),
  } as unknown as CampaignAccessApplicationService;
}

function createQuestRepository(quest: Quest): QuestRepository {
  return {
    findById: vi.fn().mockResolvedValue(quest),
    create: vi.fn(),
    save: vi.fn(),
    createObjective: vi.fn(),
    findObjectiveById: vi.fn(),
    saveObjective: vi.fn(),
    deleteObjective: vi.fn(),
    createRelation: vi.fn(),
    deleteRelation: vi.fn(),
  };
}

function createQuestReadRepository(quest: Quest): QuestReadRepository {
  return {
    listCampaignQuests: vi.fn(),
    getQuestDetails: vi.fn().mockResolvedValue({
      quest,
      objectives: [],
      relations: [],
    }),
    listQuestObjectives: vi.fn(),
  };
}

describe("ChangeQuestStatusHandler", () => {
  it("sets completedAt when quest becomes completed", async () => {
    const quest = createQuest(QuestStatus.active());
    const questRepository = createQuestRepository(quest);
    const handler = new ChangeQuestStatusHandler(
      questRepository,
      createQuestReadRepository(quest),
      createAccessService(CampaignRole.create("GM")),
      new CampaignVisibilityApplicationService(new CampaignPermissionDomainService()),
    );

    const result = await handler.execute(
      new ChangeQuestStatusCommand({
        campaignId: "campaign-1",
        questId: "quest-1",
        actorUserId: "gm-1",
        status: "COMPLETED",
      }),
    );

    expect(questRepository.save).toHaveBeenCalledTimes(1);
    expect(result.status).toBe("COMPLETED");
    expect(result.completedAt).not.toBeNull();
    expect(result.failedAt).toBeNull();
  });

  it("sets failedAt when quest becomes failed", async () => {
    const quest = createQuest(QuestStatus.active());
    const questRepository = createQuestRepository(quest);
    const handler = new ChangeQuestStatusHandler(
      questRepository,
      createQuestReadRepository(quest),
      createAccessService(CampaignRole.owner()),
      new CampaignVisibilityApplicationService(new CampaignPermissionDomainService()),
    );

    const result = await handler.execute(
      new ChangeQuestStatusCommand({
        campaignId: "campaign-1",
        questId: "quest-1",
        actorUserId: "owner-1",
        status: "FAILED",
      }),
    );

    expect(result.status).toBe("FAILED");
    expect(result.failedAt).not.toBeNull();
    expect(result.completedAt).toBeNull();
  });
});
