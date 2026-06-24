import { Alert, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";

import { useAppSelector } from "@/app/store/hooks";
import { useUserCampaignsQuery } from "@/features/campaigns";
import {
  useImportOpen5eMonsterToAnyCampaignMutation,
  useOpen5eResourceDetailsQuery,
  useOpen5eSearchQuery,
} from "@/features/monsters/api/monstersQueries";
import type { Open5eSearchResult } from "@/features/monsters/model/monster.types";
import { MonsterImportDialog } from "@/features/monsters/ui/MonsterImportDialog";
import { Open5eResourceDetailsDialog } from "@/features/monsters/ui/Open5eResourceDetailsDialog";
import { Open5eResultsList } from "@/features/monsters/ui/Open5eResultsList";
import { ErrorState, LoadingScreen, PageHeader, SectionCard } from "@/shared/components";

export function MonstersCatalogPage() {
  const lastActiveCampaignId = useAppSelector((state) => state.workspace.lastActiveCampaignId);
  const campaignsQuery = useUserCampaignsQuery();
  const [searchInput, setSearchInput] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("goblin");
  const [selectedResult, setSelectedResult] = useState<Open5eSearchResult | null>(null);
  const [importingResult, setImportingResult] = useState<Open5eSearchResult | null>(null);
  const searchQuery = useOpen5eSearchQuery(submittedSearch, 1);
  const resourceDetailsQuery = useOpen5eResourceDetailsQuery("CREATURE", selectedResult?.key ?? null);
  const importMutation = useImportOpen5eMonsterToAnyCampaignMutation();

  if (campaignsQuery.isLoading) {
    return <LoadingScreen minHeight="60vh" />;
  }

  if (campaignsQuery.isError) {
    return (
      <ErrorState
        message="The monster catalog could not load your campaign access right now."
        onRetry={() => void campaignsQuery.refetch()}
        title="Unable to load catalog"
      />
    );
  }

  const activeImportCampaignId = lastActiveCampaignId ?? campaignsQuery.data?.[0]?.id ?? null;
  const mutationError = importMutation.error?.message ?? null;

  return (
    <>
      <Stack spacing={3.5}>
        <PageHeader
          description="Search Open5e creatures, inspect normalized statblocks, and import reusable snapshots into your campaign bestiaries."
          title="Monsters"
        />

        {mutationError ? <Alert severity="error">{mutationError}</Alert> : null}
        {campaignsQuery.data?.length === 0 ? (
          <Alert severity="info">
            Create or join a campaign first to import Open5e creatures into a campaign bestiary.
          </Alert>
        ) : null}

        <SectionCard>
          <Stack component="form" onSubmit={(event) => {
            event.preventDefault();
            setSubmittedSearch(searchInput.trim());
          }} spacing={2.5}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Search Open5e creatures"
                onChange={(event) => setSearchInput(event.target.value)}
                value={searchInput}
              />
              <Button type="submit" variant="contained">
                Search
              </Button>
            </Stack>
            <Open5eResultsList
              onImport={campaignsQuery.data?.length ? (result) => setImportingResult(result) : undefined}
              onOpenDetails={(result) => setSelectedResult(result)}
              results={searchQuery.data ?? []}
            />
          </Stack>
        </SectionCard>
      </Stack>

      <Open5eResourceDetailsDialog
        onClose={() => setSelectedResult(null)}
        onImport={
          selectedResult && campaignsQuery.data?.length ? () => setImportingResult(selectedResult) : undefined
        }
        open={Boolean(selectedResult)}
        resource={selectedResult ? resourceDetailsQuery.data ?? null : null}
      />

      <MonsterImportDialog
        campaigns={campaignsQuery.data ?? []}
        defaultCampaignId={activeImportCampaignId}
        isSubmitting={importMutation.isPending}
        monsterName={importingResult?.name ?? null}
        onClose={() => setImportingResult(null)}
        onSubmit={async (values) => {
          if (!importingResult) {
            return;
          }

          await importMutation.mutateAsync({
            campaignId: values.campaignId,
            payload: {
              nameOverride: values.nameOverride?.trim() || undefined,
              resourceKey: importingResult.key,
            },
          });
          setImportingResult(null);
        }}
        open={Boolean(importingResult)}
      />
    </>
  );
}
