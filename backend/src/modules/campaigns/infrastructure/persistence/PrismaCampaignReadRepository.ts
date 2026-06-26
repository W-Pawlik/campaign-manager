import type { PrismaClient } from "@prisma/client";
import type { CampaignDetailsDTO } from "@modules/campaigns/application/dto/CampaignDetailsDTO";
import type { CampaignInvitationDTO } from "@modules/campaigns/application/dto/CampaignInvitationDTO";
import type { CampaignListItemDTO } from "@modules/campaigns/application/dto/CampaignListItemDTO";
import type { CampaignMemberDTO } from "@modules/campaigns/application/dto/CampaignMemberDTO";
import type { CampaignReadRepository } from "@modules/campaigns/application/ports/CampaignReadRepository";
import { MEMBER_STATUS } from "@modules/campaigns/domain/value-objects/MemberStatus";

export class PrismaCampaignReadRepository implements CampaignReadRepository {
  public constructor(private readonly prismaClient: PrismaClient) {}

  public async listForUser(userId: string): Promise<CampaignListItemDTO[]> {
    const memberships = await this.prismaClient.campaignMember.findMany({
      where: {
        userId,
        status: MEMBER_STATUS.ACTIVE,
        campaign: {
          deletedAt: null,
        },
      },
      include: {
        campaign: true,
      },
      orderBy: {
        campaign: {
          updatedAt: "desc",
        },
      },
    });

    return memberships.map((membership) => ({
      id: membership.campaign.id,
      ownerId: membership.campaign.ownerId,
      name: membership.campaign.name,
      slug: membership.campaign.slug,
      description: membership.campaign.description,
      status: membership.campaign.status,
      visibility: membership.campaign.visibility,
      coverImageUrl: membership.campaign.coverImageUrl,
      worldName: membership.campaign.worldName,
      role: membership.role,
      createdAt: membership.campaign.createdAt.toISOString(),
      updatedAt: membership.campaign.updatedAt.toISOString(),
      archivedAt: membership.campaign.archivedAt?.toISOString() ?? null,
    }));
  }

  public async getDetailsForUser(campaignId: string, userId: string): Promise<CampaignDetailsDTO | null> {
    const membership = await this.prismaClient.campaignMember.findFirst({
      where: {
        userId,
        campaignId,
        status: MEMBER_STATUS.ACTIVE,
        campaign: {
          deletedAt: null,
        },
      },
      include: {
        campaign: true,
      },
    });

    if (membership === null) {
      return null;
    }

    return {
      id: membership.campaign.id,
      ownerId: membership.campaign.ownerId,
      name: membership.campaign.name,
      slug: membership.campaign.slug,
      description: membership.campaign.description,
      gameSystemId: membership.campaign.gameSystemId,
      status: membership.campaign.status,
      visibility: membership.campaign.visibility,
      coverImageUrl: membership.campaign.coverImageUrl,
      defaultLanguage: membership.campaign.defaultLanguage,
      currentDateInWorld: membership.campaign.currentDateInWorld,
      worldName: membership.campaign.worldName,
      startingLevel: membership.campaign.startingLevel,
      role: membership.role,
      createdAt: membership.campaign.createdAt.toISOString(),
      updatedAt: membership.campaign.updatedAt.toISOString(),
      archivedAt: membership.campaign.archivedAt?.toISOString() ?? null,
      deletedAt: membership.campaign.deletedAt?.toISOString() ?? null,
    };
  }

  public async listMembers(campaignId: string): Promise<CampaignMemberDTO[]> {
    const members = await this.prismaClient.campaignMember.findMany({
      where: {
        campaignId,
      },
      include: {
        invitedBy: {
          select: {
            username: true,
          },
        },
        user: {
          select: {
            avatarUrl: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return members.map((member) => ({
      id: member.id,
      campaignId: member.campaignId,
      userId: member.userId,
      username: member.user.username,
      avatarUrl: member.user.avatarUrl,
      role: member.role,
      status: member.status,
      nickname: member.nickname,
      joinedAt: member.joinedAt?.toISOString() ?? null,
      invitedAt: member.invitedAt?.toISOString() ?? null,
      invitedById: member.invitedById,
      invitedByUsername: member.invitedBy?.username ?? null,
      createdAt: member.createdAt.toISOString(),
      updatedAt: member.updatedAt.toISOString(),
    }));
  }

  public async listInvitations(campaignId: string): Promise<CampaignInvitationDTO[]> {
    const invitations = await this.prismaClient.campaignInvitation.findMany({
      where: {
        campaignId,
      },
      include: {
        campaign: {
          select: {
            name: true,
          },
        },
        invitedBy: {
          select: {
            username: true,
          },
        },
        user: {
          select: {
            avatarUrl: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return invitations.map((invitation) => ({
      id: invitation.id,
      campaignId: invitation.campaignId,
      campaignName: invitation.campaign.name,
      userId: invitation.userId,
      username: invitation.user.username,
      avatarUrl: invitation.user.avatarUrl,
      role: invitation.role,
      status: invitation.status,
      invitedById: invitation.invitedById,
      invitedByUsername: invitation.invitedBy.username,
      respondedAt: invitation.respondedAt?.toISOString() ?? null,
      createdAt: invitation.createdAt.toISOString(),
      updatedAt: invitation.updatedAt.toISOString(),
    }));
  }

  public async listInvitationsForUser(userId: string): Promise<CampaignInvitationDTO[]> {
    const invitations = await this.prismaClient.campaignInvitation.findMany({
      where: {
        userId,
        status: "INVITED",
        campaign: {
          deletedAt: null,
        },
      },
      include: {
        campaign: {
          select: {
            name: true,
          },
        },
        invitedBy: {
          select: {
            username: true,
          },
        },
      },
      orderBy: [{ createdAt: "desc" }, { campaignId: "asc" }],
    });

    return invitations.map((invitation) => ({
      id: invitation.id,
      campaignId: invitation.campaignId,
      campaignName: invitation.campaign.name,
      userId: invitation.userId,
      username: null,
      avatarUrl: null,
      role: invitation.role,
      status: invitation.status,
      invitedById: invitation.invitedById,
      invitedByUsername: invitation.invitedBy.username,
      respondedAt: invitation.respondedAt?.toISOString() ?? null,
      createdAt: invitation.createdAt.toISOString(),
      updatedAt: invitation.updatedAt.toISOString(),
    }));
  }
}
