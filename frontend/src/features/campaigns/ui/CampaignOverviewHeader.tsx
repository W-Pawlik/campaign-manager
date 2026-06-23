import { Button } from "@mui/material";

import { PageHeader } from "@/shared/components";
import type { CampaignDetails } from "@/features/campaigns/model/campaign.types";

type CampaignOverviewHeaderProps = {
  campaign: CampaignDetails;
};

export function CampaignOverviewHeader({ campaign }: CampaignOverviewHeaderProps) {
  const description = campaign.description
    ? campaign.description
    : "Your campaign workspace is ready. Sessions, characters, notes, and quests will live here.";

  return (
    <PageHeader
      action={
        <Button disabled variant="outlined">
          Edit campaign
        </Button>
      }
      description={description}
      title={campaign.name}
    />
  );
}
