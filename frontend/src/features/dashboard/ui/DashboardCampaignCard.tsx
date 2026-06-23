import { Button, Stack, Typography } from "@mui/material";

import { SectionCard } from "@/shared/components";
import type { CampaignListItem } from "@/features/campaigns/model/campaign.types";

type DashboardCampaignCardProps = {
  campaign: CampaignListItem;
  onOpen: (campaignId: string) => void;
};

export function DashboardCampaignCard({ campaign, onOpen }: DashboardCampaignCardProps) {
  return (
    <SectionCard>
      <Stack spacing={1.5}>
        <Stack spacing={0.5}>
          <Typography variant="h6">{campaign.name}</Typography>
          <Typography color="text.secondary" variant="body2">
            {campaign.description ?? "No description yet."}
          </Typography>
        </Stack>
        <Typography color="text.secondary" variant="caption">
          {campaign.role} · {campaign.visibility} · Updated{" "}
          {new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(campaign.updatedAt))}
        </Typography>
        <Button onClick={() => onOpen(campaign.id)} variant="outlined">
          Open workspace
        </Button>
      </Stack>
    </SectionCard>
  );
}
