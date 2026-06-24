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

import type { CampaignMonsterDetails } from "@/features/monsters/model/monster.types";
import { MonsterCatalogArtwork } from "@/features/monsters/ui/MonsterCatalogArtwork";
import { MonsterStatblockEntries } from "@/features/monsters/ui/MonsterStatblockEntries";
import {
  formatSpeed,
  getRenderableText,
  getStatblockEntries,
} from "@/features/monsters/ui/monsterCatalog.utils";

type MonsterDetailsDialogProps = {
  monster: CampaignMonsterDetails | null;
  onClose: () => void;
  open: boolean;
};

export function MonsterDetailsDialog({ monster, onClose, open }: MonsterDetailsDialogProps) {
  const actionEntries = getStatblockEntries(monster?.actions);
  const traitEntries = getStatblockEntries(monster?.traits);

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
            {monster?.name ?? "Monster details"}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {monster?.type ?? "Unknown type"} | {monster?.size ?? "Unknown size"} | CR {monster?.challengeRating ?? "?"}
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
                alt={monster?.name ?? "Community monster"}
                imageUrl={null}
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
              {monster?.source ? <Chip label={monster.source} size="small" variant="outlined" /> : null}
              {monster?.visibility ? (
                <Chip label={monster.visibility.replace("_", " ")} size="small" />
              ) : null}
              {monster?.sourceBook ? (
                <Chip label={monster.sourceBook} size="small" variant="outlined" />
              ) : null}
            </Stack>

            <Typography sx={{ fontSize: "1rem", lineHeight: 1.7 }}>
              {monster?.description ?? "No description yet."}
            </Typography>

            <Grid container spacing={1.5}>
              {[
                [
                  "AC",
                  monster?.armorClassDetails
                    ? `${getRenderableText(monster?.armorClass)} (${monster.armorClassDetails})`
                    : getRenderableText(monster?.armorClass),
                ],
                [
                  "HP",
                  monster?.hitDice
                    ? `${getRenderableText(monster?.hitPoints)} (${monster.hitDice})`
                    : getRenderableText(monster?.hitPoints),
                ],
                ["Speed", formatSpeed(monster?.speed)],
                ["Alignment", getRenderableText(monster?.alignment)],
                ["Languages", getRenderableText(monster?.languages)],
                ["Senses", getRenderableText(monster?.senses)],
              ].map(([label, value]) => (
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
                STR {getRenderableText(monster?.abilities.strength)} | DEX {getRenderableText(monster?.abilities.dexterity)} | CON{" "}
                {getRenderableText(monster?.abilities.constitution)} | INT {getRenderableText(monster?.abilities.intelligence)} | WIS{" "}
                {getRenderableText(monster?.abilities.wisdom)} | CHA {getRenderableText(monster?.abilities.charisma)}
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
      </DialogActions>
    </Dialog>
  );
}
