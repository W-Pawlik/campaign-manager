import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { campaignsQueryKeys } from "@/features/campaigns";
import { membersApi } from "@/features/members/api/membersApi";
import type {
  InviteCampaignMemberPayload,
  UpdateCampaignMemberPayload,
} from "@/features/members/model/member.types";

export const membersQueryKeys = {
  all: ["campaign-members"] as const,
  invitations: (campaignId: string) => [...membersQueryKeys.all, campaignId, "invitations"] as const,
  members: (campaignId: string) => [...membersQueryKeys.all, campaignId, "members"] as const,
};

function invalidateCampaignMembershipQueries(queryClient: ReturnType<typeof useQueryClient>, campaignId: string) {
  queryClient.invalidateQueries({ queryKey: membersQueryKeys.members(campaignId) });
  queryClient.invalidateQueries({ queryKey: membersQueryKeys.invitations(campaignId) });
  queryClient.invalidateQueries({ queryKey: campaignsQueryKeys.members(campaignId) });
  queryClient.invalidateQueries({ queryKey: campaignsQueryKeys.invitations(campaignId) });
  queryClient.invalidateQueries({ queryKey: campaignsQueryKeys.details(campaignId) });
  queryClient.invalidateQueries({ queryKey: campaignsQueryKeys.lists() });
}

export function useCampaignMembersQuery(campaignId: string | undefined) {
  return useQuery({
    enabled: Boolean(campaignId),
    queryFn: () => membersApi.listCampaignMembers(campaignId!),
    queryKey: membersQueryKeys.members(campaignId ?? "missing"),
  });
}

export function useCampaignInvitationsQuery(campaignId: string | undefined) {
  return useQuery({
    enabled: Boolean(campaignId),
    queryFn: () => membersApi.listCampaignInvitations(campaignId!),
    queryKey: membersQueryKeys.invitations(campaignId ?? "missing"),
  });
}

export function useInviteCampaignMemberMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: InviteCampaignMemberPayload) => membersApi.inviteCampaignMember(campaignId!, payload),
    onSuccess: () => {
      if (campaignId) {
        invalidateCampaignMembershipQueries(queryClient, campaignId);
      }
    },
  });
}

export function useUpdateCampaignMemberMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { memberId: string; payload: UpdateCampaignMemberPayload }) =>
      membersApi.updateCampaignMember(campaignId!, input.memberId, input.payload),
    onSuccess: () => {
      if (campaignId) {
        invalidateCampaignMembershipQueries(queryClient, campaignId);
      }
    },
  });
}

export function useRemoveCampaignMemberMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) => membersApi.removeCampaignMember(campaignId!, memberId),
    onSuccess: () => {
      if (campaignId) {
        invalidateCampaignMembershipQueries(queryClient, campaignId);
      }
    },
  });
}

export function useAcceptCampaignInvitationMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) => membersApi.acceptCampaignInvitation(campaignId!, invitationId),
    onSuccess: () => {
      if (campaignId) {
        invalidateCampaignMembershipQueries(queryClient, campaignId);
      }
    },
  });
}

export function useDeclineCampaignInvitationMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) => membersApi.declineCampaignInvitation(campaignId!, invitationId),
    onSuccess: () => {
      if (campaignId) {
        invalidateCampaignMembershipQueries(queryClient, campaignId);
      }
    },
  });
}
