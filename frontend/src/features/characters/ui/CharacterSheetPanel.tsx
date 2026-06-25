import { Icon } from "@iconify/react";
import { Box, Button, Chip, Divider, Grid, Stack, Typography } from "@mui/material";

import type { CampaignCharacterDetails } from "@/features/characters/model/character.types";
import {
  buildAbilityRows,
  buildCharacterStatRows,
  formatCharacterStatusLabel,
  formatCharacterTypeLabel,
  getCharacterOwnerLabel,
  getCharacterSubtitle,
} from "@/features/characters/ui/characterUi.utils";

type CharacterSheetPanelProps = {
  canManageAllCharacters: boolean;
  character: CampaignCharacterDetails | null;
  onEditCharacter: (characterId: string) => void;
};

const paperSectionSx = {
  backgroundColor: "rgba(91, 66, 34, 0.04)",
  border: "1px solid rgba(119, 88, 49, 0.18)",
  borderRadius: 2,
  p: 1.5,
};

export function CharacterSheetPanel({
  canManageAllCharacters,
  character,
  onEditCharacter,
}: CharacterSheetPanelProps) {
  if (!character) {
    return (
      <Box
        sx={{
          alignItems: "center",
          background:
            "linear-gradient(180deg, rgba(246, 236, 214, 0.96) 0%, rgba(232, 219, 191, 0.96) 100%)",
          border: "1px solid rgba(134, 101, 58, 0.42)",
          borderRadius: 3,
          display: "flex",
          justifyContent: "center",
          minHeight: 720,
          p: 4,
          textAlign: "center",
        }}
      >
        <Stack spacing={1.5}>
          <Typography
            sx={{
              color: "#433220",
              fontFamily: '"Georgia", "Times New Roman", serif',
              fontSize: "2.2rem",
            }}
          >
            Select a character
          </Typography>
          <Typography color="#6a573d" variant="body1">
            Choose someone from the roster to open their sheet, stats, and narrative notes.
          </Typography>
        </Stack>
      </Box>
    );
  }

  const statRows = buildCharacterStatRows(character);
  const abilityRows = buildAbilityRows(character);

  return (
    <Box
      sx={{
        background:
          "linear-gradient(180deg, rgba(246, 236, 214, 0.98) 0%, rgba(231, 217, 190, 0.98) 100%)",
        border: "1px solid rgba(134, 101, 58, 0.46)",
        borderRadius: 3,
        boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.35)",
        color: "#352618",
        minHeight: 720,
        p: { xs: 2, md: 3 },
        position: "relative",
      }}
    >
      <Stack spacing={2.5}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{ alignItems: { md: "flex-start" }, justifyContent: "space-between" }}
        >
          <Stack direction="row" spacing={2} sx={{ alignItems: "center", minWidth: 0 }}>
            <Box
              sx={{
                bgcolor: "rgba(62, 43, 24, 0.12)",
                border: "2px solid rgba(119, 88, 49, 0.5)",
                borderRadius: "50%",
                flexShrink: 0,
                height: { xs: 88, md: 112 },
                overflow: "hidden",
                width: { xs: 88, md: 112 },
              }}
            >
              {character.avatarUrl ? (
                <Box
                  alt={character.name}
                  component="img"
                  src={character.avatarUrl}
                  sx={{ display: "block", height: "100%", objectFit: "cover", width: "100%" }}
                />
              ) : (
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    height: "100%",
                    justifyContent: "center",
                  }}
                >
                  <Icon
                    icon="game-icons:crested-helmet"
                    style={{ color: "#6e5430", fontSize: 42 }}
                  />
                </Box>
              )}
            </Box>

            <Stack spacing={0.85} sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  color: "#3f2d1d",
                  fontFamily: '"Georgia", "Times New Roman", serif',
                  fontSize: { xs: "2rem", md: "3rem" },
                  lineHeight: 0.98,
                }}
              >
                {character.name}
              </Typography>
              <Typography color="#5c492d" variant="h6">
                {getCharacterSubtitle(character)}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
                <Chip
                  label={formatCharacterTypeLabel(character.type)}
                  size="small"
                  sx={{ bgcolor: "rgba(121, 46, 37, 0.12)", color: "#7a2f27", fontWeight: 700 }}
                />
                <Chip
                  label={formatCharacterStatusLabel(character.status)}
                  size="small"
                  sx={{ bgcolor: "rgba(48, 103, 51, 0.12)", color: "#2f6736", fontWeight: 700 }}
                />
              </Stack>
            </Stack>
          </Stack>

          {canManageAllCharacters ? (
            <Button onClick={() => onEditCharacter(character.id)} variant="contained">
              Edit character
            </Button>
          ) : null}
        </Stack>

        <Divider sx={{ borderColor: "rgba(119, 88, 49, 0.24)" }} />

        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={0.5} sx={paperSectionSx}>
              <Typography color="#7a6240" variant="caption">
                Owner
              </Typography>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Icon icon="tdesign:member-filled" style={{ fontSize: 18, color: "#5f4a2f" }} />
                <Typography variant="body1">
                  {getCharacterOwnerLabel(
                    character.ownerUsername,
                    character.ownerDisplayName,
                    character.ownerUserId,
                  )}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={0.5} sx={paperSectionSx}>
              <Typography color="#7a6240" variant="caption">
                Background
              </Typography>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Icon
                  icon="mdi:book-open-page-variant"
                  style={{ fontSize: 18, color: "#5f4a2f" }}
                />
                <Typography variant="body1">{character.background ?? "Not set"}</Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={0.5} sx={paperSectionSx}>
              <Typography color="#7a6240" variant="caption">
                Alignment
              </Typography>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Icon
                  icon="mdi:star-four-points-circle"
                  style={{ fontSize: 18, color: "#5f4a2f" }}
                />
                <Typography variant="body1">{character.alignment ?? "Unspecified"}</Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        <Grid container spacing={1.5}>
          {statRows.map((item) => (
            <Grid key={item.label} size={{ xs: 6, md: 4 }}>
              <Stack spacing={0.45} sx={paperSectionSx}>
                <Typography color="#7a6240" variant="caption">
                  {item.label}
                </Typography>
                <Typography
                  sx={{
                    color: "#3a2a1c",
                    fontFamily: '"Georgia", "Times New Roman", serif',
                    fontSize: "2rem",
                    lineHeight: 1,
                  }}
                >
                  {item.value}
                </Typography>
                <Typography color="#8a6f48" variant="caption">
                  {item.secondary}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={1.5}>
          {abilityRows.map((ability) => (
            <Grid key={ability.label} size={{ xs: 6, md: 4, xl: 2 }}>
              <Stack spacing={0.4} sx={paperSectionSx}>
                <Typography color="#7a6240" variant="caption">
                  {ability.label}
                </Typography>
                <Typography
                  sx={{
                    color: "#352618",
                    fontFamily: '"Georgia", "Times New Roman", serif',
                    fontSize: "2rem",
                    lineHeight: 1,
                  }}
                >
                  {ability.score ?? "—"}
                </Typography>
                <Typography color="#8a6f48" variant="caption">
                  {ability.modifier}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, xl: 6 }}>
            <Stack spacing={1.25} sx={paperSectionSx}>
              <Typography sx={{ color: "#5d472b", fontWeight: 700 }} variant="subtitle1">
                Personality
              </Typography>
              <Stack spacing={1}>
                <CharacterNarrativeRow
                  icon="mdi:mask"
                  label="Traits"
                  value={character.personalityTraits}
                />
                <CharacterNarrativeRow
                  icon="mdi:star-circle-outline"
                  label="Ideals"
                  value={character.ideals}
                />
                <CharacterNarrativeRow
                  icon="mdi:link-variant"
                  label="Bonds"
                  value={character.bonds}
                />
                <CharacterNarrativeRow
                  icon="mdi:alert-octagon-outline"
                  label="Flaws"
                  value={character.flaws}
                />
              </Stack>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, xl: 6 }}>
            <Stack spacing={1.25} sx={paperSectionSx}>
              <Typography sx={{ color: "#5d472b", fontWeight: 700 }} variant="subtitle1">
                Background notes
              </Typography>
              <Typography color="#53412d" variant="body2">
                {character.backstory?.trim() || "No backstory recorded yet."}
              </Typography>
              <Divider sx={{ borderColor: "rgba(119, 88, 49, 0.16)" }} />
              <Typography color="#53412d" variant="body2">
                {character.appearance?.trim() || "No appearance notes recorded yet."}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}

function CharacterNarrativeRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string | null;
}) {
  return (
    <Stack direction="row" spacing={1.1} sx={{ alignItems: "flex-start" }}>
      <Icon icon={icon} style={{ color: "#6e5430", fontSize: 18, marginTop: 2 }} />
      <Stack spacing={0.2}>
        <Typography sx={{ color: "#5f4a2f", fontWeight: 700 }} variant="body2">
          {label}
        </Typography>
        <Typography color="#53412d" variant="body2">
          {value?.trim() || "Not recorded yet."}
        </Typography>
      </Stack>
    </Stack>
  );
}
