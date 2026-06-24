import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import type { Open5eResourceDetails } from "@/features/monsters/model/monster.types";
import { MonsterCatalogArtwork } from "@/features/monsters/ui/MonsterCatalogArtwork";
import { MonsterStatblockEntries } from "@/features/monsters/ui/MonsterStatblockEntries";
import {
  formatSpeed,
  getOpen5eIllustrationUrl,
  getRenderableText,
  getStatblockEntries,
} from "@/features/monsters/ui/monsterCatalog.utils";

type Open5eResourceDetailsDialogProps = {
  onClose: () => void;
  onImport?: () => void;
  open: boolean;
  resource: Open5eResourceDetails | null;
};

export function Open5eResourceDetailsDialog({
  onClose,
  onImport,
  open,
  resource,
}: Open5eResourceDetailsDialogProps) {
  const normalized = resource?.normalizedData;
  const illustrationUrl = getOpen5eIllustrationUrl(
    normalized,
    resource?.illustrationUrl ?? null,
  );
  const actionEntries = getStatblockEntries(normalized?.actions);
  const traitEntries = getStatblockEntries(normalized?.traits);

  const summaryRows: Array<[string, string]> = [
    [
      "AC",
      normalized?.armorClassDetails
        ? `${getRenderableText(normalized?.armorClass)} (${normalized.armorClassDetails})`
        : getRenderableText(normalized?.armorClass),
    ],
    [
      "HP",
      normalized?.hitDice
        ? `${getRenderableText(normalized?.hitPoints)} (${normalized.hitDice})`
        : getRenderableText(normalized?.hitPoints),
    ],
    ["Speed", formatSpeed(normalized?.speed)],
    ["Languages", getRenderableText(normalized?.languages)],
    ["Senses", getRenderableText(normalized?.senses)],
    ["Alignment", getRenderableText(normalized?.alignment)],
  ];

  return (
    <Dialog fullWidth maxWidth="lg" onClose={onClose} open={open}>
      <DialogTitle sx={{ pb: 1.5 }}>
        <Stack spacing={1}>
          <Typography
            sx={{
              fontFamily: '"Georgia", "Times New Roman", serif',
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
            variant="h4"
          >
            {resource?.name ?? "Open5e creature details"}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {resource?.sourceDocumentName ?? "Open5e"} | cached {resource?.cachedAt ?? "N/A"}
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        <Stack
          direction={{ xs: "column", lg: "row" }}
          sx={{
            background:
              "linear-gradient(180deg, rgba(246, 236, 219, 0.98) 0%, rgba(233, 217, 186, 0.98) 100%)",
          }}
        >
          <Box
            sx={{
              borderRight: { lg: "1px solid rgba(35, 24, 19, 0.12)" },
              flex: { lg: "0 0 42%" },
              p: { xs: 2, md: 2.5 },
            }}
          >
            <Box
              sx={{
                border: "1px solid rgba(35, 24, 19, 0.12)",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <MonsterCatalogArtwork
                alt={resource?.name ?? "Open5e creature"}
                imageUrl={illustrationUrl}
                minHeight={{ xs: 280, md: 420 }}
                objectFit="contain"
                overlay={false}
              />
            </Box>
          </Box>

          <Stack
            spacing={2.5}
            sx={{
              color: "#231813",
              flex: 1,
              p: { xs: 2.5, md: 3 },
            }}
          >
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              {normalized?.type ? <Chip label={String(normalized.type)} size="small" variant="outlined" /> : null}
              {normalized?.size ? <Chip label={String(normalized.size)} size="small" variant="outlined" /> : null}
              {normalized?.challengeRating ? (
                <Chip label={`CR ${String(normalized.challengeRating)}`} size="small" />
              ) : null}
            </Stack>

            <Typography sx={{ fontSize: "1rem", lineHeight: 1.7 }}>
              {typeof normalized?.description === "string" && normalized.description.length > 0
                ? normalized.description
                : "No creature description available."}
            </Typography>

            <Grid container spacing={1.5}>
              {summaryRows.map(([label, value]) => (
                <Grid key={label} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Box
                    sx={{
                      bgcolor: "rgba(35, 24, 19, 0.06)",
                      border: "1px solid rgba(35, 24, 19, 0.12)",
                      borderRadius: 2,
                      p: 1.5,
                    }}
                  >
                    <Typography sx={{ color: "rgba(35, 24, 19, 0.68)" }} variant="body2">
                      {label}
                    </Typography>
                    <Typography variant="body1">{value}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Box
              sx={{
                bgcolor: "rgba(35, 24, 19, 0.08)",
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography sx={{ fontFamily: '"Georgia", "Times New Roman", serif' }} variant="h6">
                Abilities
              </Typography>
              <Typography sx={{ mt: 1, lineHeight: 1.8 }} variant="body1">
                STR {getRenderableText(normalized?.strength)} | DEX {getRenderableText(normalized?.dexterity)} | CON{" "}
                {getRenderableText(normalized?.constitution)} | INT {getRenderableText(normalized?.intelligence)} | WIS{" "}
                {getRenderableText(normalized?.wisdom)} | CHA {getRenderableText(normalized?.charisma)}
              </Typography>
            </Box>

            <MonsterStatblockEntries
              emptyMessage="No passive features available."
              entries={traitEntries}
              title="Traits"
            />

            <MonsterStatblockEntries
              emptyMessage="No actions available."
              entries={actionEntries}
              title="Actions"
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Close</Button>
        {onImport ? (
          <Button onClick={onImport} variant="contained">
            Add to campaign
          </Button>
        ) : null}
      </DialogActions>
    </Dialog>
  );
}
