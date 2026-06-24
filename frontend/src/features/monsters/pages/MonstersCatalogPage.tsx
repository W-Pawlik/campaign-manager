import { Alert, Button, Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useAppSelector } from "@/app/store/hooks";
import { useUserCampaignsQuery } from "@/features/campaigns";
import {
  useCopyOpen5eCreatureToCampaignMutation,
  useCopyPublishedMonsterToCampaignMutation,
  useCreatePublishedMonsterMutation,
  useOpen5eCatalogQuery,
  useOpen5eCreatureDetailsQuery,
  usePublishedMonsterDetailsQuery,
  usePublishedMonstersCatalogQuery,
} from "@/features/monsters/api/monstersQueries";
import type {
  CreatePublishedMonsterPayload,
  Open5eCatalogFilters,
  PublishedMonsterCatalogFilters,
} from "@/features/monsters/model/monster.types";
import { MonsterDetailsDialog } from "@/features/monsters/ui/MonsterDetailsDialog";
import { MonsterCatalogFilters } from "@/features/monsters/ui/MonsterCatalogFilters";
import { MonsterCatalogList } from "@/features/monsters/ui/MonsterCatalogList";
import type { MonsterCatalogSource } from "@/features/monsters/ui/MonsterCatalogSourceTabs";
import { MonsterCatalogSourceTabs } from "@/features/monsters/ui/MonsterCatalogSourceTabs";
import { MonsterFormDialog, type MonsterFormValues } from "@/features/monsters/ui/MonsterFormDialog";
import { MonsterImportDialog } from "@/features/monsters/ui/MonsterImportDialog";
import { Open5eResourceDetailsDialog } from "@/features/monsters/ui/Open5eResourceDetailsDialog";
import { ErrorState, LoadingScreen, PageHeader, SectionCard } from "@/shared/components";

const CATALOG_PAGE_SIZE = 20;

type ImportSelection =
  | {
      key: string;
      monsterId?: never;
      name: string;
      source: "open5e";
      sourceLabel: string;
    }
  | {
      key?: never;
      monsterId: string;
      name: string;
      source: "community";
      sourceLabel: string;
    };

function parseCatalogSource(value: string | null): MonsterCatalogSource {
  return value === "community" ? "community" : "open5e";
}

function parseOptionalNumber(value: string | null): number | undefined {
  if (value === null || value.trim().length === 0) {
    return undefined;
  }

  const parsedValue = Number(value);

  return Number.isNaN(parsedValue) ? undefined : parsedValue;
}

function trimOrUndefined(value: string | null): string | undefined {
  if (value === null) {
    return undefined;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length === 0 ? undefined : trimmedValue;
}

function toNullableString(value?: string): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length === 0 ? null : trimmed;
}

function mapPublishedMonsterPayload(values: MonsterFormValues): CreatePublishedMonsterPayload {
  return {
    alignment: toNullableString(values.alignment),
    armorClass: values.armorClass ?? null,
    challengeRating: toNullableString(values.challengeRating),
    description: toNullableString(values.description),
    hitPoints: values.hitPoints ?? null,
    name: values.name.trim(),
    size: values.size ?? null,
    type: toNullableString(values.type),
  };
}

