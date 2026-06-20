import { describe, expect, it, vi } from "vitest";
import { ForbiddenError } from "@core/application/errors/AppError";
import { InviteCampaignMemberCommand } from "@modules/campaigns/application/commands/InviteCampaignMemberCommand";
import { RemoveCampaignMemberCommand } from "@modules/campaigns/application/commands/RemoveCampaignMemberCommand";
import { InviteCampaignMemberHandler } from "@modules/campaigns/application/handlers/InviteCampaignMemberHandler";
import { RemoveCampaignMemberHandler } from "@modules/campaigns/application/handlers/RemoveCampaignMemberHandler";
import type { CampaignMembershipRepository } from "@modules/campaigns/application/ports/CampaignMembershipRepository";
import type { CampaignRepository } from "@modules/campaigns/application/ports/CampaignRepository";
import { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { Campaign } from "@modules/campaigns/domain/entities/Campaign";
import { CampaignMember } from "@modules/campaigns/domain/entities/CampaignMember";
import { CampaignPermissionDomainService } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
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
    userId: role.isOwner() ? "owner-1" : "player-1",
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

function createCampaignRepository(): CampaignRepository {
  return {
    findById: vi.fn().mockResolvedValue(createCampaign()),
    findBySlug: vi.fn(),
    findUserRole: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
  };
}

function createMembershipRepository(): CampaignMembershipRepository {
  return {
    findActiveMemberByUserId: vi.fn().mockImplementation((campaignId: string, userId: string) => {
      if (campaignId === "campaign-1" && userId === "owner-1") {
        return Promise.resolve(createMember(CampaignRole.owner()));
      }

      return Promise.resolve(null);
    }),
    listActiveMembers: vi.fn().mockResolvedValue([]),
    findMemberById: vi.fn(),
    findActiveInvitationByUserId: vi.fn().mockResolvedValue(null),
    findInvitationById: vi.fn(),
    createInvitation: vi.fn(),
    saveInvitation: vi.fn(),
    upsertActiveMemberFromInvitation: vi.fn(),
    saveMember: vi.fn(),
    transferOwnership: vi.fn(),
    countActiveOwners: vi.fn(),
    findUserRole: vi.fn().mockResolvedValue(CampaignRole.owner()),
  };
}

function createAccessService(
  campaignRepository: CampaignRepository,
  membershipRepository: CampaignMembershipRepository,
): CampaignAccessApplicationService {
  return new CampaignAccessApplicationService(
    campaignRepository,
    membershipRepository,
    new CampaignPermissionDomainService(),
  );
}

describe("campaign membership handlers", () => {
  it("creates invited campaign member invitation", async () => {
    const campaignRepository = createCampaignRepository();
    const membershipRepository = createMembershipRepository();
    const permissionService = new CampaignPermissionDomainService();
    const handler = new InviteCampaignMemberHandler(
      membershipRepository,
      createAccessService(campaignRepository, membershipRepository),
      permissionService,
    );

    const result = await handler.execute(
      new InviteCampaignMemberCommand({
        campaignId: "campaign-1",
        actorUserId: "owner-1",
        userId: "player-1",
        role: "PLAYER",
      }),
    );

    expect(membershipRepository.createInvitation).toHaveBeenCalledTimes(1);
    expect(result.status).toBe("INVITED");
    expect(result.role).toBe("PLAYER");
  });

  it("blocks removing owner without ownership transfer", async () => {
    const campaignRepository = createCampaignRepository();
    const membershipRepository = createMembershipRepository();
    vi.mocked(membershipRepository.findMemberById).mockResolvedValue(
      createMember(CampaignRole.owner()),
    );
    const handler = new RemoveCampaignMemberHandler(
      membershipRepository,
      createAccessService(campaignRepository, membershipRepository),
    );

    await expect(
      handler.execute(
        new RemoveCampaignMemberCommand({
          campaignId: "campaign-1",
          actorUserId: "owner-1",
          memberId: "member-1",
        }),
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
    expect(membershipRepository.saveMember).not.toHaveBeenCalled();
  });
});


