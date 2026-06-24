import { Alert, Button, Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { appPaths } from "@/app/router/paths";
import { useAppSelector } from "@/app/store/hooks";
import { useUserCampaignsQuery } from "@/features/campaigns";
import {
  useCopyOpen5eGeneralItemToCampaignMutation,
  useCopyOpen5eMagicItemToCampaignMutation,
  useCopyPublishedItemToCampaignMutation,
  useCreatePublishedItemMutation,
  useOpen5eGeneralItemDetailsQuery,
  useOpen5eGeneralItemsCatalogQuery,
  useOpen5eMagicItemDetailsQuery,
  useOpen5eMagicItemsCatalogQuery,
  usePublishedItemDetailsQuery,
  usePublishedItemsCatalogQuery,
  useUpdatePublishedItemMutation,
} from "@/features/items/api/itemsQueries";
import type {
  CreatePublishedItemPayload,
  ItemsCatalogTab,
  Open5eItemCatalogFilters,
  PublishedItemsCatalogFilters,
} from "@/features/items/model/item.types";
import { ItemCatalogDetailsDialog } from "@/features/items/ui/ItemCatalogDetailsDialog";
import {
  ItemCatalogFilters,
  type ItemCatalogFiltersValues,
} from "@/features/items/ui/ItemCatalogFilters";
import {
  ItemCatalogFormDialog,
  type ItemCatalogFormValues,
} from "@/features/items/ui/ItemCatalogFormDialog";
import {
  ItemCatalogImportDialog,
  type ItemCatalogImportValues,
} from "@/features/items/ui/ItemCatalogImportDialog";
import { ItemCatalogList } from "@/features/items/ui/ItemCatalogList";
import { ItemsCatalogTabs } from "@/features/items/ui/ItemsCatalogTabs";
import type {
  ItemCatalogDetailsEntry,
  ItemCatalogListEntry,
} from "@/features/items/ui/itemCatalog.utils";
import { isOpen5eCatalogItem } from "@/features/items/ui/itemCatalog.utils";
import { ErrorState, LoadingScreen, PageHeader, SectionCard } from "@/shared/components";

const CATALOG_PAGE_SIZE = 18;

type ImportSelection =
  | {
      key: string;
      itemTemplateId?: never;
      name: string;
      source: "general" | "magic";
      sourceLabel: string;
    }
  | {
      key?: never;
      itemTemplateId: string;
      name: string;
      source: "community";
      sourceLabel: string;
    };

function parseCatalogTab(value: string | null): ItemsCatalogTab {
  if (value === "magic" || value === "community") {
    return value;
  }

  return "general";
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

function mapPublishedItemPayload(values: ItemCatalogFormValues): CreatePublishedItemPayload {
  return {
    description: toNullableString(values.description),
    isMagical: values.isMagical,
    name: values.name.trim(),
    rarity: values.rarity || null,
    type: values.type,
    valueAmount: values.valueAmount ?? null,
    valueCurrency: toNullableString(values.valueCurrency),
    weight: values.weight ?? null,
  };
}

export function ItemsCatalogPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = parseCatalogTab(searchParams.get("tab"));
  const lastActiveCampaignId = useAppSelector((state) => state.workspace.lastActiveCampaignId);
  const currentUserId = useAppSelector((state) => state.auth.currentUser?.id ?? null);
  const campaignsQuery = useUserCampaignsQuery();
  const [selectedOpen5eGeneralKey, setSelectedOpen5eGeneralKey] = useState<string | null>(null);
  const [selectedOpen5eMagicKey, setSelectedOpen5eMagicKey] = useState<string | null>(null);
  const [selectedPublishedItemId, setSelectedPublishedItemId] = useState<string | null>(null);
  const [importSelection, setImportSelection] = useState<ImportSelection | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPublishedItemId, setEditingPublishedItemId] = useState<string | null>(null);

  const filterValues = {
    documentKey: searchParams.get("documentKey") ?? "",
    isMagicalOnly: searchParams.get("isMagical") === "true",
    ordering: searchParams.get("ordering") ?? "name",
    rarity: (searchParams.get("rarity") as ItemCatalogFiltersValues["rarity"] | null) ?? "",
    search: searchParams.get("search") ?? "",
    type: (searchParams.get("type") as ItemCatalogFiltersValues["type"] | null) ?? "",
  };

  const open5eFilters = useMemo<Open5eItemCatalogFilters>(
    () => ({
      documentKey: trimOrUndefined(searchParams.get("documentKey")),
      limit: CATALOG_PAGE_SIZE,
      ordering: (trimOrUndefined(searchParams.get("ordering")) as Open5eItemCatalogFilters["ordering"]) ?? "name",
      search: trimOrUndefined(searchParams.get("search")),
    }),
    [searchParams],
  );

  const publishedFilters = useMemo<PublishedItemsCatalogFilters>(
    () => ({
      isMagical: activeTab === "magic" ? true : undefined,
      ...(activeTab === "community" && searchParams.get("isMagical") === "true" ? { isMagical: true } : {}),
      limit: CATALOG_PAGE_SIZE,
      rarity: (trimOrUndefined(searchParams.get("rarity")) as PublishedItemsCatalogFilters["rarity"]) ?? undefined,
      search: trimOrUndefined(searchParams.get("search")),
      type: (trimOrUndefined(searchParams.get("type")) as PublishedItemsCatalogFilters["type"]) ?? undefined,
    }),
    [activeTab, searchParams],
  );

  const open5eGeneralCatalogQuery = useOpen5eGeneralItemsCatalogQuery(open5eFilters, activeTab === "general");
  const open5eMagicCatalogQuery = useOpen5eMagicItemsCatalogQuery(open5eFilters, activeTab === "magic");
  const publishedCatalogQuery = usePublishedItemsCatalogQuery(publishedFilters, activeTab === "community");
  const open5eGeneralDetailsQuery = useOpen5eGeneralItemDetailsQuery(selectedOpen5eGeneralKey);
  const open5eMagicDetailsQuery = useOpen5eMagicItemDetailsQuery(selectedOpen5eMagicKey);
  const publishedItemDetailsQuery = usePublishedItemDetailsQuery(
    selectedPublishedItemId ?? editingPublishedItemId,
  );
  const createPublishedItemMutation = useCreatePublishedItemMutation();
  const updatePublishedItemMutation = useUpdatePublishedItemMutation();
  const copyOpen5eGeneralMutation = useCopyOpen5eGeneralItemToCampaignMutation();
  const copyOpen5eMagicMutation = useCopyOpen5eMagicItemToCampaignMutation();
  const copyPublishedItemMutation = useCopyPublishedItemToCampaignMutation();

  if (campaignsQuery.isLoading) {
    return <LoadingScreen minHeight="60vh" />;
  }

  const activeCatalogQuery =
    activeTab === "general"
      ? open5eGeneralCatalogQuery
      : activeTab === "magic"
        ? open5eMagicCatalogQuery
        : publishedCatalogQuery;

  if (campaignsQuery.isError || activeCatalogQuery.isError) {
    return (
      <ErrorState
        message={
          campaignsQuery.error?.message ??
          activeCatalogQuery.error?.message ??
          "The item catalog could not be loaded right now."
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
  const generalItems = open5eGeneralCatalogQuery.data?.pages.flatMap((page) => page.items) ?? [];
  const magicItems = open5eMagicCatalogQuery.data?.pages.flatMap((page) => page.items) ?? [];
  const publishedItems = publishedCatalogQuery.data?.pages.flatMap((page) => page.items) ?? [];
  const totalCount =
    activeTab === "general"
      ? open5eGeneralCatalogQuery.data?.pages[0]?.total ?? 0
      : activeTab === "magic"
        ? open5eMagicCatalogQuery.data?.pages[0]?.total ?? 0
        : publishedCatalogQuery.data?.pages[0]?.total ?? 0;
  const selectedItem: ItemCatalogDetailsEntry | null =
    selectedOpen5eGeneralKey
      ? open5eGeneralDetailsQuery.data ?? null
      : selectedOpen5eMagicKey
        ? open5eMagicDetailsQuery.data ?? null
        : selectedPublishedItemId
          ? publishedItemDetailsQuery.data ?? null
          : null;
  const editablePublishedItem = editingPublishedItemId ? publishedItemDetailsQuery.data ?? null : null;
  const selectedItemIsLoading =
    (selectedOpen5eGeneralKey !== null && open5eGeneralDetailsQuery.isLoading) ||
    (selectedOpen5eMagicKey !== null && open5eMagicDetailsQuery.isLoading) ||
    (selectedPublishedItemId !== null && publishedItemDetailsQuery.isLoading);
  const selectedItemErrorMessage =
    (selectedOpen5eGeneralKey !== null && open5eGeneralDetailsQuery.error?.message) ||
    (selectedOpen5eMagicKey !== null && open5eMagicDetailsQuery.error?.message) ||
    (selectedPublishedItemId !== null && publishedItemDetailsQuery.error?.message) ||
    null;
  const canEditSelectedPublishedItem =
    Boolean(
      selectedPublishedItemId &&
        selectedItem &&
        "createdById" in selectedItem &&
        selectedItem.createdById === currentUserId,
    );

  const mutationError =
    createPublishedItemMutation.error?.message ??
    updatePublishedItemMutation.error?.message ??
    copyOpen5eGeneralMutation.error?.message ??
    copyOpen5eMagicMutation.error?.message ??
    copyPublishedItemMutation.error?.message ??
    null;

  return (
    <>
      <Stack spacing={3.5}>
        <PageHeader
          action={
            activeTab === "community" ? (
              <Button onClick={() => setIsCreateDialogOpen(true)} variant="contained">
                Publish item
              </Button>
            ) : undefined
          }
          description="Browse Open5e gear, inspect magic loot, and publish reusable community items for your campaigns."
          title="Items"
        />

        {mutationError ? <Alert severity="error">{mutationError}</Alert> : null}
        {!canAddToCampaign ? (
          <Alert severity="info">
            You can browse the catalog already. Join or create a campaign first to add items to a stash.
          </Alert>
        ) : null}

        <SectionCard>
          <Stack spacing={2.5}>
            <ItemsCatalogTabs
              activeTab={activeTab}
              onChange={(tab) => {
                const nextParams = new URLSearchParams();
                nextParams.set("tab", tab);
                if (tab !== "community") {
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
                  {activeTab === "general"
                    ? "Open5e general items"
                    : activeTab === "magic"
                      ? "Open5e magic items"
                      : "Community item catalog"}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  {activeTab === "community"
                    ? "Browse public items created by players and publish your own reusable gear."
                    : activeTab === "magic"
                      ? "Search enchanted loot and magical relics, then move the best finds into a campaign stash."
                      : "Browse practical equipment, consumables, and adventure gear from Open5e."}
                </Typography>
              </Stack>
              <Typography color="text.secondary" variant="body2">
                {totalCount} items found
              </Typography>
            </Stack>

            <ItemCatalogFilters
              key={JSON.stringify({
                activeTab,
                documentKey: filterValues.documentKey,
                isMagicalOnly: filterValues.isMagicalOnly,
                ordering: filterValues.ordering,
                rarity: filterValues.rarity,
                search: filterValues.search,
                type: filterValues.type,
              })}
              onApply={(values) => {
                const nextParams = new URLSearchParams();
                nextParams.set("tab", activeTab);

                if (values.search.trim().length > 0) {
                  nextParams.set("search", values.search.trim());
                }

                if (activeTab === "community") {
                  if (values.type) {
                    nextParams.set("type", values.type);
                  }

                  if (values.rarity) {
                    nextParams.set("rarity", values.rarity);
                  }

                  if (values.isMagicalOnly) {
                    nextParams.set("isMagical", "true");
                  }
                } else {
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
                nextParams.set("tab", activeTab);
                if (activeTab !== "community") {
                  nextParams.set("ordering", "name");
                }
                setSearchParams(nextParams);
              }}
              tab={activeTab}
              values={filterValues}
            />

            {activeCatalogQuery.isLoading ? (
              <LoadingScreen minHeight="30vh" />
            ) : (
              <ItemCatalogList
                canAddToCampaign={canAddToCampaign}
                hasNextPage={Boolean(activeCatalogQuery.hasNextPage)}
                isFetchingNextPage={activeCatalogQuery.isFetchingNextPage}
                items={activeTab === "general" ? generalItems : activeTab === "magic" ? magicItems : publishedItems}
                onAddToCampaign={(item: ItemCatalogListEntry) => {
                  if (isOpen5eCatalogItem(item)) {
                    setImportSelection({
                      key: item.key,
                      name: item.name,
                      source: activeTab === "magic" ? "magic" : "general",
                      sourceLabel: activeTab === "magic" ? "Open5e magic items" : "Open5e items",
                    });
                    return;
                  }

                  setImportSelection({
                    itemTemplateId: item.id,
                    name: item.name,
                    source: "community",
                    sourceLabel: "community catalog",
                  });
                }}
                onLoadMore={() => void activeCatalogQuery.fetchNextPage()}
                onOpenDetails={(item: ItemCatalogListEntry) => {
                  if (isOpen5eCatalogItem(item)) {
                    if (activeTab === "magic") {
                      setSelectedOpen5eMagicKey(item.key);
                    } else {
                      setSelectedOpen5eGeneralKey(item.key);
                    }
                    return;
                  }

                  setSelectedPublishedItemId(item.id);
                }}
                tab={activeTab}
              />
            )}
          </Stack>
        </SectionCard>
      </Stack>

      <ItemCatalogDetailsDialog
        canEdit={canEditSelectedPublishedItem}
        errorMessage={selectedItemErrorMessage}
        isLoading={selectedItemIsLoading}
        item={selectedItem}
        onAddToCampaign={
          canAddToCampaign && selectedItem
            ? () =>
                setImportSelection(
                  "provider" in selectedItem
                    ? {
                        key: selectedItem.key ?? "",
                        name: selectedItem.name,
                        source: selectedItem.resourceType === "MAGIC_ITEM" ? "magic" : "general",
                        sourceLabel:
                          selectedItem.resourceType === "MAGIC_ITEM"
                            ? "Open5e magic items"
                            : "Open5e items",
                      }
                    : {
                        itemTemplateId: selectedItem.id,
                        name: selectedItem.name,
                        source: "community",
                        sourceLabel: "community catalog",
                      },
                )
            : undefined
        }
        onClose={() => {
          setSelectedOpen5eGeneralKey(null);
          setSelectedOpen5eMagicKey(null);
          setSelectedPublishedItemId(null);
        }}
        onEdit={
          canEditSelectedPublishedItem
            ? () => {
                setEditingPublishedItemId(selectedPublishedItemId);
                setSelectedPublishedItemId(null);
              }
            : undefined
        }
        open={Boolean(selectedOpen5eGeneralKey || selectedOpen5eMagicKey || selectedPublishedItemId)}
      />

      <ItemCatalogImportDialog
        campaigns={campaignsQuery.data ?? []}
        defaultCampaignId={activeImportCampaignId}
        isSubmitting={
          copyOpen5eGeneralMutation.isPending ||
          copyOpen5eMagicMutation.isPending ||
          copyPublishedItemMutation.isPending
        }
        itemName={importSelection?.name ?? null}
        onClose={() => setImportSelection(null)}
        onSubmit={async (values: ItemCatalogImportValues) => {
          const payload = {
            campaignId: values.campaignId,
            nameOverride: values.nameOverride?.trim() || undefined,
            ownerId: values.campaignId,
            ownerType: "CAMPAIGN_PARTY" as const,
            quantity: values.quantity,
            visibility: "PUBLIC" as const,
          };

          if (!importSelection) {
            return;
          }

          if (importSelection.source === "general") {
            await copyOpen5eGeneralMutation.mutateAsync({
              key: importSelection.key,
              payload,
            });
          } else if (importSelection.source === "magic") {
            await copyOpen5eMagicMutation.mutateAsync({
              key: importSelection.key,
              payload,
            });
          } else {
            await copyPublishedItemMutation.mutateAsync({
              itemTemplateId: importSelection.itemTemplateId!,
              payload,
            });
          }

          setImportSelection(null);
          navigate(appPaths.campaignInventory(values.campaignId));
        }}
        open={Boolean(importSelection)}
        sourceLabel={importSelection?.sourceLabel}
      />

      <ItemCatalogFormDialog
        isSubmitting={createPublishedItemMutation.isPending}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={async (values) => {
          await createPublishedItemMutation.mutateAsync(mapPublishedItemPayload(values));
          setIsCreateDialogOpen(false);
        }}
        open={isCreateDialogOpen}
      />

      <ItemCatalogFormDialog
        initialItem={editablePublishedItem}
        isSubmitting={updatePublishedItemMutation.isPending || publishedItemDetailsQuery.isLoading}
        onClose={() => setEditingPublishedItemId(null)}
        onSubmit={async (values) => {
          if (!editingPublishedItemId) {
            return;
          }

          await updatePublishedItemMutation.mutateAsync({
            itemTemplateId: editingPublishedItemId,
            payload: mapPublishedItemPayload(values),
          });
          setEditingPublishedItemId(null);
        }}
        open={Boolean(editingPublishedItemId)}
      />
    </>
  );
}