export function MonstersCatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSource = parseCatalogSource(searchParams.get("source"));
  const lastActiveCampaignId = useAppSelector((state) => state.workspace.lastActiveCampaignId);
  const campaignsQuery = useUserCampaignsQuery();
  const [selectedOpen5eKey, setSelectedOpen5eKey] = useState<string | null>(null);
  const [selectedPublishedMonsterId, setSelectedPublishedMonsterId] = useState<string | null>(null);
  const [importSelection, setImportSelection] = useState<ImportSelection | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filterValues = {
    documentKey: searchParams.get("documentKey") ?? "",
    maxCr: searchParams.get("maxCr") ?? "",
    minCr: searchParams.get("minCr") ?? "",
    ordering: searchParams.get("ordering") ?? "name",
    search: searchParams.get("search") ?? "",
    type: searchParams.get("type") ?? "",
  };

  const open5eFilters = useMemo<Open5eCatalogFilters>(
    () => ({
      documentKey: trimOrUndefined(searchParams.get("documentKey")),
      limit: CATALOG_PAGE_SIZE,
      maxCr: parseOptionalNumber(searchParams.get("maxCr")),
      minCr: parseOptionalNumber(searchParams.get("minCr")),
      ordering:
        (trimOrUndefined(searchParams.get("ordering")) as Open5eCatalogFilters["ordering"]) ??
        "name",
      search: trimOrUndefined(searchParams.get("search")),
      type: trimOrUndefined(searchParams.get("type")),
    }),
    [searchParams],
  );

  const publishedFilters = useMemo<PublishedMonsterCatalogFilters>(
    () => ({
      limit: CATALOG_PAGE_SIZE,
      maxCr: parseOptionalNumber(searchParams.get("maxCr")),
      minCr: parseOptionalNumber(searchParams.get("minCr")),
      search: trimOrUndefined(searchParams.get("search")),
      type: trimOrUndefined(searchParams.get("type")),
    }),
    [searchParams],
  );

  const open5eCatalogQuery = useOpen5eCatalogQuery(open5eFilters, activeSource === "open5e");
  const publishedCatalogQuery = usePublishedMonstersCatalogQuery(
    publishedFilters,
    activeSource === "community",
  );
  const open5eDetailsQuery = useOpen5eCreatureDetailsQuery(selectedOpen5eKey);
  const publishedMonsterDetailsQuery = usePublishedMonsterDetailsQuery(selectedPublishedMonsterId);
  const copyOpen5eMutation = useCopyOpen5eCreatureToCampaignMutation();
  const copyPublishedMutation = useCopyPublishedMonsterToCampaignMutation();
  const createPublishedMonsterMutation = useCreatePublishedMonsterMutation();

  if (campaignsQuery.isLoading) {
    return <LoadingScreen minHeight="60vh" />;
  }

  const activeCatalogQuery =
    activeSource === "open5e" ? open5eCatalogQuery : publishedCatalogQuery;

  if (campaignsQuery.isError || activeCatalogQuery.isError) {
    return (
      <ErrorState
        message={
          campaignsQuery.error?.message ??
          activeCatalogQuery.error?.message ??
          "The monster catalog could not be loaded right now."
        }
        onRetry={() => {
          void campaignsQuery.refetch();
          void activeCatalogQuery.refetch();
        }}
        title="Unable to load catalog"
      />
    );
  }

  const activeImportCampaignId = lastActiveCampaignId ?? campaignsQuery.data?.[0]?.id ?? null;
  const canAddToCampaign = (campaignsQuery.data?.length ?? 0) > 0;
  const open5eItems = open5eCatalogQuery.data?.pages.flatMap((page) => page.items) ?? [];
  const publishedItems = publishedCatalogQuery.data?.pages.flatMap((page) => page.items) ?? [];
  const mutationError =
    copyOpen5eMutation.error?.message ??
    copyPublishedMutation.error?.message ??
    createPublishedMonsterMutation.error?.message ??
    null;

  const totalCount =
    activeSource === "open5e"
      ? open5eCatalogQuery.data?.pages[0]?.total ?? 0
      : publishedCatalogQuery.data?.pages[0]?.total ?? 0;

  return (
    <>
      <Stack spacing={3.5}>
        <PageHeader
          action={
            activeSource === "community" ? (
              <Button onClick={() => setIsCreateDialogOpen(true)} variant="contained">
                Publish monster
              </Button>
            ) : undefined
          }
          description="Browse creature cards, open a larger statblock view on click, and copy the best fits into your campaign bestiary."
          title="Monsters"
        />

        {mutationError ? <Alert severity="error">{mutationError}</Alert> : null}
        {!canAddToCampaign ? (
          <Alert severity="info">
            You can browse the catalog already. Join or create a campaign first to add monsters to
            a bestiary.
          </Alert>
        ) : null}

        <SectionCard>
          <Stack spacing={2.5}>
            <MonsterCatalogSourceTabs
              activeSource={activeSource}
              onChange={(source) => {
                const nextParams = new URLSearchParams(searchParams);
                nextParams.set("source", source);

                if (source === "community") {
                  nextParams.delete("documentKey");
                  nextParams.delete("ordering");
                } else if (!nextParams.get("ordering")) {
                  nextParams.set("ordering", "name");
                }

                setSearchParams(nextParams);
              }}
            />

            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={1.5}
              sx={{ justifyContent: "space-between" }}
            >
              <Stack spacing={0.5}>
                <Typography variant="h6">
                  {activeSource === "open5e" ? "Open5e creature catalog" : "Community monster catalog"}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  {activeSource === "open5e"
                    ? "Search across Open5e creatures with source-book and CR filters, then open any card for the full statblock and artwork."
                    : "Browse public homebrew monsters created by other users and publish your own statblocks for reuse."}
                </Typography>
              </Stack>
              <Typography color="text.secondary" variant="body2">
                {totalCount} monsters found
              </Typography>
            </Stack>

            <MonsterCatalogFilters
              key={`${activeSource}-${JSON.stringify(filterValues)}`}
              onApply={(values) => {
                const nextParams = new URLSearchParams();
                nextParams.set("source", activeSource);

                if (values.search.trim().length > 0) {
                  nextParams.set("search", values.search.trim());
                }

                if (values.type.trim().length > 0) {
                  nextParams.set("type", values.type.trim());
                }

                if (values.minCr.trim().length > 0) {
                  nextParams.set("minCr", values.minCr.trim());
                }

                if (values.maxCr.trim().length > 0) {
                  nextParams.set("maxCr", values.maxCr.trim());
                }

                if (activeSource === "open5e") {
                  if (values.documentKey.trim().length > 0) {
                    nextParams.set("documentKey", values.documentKey.trim());
                  }

                  if (values.ordering.trim().length > 0) {
                    nextParams.set("ordering", values.ordering.trim());
                  }
                }

                setSearchParams(nextParams);
              }}
              onReset={() => {
                const nextParams = new URLSearchParams();
                nextParams.set("source", activeSource);

                if (activeSource === "open5e") {
                  nextParams.set("ordering", "name");
                }

                setSearchParams(nextParams);
              }}
              source={activeSource}
              values={filterValues}
            />

            {activeCatalogQuery.isLoading ? (
              <LoadingScreen minHeight="30vh" />
            ) : (
              <MonsterCatalogList
                canAddToCampaign={canAddToCampaign}
                hasNextPage={Boolean(activeCatalogQuery.hasNextPage)}
                isFetchingNextPage={activeCatalogQuery.isFetchingNextPage}
                items={activeSource === "open5e" ? open5eItems : publishedItems}
                onAddToCampaign={(item) => {
                  if ("key" in item) {
                    setImportSelection({
                      key: item.key,
                      name: item.name,
                      source: "open5e",
                      sourceLabel: "Open5e catalog",
                    });

                    return;
                  }

                  setImportSelection({
                    monsterId: item.id,
                    name: item.name,
                    source: "community",
                    sourceLabel: "community catalog",
                  });
                }}
                onLoadMore={() => void activeCatalogQuery.fetchNextPage()}
                onOpenDetails={(item) => {
                  if ("key" in item) {
                    setSelectedOpen5eKey(item.key);

                    return;
                  }

                  setSelectedPublishedMonsterId(item.id);
                }}
                source={activeSource}
              />
            )}
          </Stack>
        </SectionCard>
      </Stack>

      <Open5eResourceDetailsDialog
        onClose={() => setSelectedOpen5eKey(null)}
        onImport={
          selectedOpen5eKey && canAddToCampaign
            ? () =>
                setImportSelection({
                  key: selectedOpen5eKey,
                  name: open5eDetailsQuery.data?.name ?? "Open5e creature",
                  source: "open5e",
                  sourceLabel: "Open5e catalog",
                })
            : undefined
        }
        open={Boolean(selectedOpen5eKey)}
        resource={selectedOpen5eKey ? open5eDetailsQuery.data ?? null : null}
      />

      <MonsterDetailsDialog
        monster={selectedPublishedMonsterId ? publishedMonsterDetailsQuery.data ?? null : null}
        onClose={() => setSelectedPublishedMonsterId(null)}
        open={Boolean(selectedPublishedMonsterId)}
      />

      <MonsterImportDialog
        campaigns={campaignsQuery.data ?? []}
        defaultCampaignId={activeImportCampaignId}
        isSubmitting={copyOpen5eMutation.isPending || copyPublishedMutation.isPending}
        monsterName={importSelection?.name ?? null}
        onClose={() => setImportSelection(null)}
        onSubmit={async (values) => {
          if (!importSelection) {
            return;
          }

          if (importSelection.source === "open5e") {
            await copyOpen5eMutation.mutateAsync({
              key: importSelection.key,
              payload: {
                campaignId: values.campaignId,
                nameOverride: values.nameOverride?.trim() || undefined,
              },
            });
          } else {
            await copyPublishedMutation.mutateAsync({
              monsterId: importSelection.monsterId,
              payload: {
                campaignId: values.campaignId,
                nameOverride: values.nameOverride?.trim() || undefined,
              },
            });
          }

          setImportSelection(null);
        }}
        open={Boolean(importSelection)}
        sourceLabel={importSelection?.sourceLabel}
      />

      <MonsterFormDialog
        defaultVisibility="PUBLIC"
        hideVisibilityField={true}
        isSubmitting={createPublishedMonsterMutation.isPending}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={async (values) => {
          await createPublishedMonsterMutation.mutateAsync(mapPublishedMonsterPayload(values));
          setIsCreateDialogOpen(false);
        }}
        open={isCreateDialogOpen}
        submitLabel="Publish monster"
        title="Publish community monster"
      />
    </>
  );
}
