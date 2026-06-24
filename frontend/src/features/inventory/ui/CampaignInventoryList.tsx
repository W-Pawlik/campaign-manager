import { Button, Chip, Paper, Stack, Typography } from "@mui/material";

import type { CampaignInventoryListItem } from "@/features/campaigns";
import { CampaignEntityReferenceChip } from "@/features/campaigns";
import { EmptyState } from "@/shared/components";

type CampaignInventoryListProps = {
  campaignId: string;
  canManageAllItems: boolean;
  getOwnerLabel: (ownerType: string, ownerId: string) => string | null;
  getOwnerTypeLabel: (ownerType: string) => string | null;
  isSubmitting: boolean;
  items: CampaignInventoryListItem[];
  onDeleteItem: (itemId: string) => void;
  onEditItem: (itemId: string) => void;
  onOpenDetails: (itemId: string) => void;
  onTransferItem: (itemId: string) => void;
  ownedCharacterIds: string[];
};

export function CampaignInventoryList({
  campaignId,
  canManageAllItems,
  getOwnerLabel,
  getOwnerTypeLabel,
  isSubmitting,
  items,
  onDeleteItem,
  onEditItem,
  onOpenDetails,
  onTransferItem,
  ownedCharacterIds,
}: CampaignInventoryListProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        description="Track personal gear, party stash, quest items, and world loot in one place."
        title="No inventory items yet"
      />
    );
  }

  return (
    <Stack spacing={1.5}>
      {items.map((item) => {
        const canManageItem =
          canManageAllItems || (item.ownerType === "CHARACTER" && ownedCharacterIds.includes(item.ownerId));

        return (
          <Paper
            key={item.id}
            sx={{
              background:
                item.isMagical
                  ? "linear-gradient(155deg, rgba(51, 33, 17, 0.98) 0%, rgba(27, 22, 18, 0.98) 48%, rgba(72, 47, 24, 0.92) 100%)"
                  : undefined,
              p: 2.25,
            }}
            variant="outlined"
          >
            <Stack spacing={1.5}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
                <Stack spacing={0.5}>
                  <Typography variant="h6">{item.name}</Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                    <Chip label={item.type.replaceAll("_", " ")} size="small" variant="outlined" />
                    {item.rarity ? <Chip label={item.rarity.replaceAll("_", " ")} size="small" variant="outlined" /> : null}
                    {item.isMagical ? <Chip color="primary" label="Magical" size="small" /> : null}
                  </Stack>
                  <Typography color="text.secondary">{item.description ?? "No description yet."}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                  <Chip label={`Qty ${item.quantity}`} size="small" />
                  <Chip label={item.visibility.replace("_", " ")} size="small" variant="outlined" />
                  {item.isEquipped ? <Chip color="primary" label="Equipped" size="small" /> : null}
                </Stack>
              </Stack>

              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                {item.ownerType === "CAMPAIGN_PARTY" ? (
                  <Chip label="Campaign party stash" size="small" variant="outlined" />
                ) : (
                  <CampaignEntityReferenceChip
                    campaignId={campaignId}
                    entityId={item.ownerId}
                    entityType={getOwnerTypeLabel(item.ownerType)}
                    label={getOwnerLabel(item.ownerType, item.ownerId)}
                  />
                )}
                {item.weight !== null ? <Chip label={`${item.weight} lb`} size="small" variant="outlined" /> : null}
                {item.valueAmount !== null ? (
                  <Chip
                    label={`${item.valueAmount}${item.valueCurrency ? ` ${item.valueCurrency}` : ""}`}
                    size="small"
                    variant="outlined"
                  />
                ) : null}
              </Stack>

              <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
                <Button onClick={() => onOpenDetails(item.id)} variant="outlined">
                  View details
                </Button>
                {canManageItem ? (
                  <>
                    <Button onClick={() => onEditItem(item.id)} variant="text">
                      Edit
                    </Button>
                    <Button onClick={() => onTransferItem(item.id)} variant="text">
                      Transfer
                    </Button>
                    <Button
                      color="error"
                      disabled={isSubmitting}
                      onClick={() => onDeleteItem(item.id)}
                      variant="outlined"
                    >
                      Delete
                    </Button>
                  </>
                ) : null}
              </Stack>
            </Stack>
          </Paper>
        );
      })}
    </Stack>
  );
}
