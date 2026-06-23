import { Grid } from "@mui/material";

import type { CampaignListItem } from "@/features/campaigns/model/campaign.types";
import { DashboardCampaignCard } from "@/features/dashboard/ui/DashboardCampaignCard";

type DashboardCampaignsSectionProps = {
  campaigns: CampaignListItem[];
  onOpenCampaign: (campaignId: string) => void;
};

export function DashboardCampaignsSection({
  campaigns,
  onOpenCampaign,
}: DashboardCampaignsSectionProps) {
  return (
    <Grid container spacing={2.5}>
      {campaigns.map((campaign) => (
        <Grid key={campaign.id} size={{ xs: 12, md: 6, xl: 4 }}>
          <DashboardCampaignCard campaign={campaign} onOpen={onOpenCampaign} />
        </Grid>
      ))}
    </Grid>
  );
}
