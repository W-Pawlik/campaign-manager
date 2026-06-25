import { Box, Grid, Stack, Typography } from "@mui/material";

import {
  CampaignWorkspaceIcon,
  type CampaignWorkspaceIconKey,
} from "@/features/campaigns/ui/CampaignWorkspaceIcon";
import { SectionCard } from "@/shared/components";

type CampaignOverviewStatsProps = {
  values: Array<{
    accent: string;
    helperText: string;
    icon: CampaignWorkspaceIconKey;
    label: string;
    value: number;
  }>;
};

export function CampaignOverviewStats({ values }: CampaignOverviewStatsProps) {
  return (
    <Grid container spacing={2}>
      {values.map((item) => (
        <Grid key={item.label} size={{ xs: 12, sm: 6, xl: 2 }}>
          <SectionCard>
            <Stack
              direction="row"
              spacing={1.5}
              sx={{ alignItems: "center", justifyContent: "space-between" }}
            >
              <Stack spacing={0.75}>
                <Typography color="text.secondary" variant="body2">
                  {item.label}
                </Typography>
                <Typography sx={{ color: "#fff7e9", fontSize: "2rem", lineHeight: 1 }} variant="h4">
                  {item.value}
                </Typography>
                <Typography color="text.secondary" variant="caption">
                  {item.helperText}
                </Typography>
              </Stack>

              <Box
                sx={{
                  alignItems: "center",
                  bgcolor: `${item.accent}22`,
                  border: `1px solid ${item.accent}44`,
                  borderRadius: 2.5,
                  color: item.accent,
                  display: "inline-flex",
                  justifyContent: "center",
                  p: 1.1,
                }}
              >
                <CampaignWorkspaceIcon icon={item.icon} size={26} />
              </Box>
            </Stack>
          </SectionCard>
        </Grid>
      ))}
    </Grid>
  );
}
