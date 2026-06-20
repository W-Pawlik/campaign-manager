import type { PrismaClient } from "@prisma/client";
import type { CampaignMembershipRepository } from "@modules/campaigns/application/ports/CampaignMembershipRepository";
import type { CampaignInvitation } from "@modules/campaigns/domain/entities/CampaignInvitation";
import type { CampaignMember } from "@modules/campaigns/domain/entities/CampaignMember";
import type { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";
import { CAMPAIGN_ROLE } from "@modules/campaigns/domain/value-objects/CampaignRole";
import { MEMBER_STATUS } from "@modules/campaigns/domain/value-objects/MemberStatus";
import type { CampaignMembershipMapper } from "@modules/campaigns/infrastructure/persistence/CampaignMembershipMapper";

export class PrismaCampaignMembershipRepository implements CampaignMembershipRepository {
  public constructor(
    private readonly prismaClient: PrismaClient,
    private readonly mapper: CampaignMembershipMapper,
  ) {}

  public async findActiveMemberByUserId(
    campaignId: string,
    userId: string,
  ): Promise<CampaignMember | null> {
    const member = await this.prismaClient.campaignMember.findFirst({
      where: {
        campaignId,
        userId,
        status: MEMBER_STATUS.ACTIVE,
      },
    });

    return member === null ? null : this.mapper.memberToDomain(member);
  }

  public async listActiveMembers(campaignId: string): Promise<CampaignMember[]> {
    const members = await this.prismaClient.campaignMember.findMany({
      where: {
        campaignId,
        status: MEMBER_STATUS.ACTIVE,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return members.map((member) => this.mapper.memberToDomain(member));
  }

  public async findMemberById(
    campaignId: string,
    memberId: string,
  ): Promise<CampaignMember | null> {
    const member = await this.prismaClient.campaignMember.findFirst({
      where: {
        id: memberId,
        campaignId,
      },
    });

    return member === null ? null : this.mapper.memberToDomain(member);
  }

  public async findActiveInvitationByUserId(
    campaignId: string,
    userId: string,
  ): Promise<CampaignInvitation | null> {
    const invitation = await this.prismaClient.campaignInvitation.findFirst({
      where: {
        campaignId,
        userId,
        status: MEMBER_STATUS.INVITED,
      },
    });

    return invitation === null ? null : this.mapper.invitationToDomain(invitation);
  }

  public async findInvitationById(
    campaignId: string,
    invitationId: string,
  ): Promise<CampaignInvitation | null> {
    const invitation = await this.prismaClient.campaignInvitation.findFirst({
      where: {
        id: invitationId,
        campaignId,
      },
    });

    return invitation === null ? null : this.mapper.invitationToDomain(invitation);
  }

  public async createInvitation(invitation: CampaignInvitation): Promise<void> {
    await this.prismaClient.campaignInvitation.create({
      data: {
        id: invitation.id,
        campaignId: invitation.campaignId,
        userId: invitation.userId,
        role: invitation.role.value,
        status: invitation.status.value,
        invitedById: invitation.invitedById,
        respondedAt: invitation.respondedAt,
        createdAt: invitation.createdAt,
        updatedAt: invitation.updatedAt,
      },
    });
  }

  public async saveInvitation(invitation: CampaignInvitation): Promise<void> {
    await this.prismaClient.campaignInvitation.update({
      where: { id: invitation.id },
      data: this.mapper.invitationToUpdate(invitation),
    });
  }

  public async upsertActiveMemberFromInvitation(
    invitation: CampaignInvitation,
  ): Promise<CampaignMember> {
    const member = await this.prismaClient.campaignMember.upsert({
      where: {
        campaignId_userId: {
          campaignId: invitation.campaignId,
          userId: invitation.userId,
        },
      },
      create: {
        campaignId: invitation.campaignId,
        userId: invitation.userId,
        role: invitation.role.value,
        status: MEMBER_STATUS.ACTIVE,
        joinedAt: invitation.respondedAt ?? new Date(),
        invitedAt: invitation.createdAt,
        invitedById: invitation.invitedById,
      },
      update: {
        role: invitation.role.value,
        status: MEMBER_STATUS.ACTIVE,
        joinedAt: invitation.respondedAt ?? new Date(),
        invitedAt: invitation.createdAt,
        invitedById: invitation.invitedById,
      },
    });

    return this.mapper.memberToDomain(member);
  }

  public async saveMember(member: CampaignMember): Promise<void> {
    await this.prismaClient.campaignMember.update({
      where: { id: member.id },
      data: this.mapper.memberToUpdate(member),
    });
  }

  public async transferOwnership(
    campaignId: string,
    fromUserId: string,
    toMember: CampaignMember,
  ): Promise<void> {
    await this.prismaClient.$transaction(async (tx) => {
      await tx.campaign.update({
        where: { id: campaignId },
        data: {
          ownerId: toMember.userId,
          updatedAt: new Date(),
        },
      });

      await tx.campaignMember.update({
        where: {
          campaignId_userId: {
            campaignId,
            userId: fromUserId,
          },
        },
        data: {
          role: CAMPAIGN_ROLE.GM,
        },
      });

      await tx.campaignMember.update({
        where: { id: toMember.id },
        data: {
          role: CAMPAIGN_ROLE.OWNER,
        },
      });
    });
  }

  public async countActiveOwners(campaignId: string): Promise<number> {
    return await this.prismaClient.campaignMember.count({
      where: {
        campaignId,
        role: CAMPAIGN_ROLE.OWNER,
        status: MEMBER_STATUS.ACTIVE,
      },
    });
  }

  public async findUserRole(campaignId: string, userId: string): Promise<CampaignRole | null> {
    const member = await this.findActiveMemberByUserId(campaignId, userId);

    return member?.role ?? null;
  }
}
