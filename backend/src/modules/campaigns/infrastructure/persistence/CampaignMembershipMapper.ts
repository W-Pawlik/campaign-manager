import type {
  CampaignInvitation as PrismaCampaignInvitation,
  CampaignMember as PrismaCampaignMember,
  Prisma,
} from "@prisma/client";
import { CampaignInvitation } from "@modules/campaigns/domain/entities/CampaignInvitation";
import { CampaignMember } from "@modules/campaigns/domain/entities/CampaignMember";
import { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";
import { MemberStatus } from "@modules/campaigns/domain/value-objects/MemberStatus";

export class CampaignMembershipMapper {
  public memberToDomain(prismaMember: PrismaCampaignMember): CampaignMember {
    return CampaignMember.create({
      id: prismaMember.id,
      campaignId: prismaMember.campaignId,
      userId: prismaMember.userId,
      role: CampaignRole.create(prismaMember.role),
      status: MemberStatus.create(prismaMember.status),
      nickname: prismaMember.nickname,
      joinedAt: prismaMember.joinedAt,
      invitedAt: prismaMember.invitedAt,
      invitedById: prismaMember.invitedById,
      createdAt: prismaMember.createdAt,
      updatedAt: prismaMember.updatedAt,
    });
  }

  public invitationToDomain(
    prismaInvitation: PrismaCampaignInvitation,
  ): CampaignInvitation {
    return CampaignInvitation.create({
      id: prismaInvitation.id,
      campaignId: prismaInvitation.campaignId,
      userId: prismaInvitation.userId,
      role: CampaignRole.create(prismaInvitation.role),
      status: MemberStatus.create(prismaInvitation.status),
      invitedById: prismaInvitation.invitedById,
      respondedAt: prismaInvitation.respondedAt,
      createdAt: prismaInvitation.createdAt,
      updatedAt: prismaInvitation.updatedAt,
    });
  }

  public memberToUpdate(member: CampaignMember): Prisma.CampaignMemberUncheckedUpdateInput {
    return {
      role: member.role.value,
      status: member.status.value,
      nickname: member.nickname,
      joinedAt: member.joinedAt,
      invitedAt: member.invitedAt,
      invitedById: member.invitedById,
      updatedAt: member.updatedAt,
    };
  }

  public invitationToUpdate(
    invitation: CampaignInvitation,
  ): Prisma.CampaignInvitationUncheckedUpdateInput {
    return {
      role: invitation.role.value,
      status: invitation.status.value,
      respondedAt: invitation.respondedAt,
      updatedAt: invitation.updatedAt,
    };
  }
}
