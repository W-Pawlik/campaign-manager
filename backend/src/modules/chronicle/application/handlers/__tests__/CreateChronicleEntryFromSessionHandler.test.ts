import { describe, expect, it, vi } from "vitest";
import { ForbiddenError, ValidationError } from "@core/application/errors/AppError";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { Campaign } from "@modules/campaigns/domain/entities/Campaign";
import { CampaignMember } from "@modules/campaigns/domain/entities/CampaignMember";
import { CampaignName } from "@modules/campaigns/domain/value-objects/CampaignName";
import { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";
import { CampaignStatus } from "@modules/campaigns/domain/value-objects/CampaignStatus";
import { CampaignVisibility } from "@modules/campaigns/domain/value-objects/CampaignVisibility";
import { MemberStatus } from "@modules/campaigns/domain/value-objects/MemberStatus";
import { ChronicleVisibility } from "@modules/chronicle/domain/value-objects/ChronicleVisibility";
import { CreateChronicleEntryFromSessionCommand } from "@modules/chronicle/application/commands/CreateChronicleEntryFromSessionCommand";
import { CreateChronicleEntryFromSessionHandler } from "@modules/chronicle/application/handlers/CreateChronicleEntryFromSessionHandler";
import type { ChronicleEntryRepository } from "@modules/chronicle/application/ports/ChronicleEntryRepository";
import { ChroniclePermissionDomainService } from "@modules/chronicle/domain/services/ChroniclePermissionDomainService";
import { GameSession } from "@modules/sessions/domain/entities/GameSession";
import type { GameSessionRepository } from "@modules/sessions/application/ports/GameSessionRepository";
import { SessionStatus } from "@modules/sessions/domain/value-objects/SessionStatus";

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
    createdAt: new Date("2026-06-21T10:00:00.000Z"),
    updatedAt: new Date("2026-06-21T10:00:00.000Z"),
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
    joinedAt: new Date("2026-06-21T10:00:00.000Z"),
    invitedAt: null,
    invitedById: null,
    createdAt: new Date("2026-06-21T10:00:00.000Z"),
    updatedAt: new Date("2026-06-21T10:00:00.000Z"),
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

function createSession(
  status: SessionStatus,
  summaryPublic: string | null = "The party defeated the cult.",
): GameSession {
  return GameSession.create({
    id: "session-1",
    campaignId: "campaign-1",
    title: "Session 12",
    description: "Into the sewers",
    status,
    scheduledStartAt: new Date("2026-06-20T18:00:00.000Z"),
    scheduledEndAt: new Date("2026-06-20T22:00:00.000Z"),
    actualStartAt: new Date("2026-06-20T18:15:00.000Z"),
    actualEndAt: new Date("2026-06-20T21:50:00.000Z"),
    locationType: null,
    locationDetails: null,
    meetingUrl: null,
    summaryPublic,
    summaryPrivate: "GM secret",
    createdById: "gm-1",
    createdAt: new Date("2026-06-18T12:00:00.000Z"),
    updatedAt: new Date("2026-06-20T21:50:00.000Z"),
    cancelledAt: null,
  });
}

function createSessionRepository(session: GameSession): GameSessionRepository {
  return {
    findById: vi.fn().mockResolvedValue(session),
    create: vi.fn(),
    save: vi.fn(),
  };
}

function createChronicleRepository(): ChronicleEntryRepository {
  return {
    findById: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
  };
}

describe("CreateChronicleEntryFromSessionHandler", () => {
  it("creates public chronicle entry from completed session using public summary", async () => {
    const chronicleRepository = createChronicleRepository();
    const handler = new CreateChronicleEntryFromSessionHandler(
      chronicleRepository,
      createSessionRepository(createSession(SessionStatus.completed())),
      createAccessService(CampaignRole.create("GM"), "gm-1"),
      new ChroniclePermissionDomainService(),
    );

    const result = await handler.execute(
      new CreateChronicleEntryFromSessionCommand({
        campaignId: "campaign-1",
        sessionId: "session-1",
        actorUserId: "gm-1",
      }),
    );

    expect(chronicleRepository.create).toHaveBeenCalledTimes(1);
    expect(result.title).toBe("Session 12");
    expect(result.content).toBe("The party defeated the cult.");
    expect(result.visibility).toBe(ChronicleVisibility.public().value);
    expect(result.sessionId).toBe("session-1");
  });

  it("rejects generation for non-completed session", async () => {
    const chronicleRepository = createChronicleRepository();
    const handler = new CreateChronicleEntryFromSessionHandler(
      chronicleRepository,
      createSessionRepository(createSession(SessionStatus.planned())),
      createAccessService(CampaignRole.owner(), "owner-1"),
      new ChroniclePermissionDomainService(),
    );

    await expect(
      handler.execute(
        new CreateChronicleEntryFromSessionCommand({
          campaignId: "campaign-1",
          sessionId: "session-1",
          actorUserId: "owner-1",
        }),
      ),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("blocks players from creating GM-only chronicle from session", async () => {
    const chronicleRepository = createChronicleRepository();
    const handler = new CreateChronicleEntryFromSessionHandler(
      chronicleRepository,
      createSessionRepository(createSession(SessionStatus.completed())),
      createAccessService(CampaignRole.player(), "player-1"),
      new ChroniclePermissionDomainService(),
    );

    await expect(
      handler.execute(
        new CreateChronicleEntryFromSessionCommand({
          campaignId: "campaign-1",
          sessionId: "session-1",
          actorUserId: "player-1",
          visibility: "GM_ONLY",
          content: "Should be blocked",
        }),
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});
