import { Box, Chip, Divider, Grid, Stack, Typography } from "@mui/material";

import { MonsterCatalogArtwork } from "@/features/monsters/ui/MonsterCatalogArtwork";
import { MonsterStatblockEntries } from "@/features/monsters/ui/MonsterStatblockEntries";
import type {
  MonsterSpeedEntry,
  MonsterStatblockEntry,
} from "@/features/monsters/ui/monsterCatalog.utils";
import { monsterDetailsColors } from "@/features/monsters/ui/monsterDetailsCard.styles";

type MonsterDetailsStatblockProps = {
  abilities: Array<{ label: string; value: string }>;
  badges: string[];
  description: string;
  imageAlt: string;
  imageUrl: string | null;
  metaChips?: string[];
  name: string;
  secondaryRows: Array<{ label: string; value: string }>;
  sections: Array<{ emptyMessage: string; entries: MonsterStatblockEntry[]; title: string }>;
  speedEntries: MonsterSpeedEntry[];
  strongStats: Array<{ detail?: string | null; label: string; value: string }>;
};

export function MonsterDetailsStatblock({
  abilities,
  badges,
  description,
  imageAlt,
  imageUrl,
  metaChips = [],
  name,
  secondaryRows,
  sections,
  speedEntries,
  strongStats,
}: MonsterDetailsStatblockProps) {
  return (
    <Stack>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{
          alignItems: { md: "center" },
          backgroundColor: "transparent",
          borderBottom: `1px solid ${monsterDetailsColors.softLine}`,
          justifyContent: "space-between",
          px: { xs: 2.5, md: 3 },
          py: { xs: 2, md: 2.5 },
        }}
      >
        <Typography
          sx={{
            color: monsterDetailsColors.statNumber,
            fontFamily: '"Georgia", "Times New Roman", serif',
            letterSpacing: 1.2,
            textTransform: "uppercase",
          }}
          variant="h4"
        >
          {name}
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: "flex-start", flexWrap: "wrap", justifyContent: { md: "flex-end" } }}
        >
          {badges.map((badge) => (
            <Chip
              key={badge}
              label={badge}
              size="small"
              sx={{
                borderColor: "rgba(104, 43, 36, 0.42)",
                color: monsterDetailsColors.statNumber,
                backgroundColor: "rgba(59, 40, 29, 0.08)",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
              variant="outlined"
            />
          ))}
        </Stack>
      </Stack>

      <Stack direction={{ xs: "column", lg: "row" }}>
        <Box
          sx={{
            borderBottom: { xs: `1px solid ${monsterDetailsColors.softLine}`, lg: "none" },
            borderRight: { lg: `1px solid ${monsterDetailsColors.softLine}` },
            flex: { lg: "0 0 40%" },
            p: { xs: 2, md: 2.5 },
          }}
        >
          <Box
            sx={{
              border: `1px solid ${monsterDetailsColors.line}`,
              borderRadius: 2,
              overflow: "hidden",
              p: 1,
            }}
          >
            <MonsterCatalogArtwork
              alt={imageAlt}
              backgroundColor="transparent"
              imageBackgroundColor="transparent"
              imageUrl={imageUrl}
              minHeight={{ xs: 280, md: 420 }}
              objectFit="contain"
              overlay={false}
            />
          </Box>
        </Box>

        <Stack sx={{ color: monsterDetailsColors.bodyText, flex: 1, p: { xs: 2.5, md: 3 } }}>
          {metaChips.length > 0 ? (
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              {metaChips.map((chip) => (
                <Chip
                  key={chip}
                  label={chip}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(143, 29, 29, 0.08)",
                    borderColor: monsterDetailsColors.softLine,
                    color: monsterDetailsColors.sectionLabel,
                    fontWeight: 700,
                  }}
                  variant="outlined"
                />
              ))}
            </Stack>
          ) : null}

          <Typography sx={{ lineHeight: 1.8 }} variant="body1">
            {description}
          </Typography>

          <Grid container spacing={1.5}>
            {strongStats.map((stat) => (
              <Grid key={stat.label} size={{ xs: 12, sm: 6 }}>
                <Box
                  sx={{
                    alignItems: "center",
                    backgroundColor: "rgba(59, 40, 29, 0.08)",
                    border: `2px solid rgba(104, 43, 36, 0.42)`,
                    borderRadius: 2,
                    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.18)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    minHeight: 164,
                    p: 2,
                    textAlign: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: monsterDetailsColors.sectionLabel,
                      fontWeight: 700,
                      letterSpacing: 0.8,
                      textTransform: "uppercase",
                    }}
                    variant="caption"
                  >
                    {stat.label}
                  </Typography>
                  <Typography
                    sx={{
                      color: monsterDetailsColors.statNumber,
                      fontFamily: '"Georgia", "Times New Roman", serif',
                      lineHeight: 1.1,
                      mt: 0.75,
                    }}
                    variant="h3"
                  >
                    {stat.value}
                  </Typography>
                  {stat.detail ? (
                    <Typography
                      sx={{
                        color: monsterDetailsColors.bodyText,
                        fontSize: "0.85rem",
                        lineHeight: 1.4,
                        mt: 0.75,
                      }}
                      variant="body2"
                    >
                      {stat.detail}
                    </Typography>
                  ) : null}
                </Box>
              </Grid>
            ))}
          </Grid>

          <Box
            sx={{
              borderBottom: `1px solid ${monsterDetailsColors.softLine}`,
              borderTop: `2px solid ${monsterDetailsColors.line}`,
              py: 1.5,
            }}
          >
            <Typography
              sx={{
                color: monsterDetailsColors.sectionLabel,
                fontFamily: '"Georgia", "Times New Roman", serif',
                fontWeight: 700,
                mb: 1,
                textTransform: "uppercase",
              }}
              variant="h6"
            >
              Speed
            </Typography>
            <Grid container spacing={1}>
              {speedEntries.map((entry) => (
                <Grid key={entry.label} size={{ xs: 4, sm: 2 }}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      sx={{ color: monsterDetailsColors.sectionLabel, fontWeight: 700 }}
                      variant="caption"
                    >
                      {entry.label}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: '"Georgia", "Times New Roman", serif',
                        fontSize: "1.1rem",
                        fontWeight: 700,
                      }}
                      variant="body1"
                    >
                      {entry.value}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Stack divider={<Divider flexItem sx={{ borderColor: monsterDetailsColors.softLine }} />} sx={{ borderBottom: `1px solid ${monsterDetailsColors.softLine}`, borderTop: `1px solid ${monsterDetailsColors.softLine}` }}>
            {secondaryRows.map((row) => (
              <Stack key={row.label} direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ py: 1.25 }}>
                <Typography sx={{ color: monsterDetailsColors.sectionLabel, fontWeight: 700, minWidth: { sm: 110 }, textTransform: "uppercase" }} variant="body2">
                  {row.label}
                </Typography>
                <Typography sx={{ flex: 1, whiteSpace: "pre-line" }} variant="body2">
                  {row.value}
                </Typography>
              </Stack>
            ))}
          </Stack>

          <Box sx={{ borderBottom: `1px solid ${monsterDetailsColors.softLine}`, borderTop: `2px solid ${monsterDetailsColors.line}`, py: 1.5 }}>
            <Typography sx={{ color: monsterDetailsColors.sectionLabel, fontFamily: '"Georgia", "Times New Roman", serif', fontWeight: 700, mb: 1, textTransform: "uppercase" }} variant="h6">
              Abilities
            </Typography>
            <Grid container spacing={1}>
              {abilities.map((ability) => (
                <Grid key={ability.label} size={{ xs: 4, sm: 2 }}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography sx={{ color: monsterDetailsColors.sectionLabel, fontWeight: 700 }} variant="caption">
                      {ability.label}
                    </Typography>
                    <Typography sx={{ fontFamily: '"Georgia", "Times New Roman", serif', fontSize: "1.35rem", fontWeight: 700 }} variant="body1">
                      {ability.value}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          {sections.map((section) => (
            <MonsterStatblockEntries
              key={section.title}
              emptyMessage={section.emptyMessage}
              entries={section.entries}
              title={section.title}
            />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}
