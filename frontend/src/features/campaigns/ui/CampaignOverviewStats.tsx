import { Grid, Stack, Typography } from "@mui/material";

import { SectionCard } from "@/shared/components";

type CampaignOverviewStatsProps = {
  values: Array<{
    label: string;
    value: number;
  }>;
};

export function CampaignOverviewStats({ values }: CampaignOverviewStatsProps) {
  return (
    <Grid container spacing={2}>
      {values.map((item) => (
        <Grid key={item.label} size={{ xs: 6, lg: 2 }}>
          <SectionCard>
            <Stack spacing={0.5}>
              <Typography color="text.secondary" variant="body2">
                {item.label}
              </Typography>
              <Typography variant="h4">{item.value}</Typography>
            </Stack>
          </SectionCard>
        </Grid>
      ))}
    </Grid>
  );
}
