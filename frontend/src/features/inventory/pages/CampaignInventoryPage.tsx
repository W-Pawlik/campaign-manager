import { Alert, Button, Stack } from "@mui/material";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { useAppSelector } from "@/app/store/hooks";
import type { CampaignCharacterListItem } from "@/features/campaigns";
import {
  useCampaignCharactersQuery,
  useCampaignDetailsQuery,
  useCampaignLocationsQuery,
  useCampaignNpcsQuery,
  useCampaignQuestsQuery,
} from "@/features/campaigns";
import {
  useCampaignInventoryItemsQuery,
  useCreateInventoryItemMutation,
  useDeleteInventoryItemMutation,
  useInventoryItemDetailsQuery,
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
  return ["CHARACTER", "CAMPAIGN_PARTY", "NPC", "LOCATION", "QUEST"];
}

type OwnerOption = {
  id: string;
  label: string;
};

export function CampaignInventoryPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const currentUserId = useAppSelector((state) => state.auth.currentUser?.id ?? null);
  const campaignDetailsQuery = useCampaignDetailsQuery(campaignId);
  const inventoryQuery = useCampaignInventoryItemsQuery(campaignId);
  const charactersQuery = useCampaignCharactersQuery(campaignId);
  const npcsQuery = useCampaignNpcsQuery(campaignId);
  const locationsQuery = useCampaignLocationsQuery(campaignId);
  const questsQuery = useCampaignQuestsQuery(campaignId);
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

    return null;
  }, [campaignDetailsQuery.error, campaignDetailsQuery.isError, inventoryQuery.error, inventoryQuery.isError]);

  if (
    campaignDetailsQuery.isLoading ||
    inventoryQuery.isLoading ||
    charactersQuery.isLoading ||
    npcsQuery.isLoading ||
    locationsQuery.isLoading ||
    questsQuery.isLoading
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

  return (
    <>
      <Stack spacing={3.5}>
        <PageHeader
          action={
            <Button onClick={() => setIsCreateDialogOpen(true)} variant="contained">
              Create item
            </Button>
          }
          description="Manage personal equipment, party stash entries, and world-linked loot across characters, quests, NPCs, and locations."
          title="Inventory"
        />

        {mutationError ? <Alert severity="error">{mutationError}</Alert> : null}

        <SectionCard>
          <CampaignInventoryList
            campaignId={campaignId}
            canManageAllItems={canManageAll}
            getOwnerLabel={getOwnerLabel}
            getOwnerTypeLabel={getOwnerTypeLabel}
            isSubmitting={isMutating}
            items={inventoryQuery.data ?? []}
            onDeleteItem={(itemId) => deleteInventoryItemMutation.mutate(itemId)}
            onEditItem={(itemId) => setEditingItemId(itemId)}
            onOpenDetails={(itemId) => setSelectedItemId(itemId)}
            onTransferItem={(itemId) => setTransferringItemId(itemId)}
            ownedCharacterIds={ownedCharacterIds}
          />
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
            isAttuned: values.isAttuned,
            isEquipped: values.isEquipped,
            isIdentified: values.isIdentified,
            maxCharges: values.maxCharges ?? null,
            name: values.name.trim(),
            ownerId: values.ownerId,
            ownerType: values.ownerType,
            quantity: values.quantity,
            visibility: values.visibility,
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
              isAttuned: values.isAttuned,
              isIdentified: values.isIdentified,
              maxCharges: values.maxCharges ?? null,
              name: values.name.trim(),
              quantity: values.quantity,
              visibility: values.visibility,
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
