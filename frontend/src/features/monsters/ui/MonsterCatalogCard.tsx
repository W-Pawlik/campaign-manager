import { Button, Chip, Paper, Stack, Typography } from "@mui/material";

import type { MonsterCatalogSource } from "@/features/monsters/ui/MonsterCatalogSourceTabs";
import { MonsterCatalogArtwork } from "@/features/monsters/ui/MonsterCatalogArtwork";
import {
  getCatalogItemCrLabel,
  getCatalogItemImageUrl,
  getCatalogItemSizeLabel,
  getCatalogItemSourceLabel,
  getCatalogItemTypeLabel,
  isOpen5eCatalogItem,
  type MonsterCatalogListEntry,
} from "@/features/monsters/ui/monsterCatalog.utils";

type MonsterCatalogCardProps = {
  canAddToCampaign: boolean;
  item: MonsterCatalogListEntry;
  onAddToCampaign: (item: MonsterCatalogListEntry) => void;
  onOpenDetails: (item: MonsterCatalogListEntry) => void;
  source: MonsterCatalogSource;
};

export function MonsterCatalogCard({
  canAddToCampaign,
  item,
  onAddToCampaign,
  onOpenDetails,
  source,
}: MonsterCatalogCardProps) {
  const typeLabel = getCatalogItemTypeLabel(item) ?? "Unknown type";
  const sizeLabel = getCatalogItemSizeLabel(item) ?? "Unknown size";
  const crLabel = getCatalogItemCrLabel(item) ?? "?";
  const sourceLabel = getCatalogItemSourceLabel(item);
  const imageUrl = getCatalogItemImageUrl(item);

  return (
    <Paper
      onClick={() => onOpenDetails(item)}
      sx={{
        borderColor: "rgba(166, 122, 62, 0.34)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        position: "relative",
        transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
        "&:hover": {
          borderColor: "rgba(224, 161, 0, 0.5)",
          boxShadow: "0 18px 40px rgba(0, 0, 0, 0.28)",
          transform: "translateY(-4px)",
        },
      }}
      variant="outlined"
    >
      <MonsterCatalogArtwork alt={item.name} imageUrl={imageUrl} minHeight={280} />

      <Stack
        spacing={1.5}
        sx={{
          background:
            "linear-gradient(180deg, rgba(24, 19, 16, 0.96) 0%, rgba(41, 29, 23, 0.98) 100%)",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          color: "common.white",
          mt: "auto",
          p: 2,
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start", justifyContent: "space-between" }}>
          <Stack spacing={0.5}>
            <Typography
              sx={{
                fontFamily: '"Georgia", "Times New Roman", serif',
                letterSpacing: 0.8,
                lineHeight: 1,
                textTransform: "uppercase",
              }}
              variant="h5"
            >
              {item.name}
            </Typography>
            <Typography color="rgba(255,255,255,0.72)" variant="body2">
              {sizeLabel} {typeLabel}
            </Typography>
          </Stack>
          <Chip
            label={`CR ${crLabel}`}
            size="small"
            sx={{
              bgcolor: "rgba(230, 22, 26, 0.18)",
              borderColor: "rgba(230, 22, 26, 0.45)",
              color: "common.white",
            }}
            variant="outlined"
          />
        </Stack>

        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          <Chip
            label={source === "open5e" ? "OPEN5E" : "COMMUNITY"}
            size="small"
            sx={{ color: "common.white" }}
            variant="outlined"
          />
          {!isOpen5eCatalogItem(item) ? (
            <Chip
              label={item.visibility.replace("_", " ")}
              size="small"
              sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "common.white" }}
            />
          ) : null}
        </Stack>

        <Typography color="rgba(255,255,255,0.72)" sx={{ minHeight: 40 }} variant="body2">
          {sourceLabel}
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
            View card
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
