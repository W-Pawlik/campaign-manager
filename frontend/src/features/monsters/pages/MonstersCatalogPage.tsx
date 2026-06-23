import { Stack } from "@mui/material";

import { EmptyState, PageHeader, SectionCard } from "@/shared/components";

export function MonstersCatalogPage() {
  return (
    <Stack spacing={3.5}>
      <PageHeader
        description="Browse the global monster catalog, search imported creatures, and prepare statblocks before bringing them into a campaign."
        title="Monsters"
      />

      <SectionCard>
        <EmptyState
          description="This global bestiary will host Open5e search, imported creature details, and reusable monster snapshots shared across your campaign workflows."
          title="Monster catalog is coming next"
        />
      </SectionCard>
    </Stack>
  );
}
