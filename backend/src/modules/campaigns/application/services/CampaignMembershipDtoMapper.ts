import type { CampaignInvitationDTO } from "@modules/campaigns/application/dto/CampaignInvitationDTO";
import type { CampaignMemberDTO } from "@modules/campaigns/application/dto/CampaignMemberDTO";
import type { CampaignInvitation } from "@modules/campaigns/domain/entities/CampaignInvitation";
import type { CampaignMember } from "@modules/campaigns/domain/entities/CampaignMember";

export function mapCampaignMemberDto(member: CampaignMember): CampaignMemberDTO {
  return {
    id: member.id,
    campaignId: member.campaignId,
    userId: member.userId,
    username: null,
    displayName: null,
    avatarUrl: null,
    role: member.role.value,
    status: member.status.value,
    nickname: member.nickname,
    joinedAt: member.joinedAt?.toISOString() ?? null,
    invitedAt: member.invitedAt?.toISOString() ?? null,
    invitedById: member.invitedById,
    invitedByUsername: null,
    invitedByDisplayName: null,
    createdAt: member.createdAt.toISOString(),
    updatedAt: member.updatedAt.toISOString(),
  };
}

export function mapCampaignInvitationDto(
  invitation: CampaignInvitation,
): CampaignInvitationDTO {
  return {
    id: invitation.id,
    campaignId: invitation.campaignId,
    userId: invitation.userId,
    username: null,
    displayName: null,
    avatarUrl: null,
    role: invitation.role.value,
    status: invitation.status.value,
    invitedById: invitation.invitedById,
    invitedByUsername: null,
    invitedByDisplayName: null,
    respondedAt: invitation.respondedAt?.toISOString() ?? null,
    createdAt: invitation.createdAt.toISOString(),
    updatedAt: invitation.updatedAt.toISOString(),
  };
}
