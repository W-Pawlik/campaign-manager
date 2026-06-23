import { MenuItem, TextField } from "@mui/material";

import type { CampaignListItem } from "@/features/campaigns/model/campaign.types";

type CampaignSwitcherProps = {
  campaigns: CampaignListItem[];
  onChange: (campaignId: string) => void;
  value: string;
};

export function CampaignSwitcher({ campaigns, onChange, value }: CampaignSwitcherProps) {
  return (
    <TextField
      select
      size="small"
      sx={{
        minWidth: 220,
        "& .MuiInputBase-root": {
          bgcolor: "background.default",
        },
      }}
      value={value}
      onChange={(event) => {
        if (event.target.value) {
          onChange(event.target.value);
        }
      }}
    >
      <MenuItem value="">Select campaign</MenuItem>
      {campaigns.map((campaign) => (
        <MenuItem key={campaign.id} value={campaign.id}>
          {campaign.name}
        </MenuItem>
      ))}
    </TextField>
  );
}
