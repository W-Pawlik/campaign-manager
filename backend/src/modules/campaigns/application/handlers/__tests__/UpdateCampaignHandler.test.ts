import { describe, expect, it, vi } from "vitest";
import { ForbiddenError } from "@core/application/errors/AppError";
import { UpdateCampaignCommand } from "@modules/campaigns/application/commands/UpdateCampaignCommand";
import { UpdateCampaignHandler } from "@modules/campaigns/application/handlers/UpdateCampaignHandler";
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

function createArchivedCampaign(): Campaign {
  return Campaign.create({
    id: "campaign-1",
    ownerId: "user-1",
    name: CampaignName.create("Old Name"),
    slug: "old-name",
    description: null,
    gameSystemId: null,
    status: CampaignStatus.archived(),
    visibility: CampaignVisibility.private(),
    coverImageUrl: null,
    coverImageKey: null,
    defaultLanguage: null,
    currentDateInWorld: null,
    worldName: null,
    startingLevel: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    archivedAt: new Date(),
    deletedAt: null,
  });
}

function createOwnerMember(): CampaignMember {
  return CampaignMember.create({
    id: "member-1",
    campaignId: "campaign-1",
    userId: "user-1",
    role: CampaignRole.owner(),
    status: MemberStatus.active(),
    nickname: null,
    joinedAt: new Date(),
    invitedAt: null,
    invitedById: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

function createMembershipRepository(): CampaignMembershipRepository {
  return {
    findActiveMemberByUserId: vi.fn().mockResolvedValue(createOwnerMember()),
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

describe("UpdateCampaignHandler", () => {
  it("blocks updates for archived campaigns", async () => {
    const campaignRepository: CampaignRepository = {
      findById: vi.fn().mockResolvedValue(createArchivedCampaign()),
      findBySlug: vi.fn().mockResolvedValue(null),
      findUserRole: vi.fn().mockResolvedValue(CampaignRole.owner()),
      create: vi.fn(),
      save: vi.fn(),
    };
    const membershipRepository = createMembershipRepository();
    const accessService = new CampaignAccessApplicationService(
      campaignRepository,
      membershipRepository,
      new CampaignPermissionDomainService(),
    );
    const handler = new UpdateCampaignHandler(campaignRepository, accessService);

    await expect(
      handler.execute(
        new UpdateCampaignCommand({
          campaignId: "campaign-1",
          actorUserId: "user-1",
          name: "New Name",
        }),
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
    expect(campaignRepository.save).not.toHaveBeenCalled();
  });
});


