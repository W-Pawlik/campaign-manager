import { describe, expect, it, vi } from "vitest";
import { NotFoundError } from "@core/application/errors/AppError";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import { CampaignPermissionDomainService } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";
import { GetQuestDetailsHandler } from "@modules/quests/application/handlers/GetQuestDetailsHandler";
import type { QuestReadRepository } from "@modules/quests/application/ports/QuestReadRepository";
import { GetQuestDetailsQuery } from "@modules/quests/application/queries/GetQuestDetailsQuery";
import { QuestVisibilityApplicationService } from "@modules/quests/application/services/QuestVisibilityApplicationService";
import { Quest } from "@modules/quests/domain/entities/Quest";
import { QuestPriority } from "@modules/quests/domain/value-objects/QuestPriority";
import { QuestStatus } from "@modules/quests/domain/value-objects/QuestStatus";
import { QuestType } from "@modules/quests/domain/value-objects/QuestType";
import { QuestVisibility } from "@modules/quests/domain/value-objects/QuestVisibility";

function createQuest(visibility: QuestVisibility, status: QuestStatus = QuestStatus.available()): Quest {
  return Quest.create({
    id: "quest-1",
    campaignId: "campaign-1",
    title: "Silent threat",
    description: "Track the cult.",
    status,
    type: QuestType.side(),
    visibility,
    priority: QuestPriority.normal(),
    giverNpcId: null,
    relatedLocationId: null,
    startedAt: null,
    completedAt: null,
    failedAt: null,
    rewardDescription: null,
    gmNotes: "Only for GM",
    createdById: "gm-1",
    createdAt: new Date("2026-06-21T10:00:00.000Z"),
    updatedAt: new Date("2026-06-21T10:00:00.000Z"),
    deletedAt: null,
  });
}

function createAccessService(role: CampaignRole): CampaignAccessApplicationService {
  return {
    requirePermission: vi.fn(),
    requireMembership: vi.fn().mockResolvedValue({ role }),
  } as unknown as CampaignAccessApplicationService;
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

describe("GetQuestDetailsHandler", () => {
  it("returns player view without gmNotes for players", async () => {
    const visibilityService = new CampaignVisibilityApplicationService(new CampaignPermissionDomainService());
    const handler = new GetQuestDetailsHandler(
      createAccessService(CampaignRole.player()),
      visibilityService,
      createQuestReadRepository(createQuest(QuestVisibility.public())),
      new QuestVisibilityApplicationService(visibilityService),
    );

    const result = await handler.execute(
      new GetQuestDetailsQuery({
        campaignId: "campaign-1",
        questId: "quest-1",
        actorUserId: "player-1",
      }),
    );

    expect(result.visibility).toBe("PUBLIC");
    expect("gmNotes" in result).toBe(false);
  });

  it("hides GM-only quests from players", async () => {
    const visibilityService = new CampaignVisibilityApplicationService(new CampaignPermissionDomainService());
    const handler = new GetQuestDetailsHandler(
      createAccessService(CampaignRole.player()),
      visibilityService,
      createQuestReadRepository(createQuest(QuestVisibility.gmOnly())),
      new QuestVisibilityApplicationService(visibilityService),
    );

    await expect(
      handler.execute(
        new GetQuestDetailsQuery({
          campaignId: "campaign-1",
          questId: "quest-1",
          actorUserId: "player-1",
        }),
      ),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
