import { describe, expect, it, vi } from "vitest";
import { ForbiddenError, NotFoundError } from "@core/application/errors/AppError";
import type { CampaignMembershipRepository } from "@modules/campaigns/application/ports/CampaignMembershipRepository";
import type { CampaignRepository } from "@modules/campaigns/application/ports/CampaignRepository";
import { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { Campaign } from "@modules/campaigns/domain/entities/Campaign";
import { CampaignMember } from "@modules/campaigns/domain/entities/CampaignMember";
import {
  CAMPAIGN_PERMISSION_ACTION,
  CampaignPermissionDomainService,
} from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
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
    createdAt: new Date("2026-01-01T10:00:00.000Z"),
    updatedAt: new Date("2026-01-01T10:00:00.000Z"),
    archivedAt: null,
    deletedAt: null,
  });
}

function createMember(role: CampaignRole): CampaignMember {
  return CampaignMember.create({
    id: "member-1",
    campaignId: "campaign-1",
    userId: "user-1",
    role,
    status: MemberStatus.active(),
    nickname: null,
    joinedAt: new Date("2026-01-01T10:00:00.000Z"),
    invitedAt: null,
    invitedById: null,
    createdAt: new Date("2026-01-01T10:00:00.000Z"),
    updatedAt: new Date("2026-01-01T10:00:00.000Z"),
  });
}

function createCampaignRepository(campaign: Campaign | null): CampaignRepository {
  return {
    findById: vi.fn().mockResolvedValue(campaign),
    findBySlug: vi.fn(),
    findUserRole: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
  };
}

function createMembershipRepository(member: CampaignMember | null): CampaignMembershipRepository {
  return {
    findActiveMemberByUserId: vi.fn().mockResolvedValue(member),
    listActiveMembers: vi.fn().mockResolvedValue([]),
    findMemberById: vi.fn(),
    findActiveInvitationByUserId: vi.fn(),
    findInvitationById: vi.fn(),
    createInvitation: vi.fn(),
    saveInvitation: vi.fn(),
    upsertActiveMemberFromInvitation: vi.fn(),
    saveMember: vi.fn(),
    transferOwnership: vi.fn(),
    countActiveOwners: vi.fn(),
    findUserRole: vi.fn(),
  };
}

function createService(
  campaignRepository: CampaignRepository,
  membershipRepository: CampaignMembershipRepository,
): CampaignAccessApplicationService {
  return new CampaignAccessApplicationService(
    campaignRepository,
    membershipRepository,
    new CampaignPermissionDomainService(),
  );
}

describe("CampaignAccessApplicationService", () => {
  it("returns campaign access for an active member with permission", async () => {
    const campaignRepository = createCampaignRepository(createCampaign());
    const membershipRepository = createMembershipRepository(createMember(CampaignRole.owner()));
    const service = createService(campaignRepository, membershipRepository);

    const access = await service.requirePermission(
      "campaign-1",
      "user-1",
      CAMPAIGN_PERMISSION_ACTION.CAMPAIGN_UPDATE,
    );

    expect(access.campaign.id).toBe("campaign-1");
    expect(access.role.value).toBe("OWNER");
  });

  it("blocks non-members before checking permissions", async () => {
    const campaignRepository = createCampaignRepository(createCampaign());
    const membershipRepository = createMembershipRepository(null);
    const service = createService(campaignRepository, membershipRepository);

    await expect(
      service.requirePermission("campaign-1", "user-1", CAMPAIGN_PERMISSION_ACTION.CAMPAIGN_READ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("blocks members without the requested permission", async () => {
    const campaignRepository = createCampaignRepository(createCampaign());
    const membershipRepository = createMembershipRepository(createMember(CampaignRole.player()));
    const service = createService(campaignRepository, membershipRepository);

    await expect(
      service.requirePermission(
        "campaign-1",
        "user-1",
        CAMPAIGN_PERMISSION_ACTION.CAMPAIGN_UPDATE,
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("does not expose missing campaigns as permission failures", async () => {
    const campaignRepository = createCampaignRepository(null);
    const membershipRepository = createMembershipRepository(createMember(CampaignRole.owner()));
    const service = createService(campaignRepository, membershipRepository);

    await expect(
      service.requirePermission("campaign-1", "user-1", CAMPAIGN_PERMISSION_ACTION.CAMPAIGN_READ),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});


