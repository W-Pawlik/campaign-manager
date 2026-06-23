import { Alert, Button, Stack, Tab, Tabs } from "@mui/material";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { useAppSelector } from "@/app/store/hooks";
import { useCampaignDetailsQuery } from "@/features/campaigns";
import {
  useAcceptCampaignInvitationMutation,
  useCampaignInvitationsQuery,
  useCampaignMembersQuery,
  useDeclineCampaignInvitationMutation,
  useInviteCampaignMemberMutation,
  useRemoveCampaignMemberMutation,
  useUpdateCampaignMemberMutation,
} from "@/features/members/api/membersQueries";
import { CampaignInvitationsList } from "@/features/members/ui/CampaignInvitationsList";
import { CampaignMembersList } from "@/features/members/ui/CampaignMembersList";
import { InviteMemberDialog } from "@/features/members/ui/InviteMemberDialog";
import { ErrorState, LoadingScreen, PageHeader, SectionCard } from "@/shared/components";

function canManageMembers(role: string | undefined): boolean {
  return role === "OWNER" || role === "GM" || role === "CO_GM";
}

export function CampaignMembersPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const currentUserId = useAppSelector((state) => state.auth.currentUser?.id ?? null);
  const campaignDetailsQuery = useCampaignDetailsQuery(campaignId);
  const membersQuery = useCampaignMembersQuery(campaignId);
  const invitationsQuery = useCampaignInvitationsQuery(campaignId);
  const inviteCampaignMemberMutation = useInviteCampaignMemberMutation(campaignId);
  const updateCampaignMemberMutation = useUpdateCampaignMemberMutation(campaignId);
  const removeCampaignMemberMutation = useRemoveCampaignMemberMutation(campaignId);
  const acceptCampaignInvitationMutation = useAcceptCampaignInvitationMutation(campaignId);
  const declineCampaignInvitationMutation = useDeclineCampaignInvitationMutation(campaignId);
  const [activeTab, setActiveTab] = useState<"members" | "invitations">("members");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const pageError = useMemo(() => {
    if (membersQuery.isError) {
      return membersQuery.error.message;
    }

    if (invitationsQuery.isError) {
      return invitationsQuery.error.message;
    }

    if (campaignDetailsQuery.isError) {
      return campaignDetailsQuery.error.message;
    }

    return null;
  }, [campaignDetailsQuery.error, campaignDetailsQuery.isError, invitationsQuery.error, invitationsQuery.isError, membersQuery.error, membersQuery.isError]);

  if (campaignDetailsQuery.isLoading || membersQuery.isLoading || invitationsQuery.isLoading) {
    return <LoadingScreen minHeight="60vh" />;
  }

  if (!campaignId || !campaignDetailsQuery.data || pageError) {
    return (
      <ErrorState
        message={pageError ?? "Campaign membership data could not be loaded."}
        onRetry={() => {
          void campaignDetailsQuery.refetch();
          void membersQuery.refetch();
          void invitationsQuery.refetch();
        }}
        title="Unable to load members"
      />
    );
  }

  const managerRole = campaignDetailsQuery.data.role;
  const canManage = canManageMembers(managerRole);
  const isMutating =
    inviteCampaignMemberMutation.isPending ||
    updateCampaignMemberMutation.isPending ||
    removeCampaignMemberMutation.isPending ||
    acceptCampaignInvitationMutation.isPending ||
    declineCampaignInvitationMutation.isPending;

  const mutationError =
    inviteCampaignMemberMutation.error?.message ??
    updateCampaignMemberMutation.error?.message ??
    removeCampaignMemberMutation.error?.message ??
    acceptCampaignInvitationMutation.error?.message ??
    declineCampaignInvitationMutation.error?.message ??
    null;

  return (
    <>
      <Stack spacing={3.5}>
        <PageHeader
          action={
            canManage ? (
              <Button onClick={() => setIsInviteDialogOpen(true)} variant="contained">
                Invite member
              </Button>
            ) : undefined
          }
          description="Manage campaign roles, review invitation status, and keep the table roster aligned."
          title="Members"
        />

        {mutationError ? <Alert severity="error">{mutationError}</Alert> : null}

        <SectionCard>
          <Stack spacing={2.5}>
            <Tabs
              value={activeTab}
              onChange={(_event, value: "members" | "invitations") => setActiveTab(value)}
            >
              <Tab label={`Members (${membersQuery.data?.length ?? 0})`} value="members" />
              <Tab label={`Invitations (${invitationsQuery.data?.length ?? 0})`} value="invitations" />
            </Tabs>

            {activeTab === "members" ? (
              <CampaignMembersList
                canManageMembers={canManage}
                isSubmitting={isMutating}
                members={membersQuery.data ?? []}
                onRemoveMember={(memberId) => removeCampaignMemberMutation.mutate(memberId)}
                onRoleChange={(memberId, role) =>
                  updateCampaignMemberMutation.mutate({ memberId, payload: { role } })
                }
              />
            ) : (
              <CampaignInvitationsList
                canRespondToInvitations={true}
                currentUserId={currentUserId}
                invitations={invitationsQuery.data ?? []}
                isSubmitting={isMutating}
                onAcceptInvitation={(invitationId) => acceptCampaignInvitationMutation.mutate(invitationId)}
                onDeclineInvitation={(invitationId) => declineCampaignInvitationMutation.mutate(invitationId)}
              />
            )}
          </Stack>
        </SectionCard>
      </Stack>

      <InviteMemberDialog
        isSubmitting={inviteCampaignMemberMutation.isPending}
        onClose={() => setIsInviteDialogOpen(false)}
        onSubmit={async (values) => {
          await inviteCampaignMemberMutation.mutateAsync(values);
          setIsInviteDialogOpen(false);
        }}
        open={isInviteDialogOpen}
        submitError={inviteCampaignMemberMutation.error?.message ?? null}
      />
    </>
  );
}
