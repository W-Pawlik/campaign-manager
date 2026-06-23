import { Stack } from "@mui/material";
import { useParams } from "react-router-dom";

import { useCampaignDetailsQuery } from "@/features/campaigns";
import { EmptyState, ErrorState, LoadingScreen, PageHeader } from "@/shared/components";

export function CampaignMonstersPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const campaignDetailsQuery = useCampaignDetailsQuery(campaignId);

  if (campaignDetailsQuery.isLoading) {
    return <LoadingScreen minHeight="60vh" />;
  }

  if (!campaignId || campaignDetailsQuery.isError || !campaignDetailsQuery.data) {
    return (
      <ErrorState
        message="The monsters workspace could not be loaded right now."
        onRetry={() => void campaignDetailsQuery.refetch()}
        title="Unable to load monsters"
      />
    );
  }

  return (
    <Stack spacing={3.5}>
      <PageHeader
        description="This module is reserved for the campaign bestiary and Open5e-powered statblock workflows."
        title="Monsters"
      />
      <EmptyState
        description={`The monsters workspace for ${campaignDetailsQuery.data.name} is not wired into the frontend yet, but the navigation shell is ready for it.`}
        title="Monsters are coming next"
      />
    </Stack>
  );
}
