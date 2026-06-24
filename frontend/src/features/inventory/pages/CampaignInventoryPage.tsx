import { Alert, Button, Chip, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { Link as RouterLink, useParams, useSearchParams } from "react-router-dom";

import { appPaths } from "@/app/router/paths";
import { useAppSelector } from "@/app/store/hooks";
import type { CampaignCharacterListItem } from "@/features/campaigns";
import {
  useCampaignCharactersQuery,
  useCampaignDetailsQuery,
  useCampaignLocationsQuery,
  useCampaignNpcsQuery,
  useCampaignQuestsQuery,
  useCampaignSessionsQuery,
} from "@/features/campaigns";
import {
  useCampaignInventoryItemsQuery,
  useCreateInventoryItemMutation,
  useDeleteInventoryItemMutation,
  useInventoryItemDetailsQuery,
  useMyInventoryItemsQuery,
  useTransferInventoryItemMutation,
  useUpdateInventoryItemMutation,
} from "@/features/inventory/api/inventoryQueries";
import { CampaignInventoryList } from "@/features/inventory/ui/CampaignInventoryList";
import { InventoryDetailsDialog } from "@/features/inventory/ui/InventoryDetailsDialog";
import { InventoryFormDialog } from "@/features/inventory/ui/InventoryFormDialog";
import { InventoryTransferDialog } from "@/features/inventory/ui/InventoryTransferDialog";
import type { InventoryOwnerType } from "@/features/inventory/model/inventory.types";
import { ErrorState, LoadingScreen, PageHeader, SectionCard } from "@/shared/components";

function canManageAllInventory(role: string | undefined): boolean {
  return role === "OWNER" || role === "GM" || role === "CO_GM";
}

function toNullableString(value?: string): string | null {
  if (value === undefined) {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length === 0 ? null : trimmed;
}

function managerOwnerTypes(): InventoryOwnerType[] {
  return ["CHARACTER", "CAMPAIGN_PARTY", "NPC", "LOCATION", "QUEST", "SESSION"];
}

type OwnerOption = {
  id: string;
  label: string;
};

export function CampaignInventoryPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentUserId = useAppSelector((state) => state.auth.currentUser?.id ?? null);
  const activeView = searchParams.get("view") === "mine" ? "mine" : "all";
  const campaignDetailsQuery = useCampaignDetailsQuery(campaignId);
  const inventoryQuery = useCampaignInventoryItemsQuery(campaignId);
  const myInventoryQuery = useMyInventoryItemsQuery(campaignId);
  const charactersQuery = useCampaignCharactersQuery(campaignId);
  const npcsQuery = useCampaignNpcsQuery(campaignId);
  const locationsQuery = useCampaignLocationsQuery(campaignId);
  const questsQuery = useCampaignQuestsQuery(campaignId);
  const sessionsQuery = useCampaignSessionsQuery(campaignId);
  const createInventoryItemMutation = useCreateInventoryItemMutation(campaignId);
  const updateInventoryItemMutation = useUpdateInventoryItemMutation(campaignId);
  const deleteInventoryItemMutation = useDeleteInventoryItemMutation(campaignId);
  const transferInventoryItemMutation = useTransferInventoryItemMutation(campaignId);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [transferringItemId, setTransferringItemId] = useState<string | null>(null);
  const itemDetailsQuery = useInventoryItemDetailsQuery(campaignId, selectedItemId ?? editingItemId ?? transferringItemId);

  const pageError = useMemo(() => {
    if (campaignDetailsQuery.isError) {
      return campaignDetailsQuery.error.message;
    }

    if (inventoryQuery.isError) {
      return inventoryQuery.error.message;
    }

    if (myInventoryQuery.isError) {
      return myInventoryQuery.error.message;
    }

    return null;
  }, [
    campaignDetailsQuery.error,
    campaignDetailsQuery.isError,
    inventoryQuery.error,
    inventoryQuery.isError,
    myInventoryQuery.error,
    myInventoryQuery.isError,
  ]);

  if (
    campaignDetailsQuery.isLoading ||
    inventoryQuery.isLoading ||
    myInventoryQuery.isLoading ||
    charactersQuery.isLoading ||
    npcsQuery.isLoading ||
    locationsQuery.isLoading ||
    questsQuery.isLoading ||
    sessionsQuery.isLoading
  ) {
    return <LoadingScreen minHeight="60vh" />;
  }

  if (!campaignId || !campaignDetailsQuery.data || pageError) {
    return (
      <ErrorState
        message={pageError ?? "Inventory could not be loaded."}
        onRetry={() => {
          void campaignDetailsQuery.refetch();
          void inventoryQuery.refetch();
          void myInventoryQuery.refetch();
        }}
        title="Unable to load inventory"
      />
    );
  }

  const canManageAll = canManageAllInventory(campaignDetailsQuery.data.role);
  const ownedCharacters = (charactersQuery.data ?? []).filter(
    (character: CampaignCharacterListItem) => character.ownerUserId === currentUserId,
  );
  const ownedCharacterIds = ownedCharacters.map((character: CampaignCharacterListItem) => character.id);
  const availableOwnerTypes = canManageAll ? managerOwnerTypes() : (["CHARACTER"] as InventoryOwnerType[]);

  const getOwnerOptions = (ownerType: InventoryOwnerType): OwnerOption[] => {
    switch (ownerType) {
      case "CHARACTER":
        return (
          (canManageAll ? charactersQuery.data : ownedCharacters)?.map((item: CampaignCharacterListItem) => ({
            id: item.id,
            label: item.name,
          })) ?? []
        );
      case "CAMPAIGN_PARTY":
        return [{ id: campaignId, label: `${campaignDetailsQuery.data.name} party stash` }];
      case "NPC":
        return (npcsQuery.data ?? []).map((item) => ({ id: item.id, label: item.name }));
      case "LOCATION":
        return (locationsQuery.data ?? []).map((item) => ({ id: item.id, label: item.name }));
      case "QUEST":
        return (questsQuery.data ?? []).map((item) => ({ id: item.id, label: item.title }));
      case "SESSION":
        return (sessionsQuery.data ?? []).map((item) => ({ id: item.id, label: item.title }));
      default:
        return [];
    }
  };

  const getOwnerLabel = (ownerType: string, ownerId: string): string | null => {
    if (ownerType === "CAMPAIGN_PARTY") {
      return `${campaignDetailsQuery.data.name} party stash`;
    }

    return getOwnerOptions(ownerType as InventoryOwnerType).find((option) => option.id === ownerId)?.label ?? ownerId;
  };

  const getOwnerTypeLabel = (ownerType: string): string | null => {
    if (ownerType === "CAMPAIGN_PARTY") {
      return null;
    }

    return ownerType;
  };

  const isMutating =
    createInventoryItemMutation.isPending ||
    updateInventoryItemMutation.isPending ||
    deleteInventoryItemMutation.isPending ||
    transferInventoryItemMutation.isPending;
  const mutationError =
    createInventoryItemMutation.error?.message ??
    updateInventoryItemMutation.error?.message ??
    deleteInventoryItemMutation.error?.message ??
    transferInventoryItemMutation.error?.message ??
    null;
  const visibleItems = activeView === "mine" ? myInventoryQuery.data ?? [] : inventoryQuery.data ?? [];

  return (
    <>
      <Stack spacing={3.5}>
        <PageHeader
          action={
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
              <Button component={RouterLink} to={appPaths.items} variant="outlined">
                Open item catalog
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(true)} variant="contained">
                Create item
              </Button>
            </Stack>
          }
          description="Manage party stash loot, personal equipment, and world-linked items across characters, NPCs, quests, sessions, and locations."
          title="Items"
        />

        {mutationError ? <Alert severity="error">{mutationError}</Alert> : null}

        <SectionCard>
          <Stack spacing={2.5}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={1.5}
              sx={{ alignItems: { md: "center" }, justifyContent: "space-between" }}
            >
              <Stack spacing={0.5}>
                <Typography variant="h6">Campaign item management</Typography>
                <Typography color="text.secondary" variant="body2">
                  Keep the full campaign inventory organized, then switch to your own items when you want to manage only gear assigned to your characters.
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                <Chip label={`${inventoryQuery.data?.length ?? 0} total`} size="small" variant="outlined" />
                <Chip label={`${myInventoryQuery.data?.length ?? 0} yours`} size="small" variant="outlined" />
              </Stack>
            </Stack>

            <Tabs
              value={activeView}
              onChange={(_event, value: "all" | "mine") => {
                const nextParams = new URLSearchParams(searchParams);
                nextParams.set("view", value);
                setSearchParams(nextParams);
              }}
            >
              <Tab label="All campaign items" value="all" />
              <Tab label="Your items" value="mine" />
            </Tabs>

            <CampaignInventoryList
              campaignId={campaignId}
              canManageAllItems={canManageAll}
              getOwnerLabel={getOwnerLabel}
              getOwnerTypeLabel={getOwnerTypeLabel}
              isSubmitting={isMutating}
              items={visibleItems}
              onDeleteItem={(itemId) => deleteInventoryItemMutation.mutate(itemId)}
              onEditItem={(itemId) => setEditingItemId(itemId)}
              onOpenDetails={(itemId) => setSelectedItemId(itemId)}
              onTransferItem={(itemId) => setTransferringItemId(itemId)}
              ownedCharacterIds={ownedCharacterIds}
            />
          </Stack>
        </SectionCard>
      </Stack>

      <InventoryFormDialog
        availableOwnerTypes={availableOwnerTypes}
        getOwnerOptions={getOwnerOptions}
        isSubmitting={createInventoryItemMutation.isPending}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={async (values) => {
          await createInventoryItemMutation.mutateAsync({
            charges: values.charges ?? null,
            description: toNullableString(values.description),
            isMagical: values.isMagical,
            isAttuned: values.isAttuned,
            isEquipped: values.isEquipped,
            isIdentified: values.isIdentified,
            maxCharges: values.maxCharges ?? null,
            name: values.name.trim(),
            ownerId: values.ownerId,
            ownerType: values.ownerType,
            quantity: values.quantity,
            rarity: values.rarity || null,
            type: values.type,
            valueAmount: values.valueAmount ?? null,
            valueCurrency: toNullableString(values.valueCurrency),
            visibility: values.visibility,
            weight: values.weight ?? null,
          });
          setIsCreateDialogOpen(false);
        }}
        open={isCreateDialogOpen}
      />

      <InventoryFormDialog
        availableOwnerTypes={availableOwnerTypes}
        getOwnerOptions={getOwnerOptions}
        initialItem={editingItemId ? itemDetailsQuery.data ?? null : null}
        isSubmitting={updateInventoryItemMutation.isPending || itemDetailsQuery.isLoading}
        onClose={() => setEditingItemId(null)}
        onSubmit={async (values) => {
          if (!editingItemId) {
            return;
          }

          await updateInventoryItemMutation.mutateAsync({
            itemId: editingItemId,
            payload: {
              charges: values.charges ?? null,
              description: toNullableString(values.description),
              isMagical: values.isMagical,
              isAttuned: values.isAttuned,
              isIdentified: values.isIdentified,
              maxCharges: values.maxCharges ?? null,
              name: values.name.trim(),
              quantity: values.quantity,
              rarity: values.rarity || null,
              type: values.type,
              valueAmount: values.valueAmount ?? null,
              valueCurrency: toNullableString(values.valueCurrency),
              visibility: values.visibility,
              weight: values.weight ?? null,
            },
          });
          setEditingItemId(null);
        }}
        open={Boolean(editingItemId)}
      />

      <InventoryDetailsDialog
        campaignId={campaignId}
        item={selectedItemId ? itemDetailsQuery.data ?? null : null}
        onClose={() => setSelectedItemId(null)}
        open={Boolean(selectedItemId)}
        ownerLabel={
          selectedItemId && itemDetailsQuery.data
            ? getOwnerLabel(itemDetailsQuery.data.ownerType, itemDetailsQuery.data.ownerId)
            : null
        }
      />

      <InventoryTransferDialog
        availableOwnerTypes={availableOwnerTypes}
        getOwnerOptions={getOwnerOptions}
        isSubmitting={transferInventoryItemMutation.isPending}
        itemName={transferringItemId ? itemDetailsQuery.data?.name ?? null : null}
        onClose={() => setTransferringItemId(null)}
        onSubmit={async (values) => {
          if (!transferringItemId) {
            return;
          }

          await transferInventoryItemMutation.mutateAsync({
            itemId: transferringItemId,
            payload: {
              quantity: values.quantity ?? undefined,
              targetOwnerId: values.targetOwnerId,
              targetOwnerType: values.targetOwnerType,
            },
          });
          setTransferringItemId(null);
        }}
        open={Boolean(transferringItemId)}
      />
    </>
  );
}
