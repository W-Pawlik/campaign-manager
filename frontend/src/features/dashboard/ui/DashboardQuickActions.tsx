import { Button, Stack } from "@mui/material";

type DashboardQuickActionsProps = {
  canOpenLastCampaign: boolean;
  onCreateCampaign: () => void;
  onOpenLastCampaign: () => void;
};

export function DashboardQuickActions({
  canOpenLastCampaign,
  onCreateCampaign,
  onOpenLastCampaign,
}: DashboardQuickActionsProps) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
      <Button onClick={onCreateCampaign} variant="contained">
        Create campaign
      </Button>
      <Button disabled={!canOpenLastCampaign} onClick={onOpenLastCampaign} variant="outlined">
        Open last campaign
      </Button>
    </Stack>
  );
}
