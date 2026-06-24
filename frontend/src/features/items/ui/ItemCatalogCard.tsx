import { Button, Chip, Paper, Stack, Typography } from "@mui/material";

import type { ItemsCatalogTab } from "@/features/items/model/item.types";
import {
  formatLabel,
  getIsMagical,
  getItemRarityLabel,
  getItemSourceLabel,
  getItemTypeLabel,
  getItemValueLabel,
  getItemWeight,
  type ItemCatalogListEntry,
} from "@/features/items/ui/itemCatalog.utils";

type ItemCatalogCardProps = {
  canAddToCampaign: boolean;
  item: ItemCatalogListEntry;
  onAddToCampaign: (item: ItemCatalogListEntry) => void;
  onOpenDetails: (item: ItemCatalogListEntry) => void;
  tab: ItemsCatalogTab;
};

export function ItemCatalogCard({
  canAddToCampaign,
  item,
  onAddToCampaign,
  onOpenDetails,
  tab,
}: ItemCatalogCardProps) {
  const typeLabel = formatLabel(getItemTypeLabel(item)) ?? "Unknown type";
  const rarityLabel = formatLabel(getItemRarityLabel(item));
  const sourceLabel = getItemSourceLabel(item);
  const weight = getItemWeight(item);
  const valueLabel = getItemValueLabel(item);
  const magical = getIsMagical(item);

  return (
    <Paper
      onClick={() => onOpenDetails(item)}
      sx={{
        background:
          "linear-gradient(160deg, rgba(47, 32, 21, 0.98) 0%, rgba(23, 18, 15, 0.98) 46%, rgba(64, 40, 19, 0.92) 100%)",
        borderColor: magical ? "rgba(201, 162, 77, 0.42)" : "rgba(166, 122, 62, 0.3)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        position: "relative",
        transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
        "&:hover": {
          borderColor: magical ? "rgba(240, 196, 94, 0.62)" : "rgba(224, 161, 0, 0.4)",
          boxShadow: "0 18px 42px rgba(0, 0, 0, 0.28)",
          transform: "translateY(-4px)",
        },
      }}
      variant="outlined"
    >
      <Stack
        spacing={1.5}
        sx={{
          background:
            magical
              ? "radial-gradient(circle at top right, rgba(201, 162, 77, 0.24), transparent 42%), linear-gradient(180deg, rgba(250, 238, 212, 0.98) 0%, rgba(232, 214, 183, 0.94) 100%)"
              : "linear-gradient(180deg, rgba(244, 234, 216, 0.98) 0%, rgba(226, 208, 179, 0.94) 100%)",
          color: "rgba(46, 31, 18, 0.96)",
          minHeight: 210,
          p: 2.25,
          position: "relative",
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start", justifyContent: "space-between" }}>
          <Stack spacing={0.6}>
            <Typography
              sx={{
                fontFamily: '"Georgia", "Times New Roman", serif',
                letterSpacing: 0.7,
                lineHeight: 1,
                textTransform: "uppercase",
              }}
              variant="h5"
            >
              {item.name}
            </Typography>
            <Typography sx={{ opacity: 0.82 }} variant="body2">
              {typeLabel}
            </Typography>
          </Stack>
          <Chip
            label={tab === "magic" || magical ? "MAGIC" : "ITEM"}
            size="small"
            sx={{
              bgcolor: magical ? "rgba(88, 55, 8, 0.12)" : "rgba(70, 47, 23, 0.12)",
              borderColor: magical ? "rgba(120, 84, 15, 0.26)" : "rgba(70, 47, 23, 0.18)",
              color: "inherit",
              fontWeight: 700,
            }}
            variant="outlined"
          />
        </Stack>

        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          {rarityLabel ? <Chip label={rarityLabel} size="small" variant="outlined" /> : null}
          {weight !== null ? <Chip label={`${weight} lb`} size="small" variant="outlined" /> : null}
          {valueLabel ? <Chip label={valueLabel} size="small" variant="outlined" /> : null}
        </Stack>

        <Typography sx={{ mt: "auto", opacity: 0.72 }} variant="body2">
          {sourceLabel}
        </Typography>
      </Stack>

      <Stack spacing={1.5} sx={{ color: "common.white", p: 2 }}>
        <Typography color="rgba(255,255,255,0.72)" sx={{ minHeight: 42 }} variant="body2">
          {magical
            ? "Arcane gear, enchanted relics, and reusable campaign treasures."
            : "Practical adventuring gear and campaign-ready equipment."}
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button
            onClick={(event) => {
              event.stopPropagation();
              onOpenDetails(item);
            }}
            sx={{ flex: 1 }}
            variant="outlined"
          >
            Inspect
          </Button>
          <Button
            disabled={!canAddToCampaign}
            onClick={(event) => {
              event.stopPropagation();
              onAddToCampaign(item);
            }}
            sx={{ flex: 1 }}
            variant="contained"
          >
            Add
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
