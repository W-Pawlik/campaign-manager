import { Alert, Button, Stack, Switch, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { appPaths } from "@/app/router/paths";
import { useCampaignDetailsQuery } from "@/features/campaigns";
import {
  useArchiveMonsterMutation,
  useCampaignMonstersQuery,
  useCreateMonsterMutation,
  useMonsterDetailsQuery,
  useUpdateMonsterMutation,
} from "@/features/monsters/api/monstersQueries";
import { CampaignMonstersList } from "@/features/monsters/ui/CampaignMonstersList";
import { MonsterDetailsDialog } from "@/features/monsters/ui/MonsterDetailsDialog";
import { MonsterFormDialog, type MonsterFormValues } from "@/features/monsters/ui/MonsterFormDialog";
import { ErrorState, LoadingScreen, PageHeader, SectionCard } from "@/shared/components";

function canManageMonsters(role: string | undefined): boolean {
  return role === "OWNER" || role === "GM" || role === "CO_GM";
}

function toNullableString(value?: string): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length === 0 ? null : trimmed;
}

export function CampaignMonstersPage() {
  const navigate = useNavigate();
  const { campaignId } = useParams<{ campaignId: string }>();
  const campaignDetailsQuery = useCampaignDetailsQuery(campaignId);
  const [search, setSearch] = useState("");
  const [includeGlobal, setIncludeGlobal] = useState(false);
  const monstersQuery = useCampaignMonstersQuery(campaignId, {
    includeGlobal,
    search: search.trim() || undefined,
  });
  const createMonsterMutation = useCreateMonsterMutation(campaignId);
  const updateMonsterMutation = useUpdateMonsterMutation(campaignId);
  const archiveMonsterMutation = useArchiveMonsterMutation(campaignId);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingMonsterId, setEditingMonsterId] = useState<string | null>(null);
  const [selectedMonsterId, setSelectedMonsterId] = useState<string | null>(null);
  const monsterDetailsQuery = useMonsterDetailsQuery(campaignId, selectedMonsterId ?? editingMonsterId);

  const pageError = useMemo(() => {
    if (campaignDetailsQuery.isError) {
      return campaignDetailsQuery.error.message;
    }

    if (monstersQuery.isError) {
      return monstersQuery.error.message;
    }

    return null;
  }, [campaignDetailsQuery.error, campaignDetailsQuery.isError, monstersQuery.error, monstersQuery.isError]);

  if (campaignDetailsQuery.isLoading || monstersQuery.isLoading) {
    return <LoadingScreen minHeight="60vh" />;
  }

  if (!campaignId || !campaignDetailsQuery.data || pageError) {
    return (
      <ErrorState
        message={pageError ?? "The monsters workspace could not be loaded right now."}
        onRetry={() => {
          void campaignDetailsQuery.refetch();
          void monstersQuery.refetch();
        }}
        title="Unable to load monsters"
      />
    );
  }

  const canManage = canManageMonsters(campaignDetailsQuery.data.role);
  const mutationError =
    createMonsterMutation.error?.message ??
    updateMonsterMutation.error?.message ??
    archiveMonsterMutation.error?.message ??
    null;
  const isMutating =
    createMonsterMutation.isPending || updateMonsterMutation.isPending || archiveMonsterMutation.isPending;

  const mapPayload = (values: MonsterFormValues) => ({
    alignment: toNullableString(values.alignment),
    armorClass: values.armorClass ?? null,
    challengeRating: toNullableString(values.challengeRating),
    description: toNullableString(values.description),
    hitPoints: values.hitPoints ?? null,
    name: values.name.trim(),
    size: values.size ?? null,
    type: toNullableString(values.type),
    visibility: values.visibility,
  });

  return (
    <>
      <Stack spacing={3.5}>
        <PageHeader
          action={
            canManage ? (
              <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
                <Button onClick={() => navigate(appPaths.monsters)} variant="outlined">
                  Open Open5e catalog
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(true)} variant="contained">
                  Create custom monster
                </Button>
              </Stack>
            ) : undefined
          }
          description="Maintain the campaign bestiary, reuse imported statblocks, and keep homebrew creatures close to the session workflow."
          title="Monsters"
        />

        {mutationError ? <Alert severity="error">{mutationError}</Alert> : null}

        <SectionCard>
          <Stack spacing={2.5}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Search monsters"
                onChange={(event) => setSearch(event.target.value)}
                value={search}
              />
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", whiteSpace: "nowrap" }}>
                <Switch checked={includeGlobal} onChange={(_event, checked) => setIncludeGlobal(checked)} />
                <span>Include global snapshots</span>
              </Stack>
            </Stack>

            <CampaignMonstersList
              canManageMonsters={canManage}
              isSubmitting={isMutating}
              monsters={monstersQuery.data ?? []}
              onArchiveMonster={(monsterId) => archiveMonsterMutation.mutate(monsterId)}
              onEditMonster={(monsterId) => setEditingMonsterId(monsterId)}
              onOpenDetails={(monsterId) => setSelectedMonsterId(monsterId)}
            />
          </Stack>
        </SectionCard>
      </Stack>

      <MonsterFormDialog
        isSubmitting={createMonsterMutation.isPending}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={async (values) => {
          await createMonsterMutation.mutateAsync(mapPayload(values));
          setIsCreateDialogOpen(false);
        }}
        open={isCreateDialogOpen}
      />

      <MonsterFormDialog
        initialMonster={editingMonsterId ? monsterDetailsQuery.data ?? null : null}
        isSubmitting={updateMonsterMutation.isPending || monsterDetailsQuery.isLoading}
        onClose={() => setEditingMonsterId(null)}
        onSubmit={async (values) => {
          if (!editingMonsterId) {
            return;
          }

          await updateMonsterMutation.mutateAsync({
            monsterId: editingMonsterId,
            payload: mapPayload(values),
          });
          setEditingMonsterId(null);
        }}
        open={Boolean(editingMonsterId)}
      />

      <MonsterDetailsDialog
        monster={selectedMonsterId ? monsterDetailsQuery.data ?? null : null}
        onClose={() => setSelectedMonsterId(null)}
        open={Boolean(selectedMonsterId)}
      />
    </>
  );
}
