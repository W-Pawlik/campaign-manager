import { Box, Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { appConstants } from "@/app/config/constants";
import { appPaths } from "@/app/router/paths";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { setLastActiveCampaignId } from "@/app/store/slices/workspaceSlice";
import { useUserCampaignsQuery } from "@/features/campaigns";
import { CreateCampaignDialog } from "@/features/campaigns/ui/CreateCampaignDialog";
import { DashboardCampaignsSection } from "@/features/dashboard/ui/DashboardCampaignsSection";
import { DashboardQuickActions } from "@/features/dashboard/ui/DashboardQuickActions";
import { EmptyState, ErrorState, LoadingScreen, PageHeader, SectionCard } from "@/shared/components";

type DashboardPageProps = {
  onCampaignSelected?: (campaignId: string) => void;
};

export function DashboardPage({ onCampaignSelected }: DashboardPageProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const lastActiveCampaignId = useAppSelector((state) => state.workspace.lastActiveCampaignId);
  const userCampaignsQuery = useUserCampaignsQuery();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const recentCampaigns = useMemo(() => {
    return [...(userCampaignsQuery.data ?? [])]
      .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
      .slice(0, 3);
  }, [userCampaignsQuery.data]);

  const openCampaign = (campaignId: string) => {
    dispatch(setLastActiveCampaignId(campaignId));
    onCampaignSelected?.(campaignId);
    navigate(appPaths.campaign(campaignId));
  };

  if (userCampaignsQuery.isLoading) {
    return <LoadingScreen minHeight="60vh" />;
  }

  if (userCampaignsQuery.isError) {
    return (
      <ErrorState
        message="The campaigns dashboard could not be loaded. Try again in a moment."
        onRetry={() => void userCampaignsQuery.refetch()}
        title="Unable to load campaigns"
      />
    );
  }

  const campaigns = userCampaignsQuery.data ?? [];
  const canOpenLastCampaign =
    Boolean(lastActiveCampaignId) && campaigns.some((campaign) => campaign.id === lastActiveCampaignId);

  return (
    <>
      <Stack spacing={4}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            pb: { xs: 3, md: 4 },
          }}
        >
          <PageHeader
            action={
              <DashboardQuickActions
                canOpenLastCampaign={canOpenLastCampaign}
                onCreateCampaign={() => setIsCreateDialogOpen(true)}
                onOpenLastCampaign={() => {
                  if (lastActiveCampaignId) {
                    openCampaign(lastActiveCampaignId);
                  }
                }}
              />
            }
            description={`Signed in as ${currentUser?.email ?? "unknown user"}. Select a campaign workspace or create a new one in ${appConstants.appName}.`}
            title="Campaign dashboard"
          />
        </Box>

        <Stack spacing={2}>
          <Typography variant="h5">Your campaigns</Typography>
          {campaigns.length === 0 ? (
            <EmptyState
              action={
                <DashboardQuickActions
                  canOpenLastCampaign={false}
                  onCreateCampaign={() => setIsCreateDialogOpen(true)}
                  onOpenLastCampaign={() => undefined}
                />
              }
              description="Create your first campaign to start planning sessions, characters, quests, and story notes."
              title="No campaigns yet"
            />
          ) : (
            <DashboardCampaignsSection campaigns={campaigns} onOpenCampaign={openCampaign} />
          )}
        </Stack>

        <Stack spacing={2}>
          <Typography variant="h5">Recently updated</Typography>
          {recentCampaigns.length === 0 ? (
            <SectionCard>
              <Typography color="text.secondary">Recent campaigns will appear here once you start creating them.</Typography>
            </SectionCard>
          ) : (
            <DashboardCampaignsSection campaigns={recentCampaigns} onOpenCampaign={openCampaign} />
          )}
        </Stack>
      </Stack>

      <CreateCampaignDialog
        onCampaignCreated={(campaignId) => openCampaign(campaignId)}
        onClose={() => setIsCreateDialogOpen(false)}
        open={isCreateDialogOpen}
      />
    </>
  );
}
