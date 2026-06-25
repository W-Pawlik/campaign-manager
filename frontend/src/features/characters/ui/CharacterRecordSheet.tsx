import { Box, Button, Divider, IconButton, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { Icon } from "@iconify/react";

import MonsterCardBackground from "@/assets/MonsterCardBackground.png";
import type { CampaignCharacterDetails } from "@/features/characters/model/character.types";
import {
  buildAbilityRows,
  buildSavingThrowRows,
  buildSkillRows,
  formatCharacterStatusLabel,
  formatCharacterTypeLabel,
  getCharacterHitPointsText,
  getCharacterOwnerLabel,
  getCharacterSubtitle,
  stringifyUnknownRecord,
} from "@/features/characters/ui/characterUi.utils";

type CharacterRecordSheetProps = {
  character: CampaignCharacterDetails;
  onClose?: () => void;
  onEdit?: () => void;
};

export function CharacterRecordSheet({ character, onClose, onEdit }: CharacterRecordSheetProps) {
  const abilityRows = buildAbilityRows(character);
  const savingRows = buildSavingThrowRows(character);
  const skillRows = buildSkillRows(character);
  const attacksText = stringifyUnknownRecord(
    character.attacksAndSpellcasting,
    "Weapon attacks and spellcasting notes have not been added yet.",
  );
  const proficienciesText = stringifyUnknownRecord(
    character.proficiencies,
    "No proficiencies recorded yet.",
  );
  const languagesText = stringifyUnknownRecord(character.languages, "No languages recorded yet.");
  const featuresText = stringifyUnknownRecord(
    character.featuresAndTraits,
    character.personalityTraits?.trim() || "No features or traits recorded yet.",
  );

  return (
    <Box
      sx={{
        backgroundImage: `linear-gradient(180deg, rgba(250, 244, 232, 0.92) 0%, rgba(239, 227, 201, 0.94) 100%), url(${MonsterCardBackground})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        border: "1px solid rgba(93, 69, 42, 0.52)",
        borderRadius: 3,
        color: "#2d2115",
        overflow: "hidden",
        p: { xs: 2, md: 3 },
        position: "relative",
      }}
    >
      <Box
        component="img"
        src="/images/CharacterCardImageTopLeft.webp"
        alt=""
        sx={{
          left: 12,
          opacity: 0.98,
          pointerEvents: "none",
          position: "absolute",
          top: 12,
          width: { xs: 108, md: 142 },
        }}
      />

      <Stack spacing={2.5}>
        {onClose ? (
          <IconButton
            onClick={onClose}
            sx={{
              color: "#4d3923",
              position: "absolute",
              right: 12,
              top: 12,
              zIndex: 2,
            }}
          >
            <Icon icon="solar:close-circle-linear" style={{ fontSize: 28 }} />
          </IconButton>
        ) : null}

        <Stack sx={{ alignItems: "center", pb: 0.5 }}>
          <Typography
            sx={{
              color: "#2f2217",
              fontFamily: '"Georgia", "Times New Roman", serif',
              fontSize: { xs: "2rem", md: "2.5rem" },
              letterSpacing: "0.03em",
            }}
          >
            D&D
          </Typography>
        </Stack>

        <Stack spacing={1.5} sx={{ pl: { xs: 0, md: 16 } }}>
          <FieldRibbon label="Character name" value={character.name} />

          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
            <FieldRibbon label="Class & level" value={getCharacterSubtitle(character)} />
            <FieldRibbon label="Background" value={character.background ?? "Unwritten"} />
            <FieldRibbon
              label="Player name"
              value={getCharacterOwnerLabel(character.ownerUserId)}
            />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
            <FieldRibbon label="Race" value={character.race ?? "Unknown"} />
            <FieldRibbon label="Alignment" value={character.alignment ?? "Unspecified"} />
            <FieldRibbon
              label="Experience points"
              value={character.experiencePoints?.toString() ?? "—"}
            />
          </Stack>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gap: 1.5,
            gridTemplateColumns: { xs: "1fr", lg: "110px minmax(0, 1fr) 220px" },
          }}
        >
          <Stack spacing={1.1}>
            {abilityRows.map((ability) => (
              <AbilityOrb
                key={ability.label}
                label={ability.label}
                modifier={ability.modifier}
                score={ability.score}
              />
            ))}
          </Stack>

          <Stack spacing={1.5}>
            <Stack
              sx={{
                display: "grid",
                gap: 1.25,
                gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" },
              }}
            >
              <SheetSection title="Saving throws">
                <Stack spacing={0.7}>
                  {savingRows.map((row) => (
                    <ListMetric key={row.label} label={row.label} value={row.modifier} />
                  ))}
                </Stack>
              </SheetSection>

              <Stack spacing={1.25}>
                <Stack
                  sx={{
                    display: "grid",
                    gap: 1,
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  }}
                >
                  <CompactStat
                    label="Armor class"
                    value={character.armorClass?.toString() ?? "—"}
                  />
                  <CompactStat
                    label="Initiative"
                    value={
                      character.initiativeBonus != null
                        ? `${character.initiativeBonus >= 0 ? "+" : ""}${character.initiativeBonus}`
                        : "—"
                    }
                  />
                  <CompactStat label="Speed" value={character.speed ?? "—"} />
                </Stack>

                <SheetSection title="Hit points">
                  <Stack spacing={0.75}>
                    <MetricLine label="Maximum" value={character.maxHitPoints?.toString() ?? "—"} />
                    <MetricLine
                      label="Current"
                      value={character.currentHitPoints?.toString() ?? "—"}
                    />
                    <MetricLine
                      label="Temporary"
                      value={character.temporaryHitPoints?.toString() ?? "0"}
                    />
                    <Divider sx={{ borderColor: "rgba(73, 54, 33, 0.18)" }} />
                    <MetricLine label="Summary" value={getCharacterHitPointsText(character)} />
                  </Stack>
                </SheetSection>
              </Stack>
            </Stack>

            <Stack
              sx={{
                display: "grid",
                gap: 1.25,
                gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" },
              }}
            >
              <SheetSection title="Skills">
                <Stack spacing={0.55}>
                  {skillRows.map((row) => (
                    <ListMetric
                      key={row.label}
                      label={`${row.label} (${row.ability})`}
                      value={row.modifier}
                    />
                  ))}
                </Stack>
              </SheetSection>

              <Stack spacing={1.25}>
                <SheetSection title="Hit dice">
                  <Typography variant="body2">{character.hitDice ?? "Not recorded"}</Typography>
                </SheetSection>
                <SheetSection title="Death saves">
                  <Stack spacing={0.65}>
                    <MetricLine label="Successes" value="○ ○ ○" />
                    <MetricLine label="Failures" value="○ ○ ○" />
                  </Stack>
                </SheetSection>
                <SheetSection title="Features & traits">
                  <Typography variant="body2">{featuresText}</Typography>
                </SheetSection>
              </Stack>
            </Stack>

            <Stack
              sx={{
                display: "grid",
                gap: 1.25,
                gridTemplateColumns: { xs: "1fr", md: "1fr 0.9fr" },
              }}
            >
              <SheetSection title="Attacks & spellcasting">
                <Typography variant="body2">{attacksText}</Typography>
              </SheetSection>
              <SheetSection title="Other proficiencies & languages">
                <Stack spacing={0.8}>
                  <Typography variant="body2">{proficienciesText}</Typography>
                  <Divider sx={{ borderColor: "rgba(73, 54, 33, 0.18)" }} />
                  <Typography variant="body2">{languagesText}</Typography>
                </Stack>
              </SheetSection>
            </Stack>
          </Stack>

          <Stack spacing={1.25}>
            <SheetSection title="Personality traits">
              <Typography variant="body2">
                {character.personalityTraits?.trim() || "No notes yet."}
              </Typography>
            </SheetSection>
            <SheetSection title="Ideals">
              <Typography variant="body2">{character.ideals?.trim() || "No notes yet."}</Typography>
            </SheetSection>
            <SheetSection title="Bonds">
              <Typography variant="body2">{character.bonds?.trim() || "No notes yet."}</Typography>
            </SheetSection>
            <SheetSection title="Flaws">
              <Typography variant="body2">{character.flaws?.trim() || "No notes yet."}</Typography>
            </SheetSection>
            <SheetSection title="Identity">
              <Stack spacing={0.75}>
                <MetricLine label="Type" value={formatCharacterTypeLabel(character.type)} />
                <MetricLine label="Status" value={formatCharacterStatusLabel(character.status)} />
                <MetricLine label="Owner" value={getCharacterOwnerLabel(character.ownerUserId)} />
              </Stack>
            </SheetSection>
          </Stack>
        </Box>

        <Stack
          direction={{ xs: "column-reverse", sm: "row" }}
          spacing={1.5}
          sx={{ justifyContent: "space-between" }}
        >
          <Box />
          {onEdit ? (
            <Button onClick={onEdit} variant="contained">
              Edit character
            </Button>
          ) : null}
        </Stack>
      </Stack>
    </Box>
  );
}

function FieldRibbon({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.3} sx={{ flex: 1, minWidth: 0 }}>
      <Typography
        sx={{
          color: "#5c452a",
          fontSize: "0.78rem",
          fontWeight: 700,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>
      <Box sx={{ borderBottom: "1px dashed rgba(73, 54, 33, 0.44)", pb: 0.45 }}>
        <Typography
          sx={{
            color: "#2d2115",
            fontFamily: '"Georgia", "Times New Roman", serif',
            fontSize: "1.15rem",
          }}
        >
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}

function AbilityOrb({
  label,
  modifier,
  score,
}: {
  label: string;
  modifier: string;
  score: number | null;
}) {
  return (
    <Stack spacing={0.55} sx={{ alignItems: "center" }}>
      <Typography
        sx={{
          color: "#503c25",
          fontSize: "0.74rem",
          fontWeight: 700,
          textAlign: "center",
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          alignItems: "center",
          border: "2px solid rgba(73, 54, 33, 0.62)",
          borderRadius: "999px",
          display: "flex",
          flexDirection: "column",
          height: 92,
          justifyContent: "center",
          width: 92,
        }}
      >
        <Typography
          sx={{
            color: "#2d2115",
            fontFamily: '"Georgia", "Times New Roman", serif',
            fontSize: "1.65rem",
            lineHeight: 1,
          }}
        >
          {score ?? "—"}
        </Typography>
        <Typography color="#6e5432" variant="body2">
          {modifier}
        </Typography>
      </Box>
    </Stack>
  );
}

function SheetSection({ children, title }: { children: ReactNode; title: string }) {
  return (
    <Box
      sx={{
        backgroundColor: "rgba(255, 251, 243, 0.32)",
        border: "2px solid rgba(73, 54, 33, 0.48)",
        borderRadius: 2.5,
        minHeight: 110,
        p: 1.4,
      }}
    >
      <Stack spacing={1}>
        <Typography
          sx={{
            color: "#433221",
            fontFamily: '"Georgia", "Times New Roman", serif',
            fontSize: "1rem",
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          {title}
        </Typography>
        {children}
      </Stack>
    </Box>
  );
}

function CompactStat({ label, value }: { label: string; value: string }) {
  return (
    <Box
      sx={{
        backgroundColor: "rgba(255, 251, 243, 0.32)",
        border: "2px solid rgba(73, 54, 33, 0.48)",
        borderRadius: "999px",
        p: 1.2,
        textAlign: "center",
      }}
    >
      <Typography
        sx={{
          color: "#5c452a",
          fontSize: "0.72rem",
          fontWeight: 700,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          color: "#2d2115",
          fontFamily: '"Georgia", "Times New Roman", serif',
          fontSize: "1.8rem",
          lineHeight: 1.05,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function MetricLine({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between" }}>
      <Typography color="#5e482d" variant="body2">
        {label}
      </Typography>
      <Typography color="#2d2115" variant="body2">
        {value}
      </Typography>
    </Stack>
  );
}

function ListMetric({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between" }}>
      <Typography color="#4d3923" variant="body2">
        {label}
      </Typography>
      <Typography color="#2d2115" variant="body2">
        {value}
      </Typography>
    </Stack>
  );
}
