import { Box, Button, Grid, Stack, Typography } from "@mui/material";

import { appConstants } from "@/app/config/constants";
import { EmptyState, PageHeader, SectionCard } from "@/shared/components";

const foundationItems = [
  {
    title: "Feature domains",
    description: "Business areas belong under features and expose public APIs from index files.",
  },
  {
    title: "Server state",
    description: "Backend data is reserved for TanStack Query hooks backed by shared Axios.",
  },
  {
    title: "Client state",
    description:
      "Global UI preferences live in Redux Toolkit, with typed hooks from the app store.",
  },
];

export function HomePage() {
  return (
    <Stack spacing={4}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          pb: { xs: 3, md: 4 },
        }}
      >
        <PageHeader
          title={appConstants.appName}
          description="A focused workspace foundation for tabletop RPG campaign management."
          action={<Button variant="contained">New workspace</Button>}
        />
      </Box>

      <Grid container spacing={2.5}>
        {foundationItems.map((item) => (
          <Grid key={item.title} size={{ xs: 12, md: 4 }}>
            <SectionCard title={item.title}>
              <Typography color="text.secondary">{item.description}</Typography>
            </SectionCard>
          </Grid>
        ))}
      </Grid>

      <EmptyState
        title="No campaign view selected"
        description="Domain modules can now be added without changing the application shell."
      />
    </Stack>
  );
}
