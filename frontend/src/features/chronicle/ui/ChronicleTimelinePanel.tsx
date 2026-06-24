import { alpha, ButtonBase, Paper, Stack, Typography } from "@mui/material";

import { useCampaignReferenceIndex } from "@/features/campaigns";
import type { ChronicleEntryView } from "@/features/chronicle/model/chronicle.types";
import { formatChronicleTimelineModeLabel, type ChronicleTimelineMode } from "@/features/chronicle/ui/chronicleListUi.utils";

type ChronicleTimelinePanelProps = {
  campaignId: string;
  entries: ChronicleEntryView[];
  mode: ChronicleTimelineMode;
  onSelectEntry: (entryId: string) => void;
};

function formatTimelineDate(value: string | null, mode: ChronicleTimelineMode): string {
  if (!value) {
    return "No date";
  }

  if (mode === "IN_WORLD_DATE") {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function ChronicleTimelinePanel({
  campaignId,
  entries,
  mode,
  onSelectEntry,
}: ChronicleTimelinePanelProps) {
  const references = useCampaignReferenceIndex(campaignId, ["SESSION"]);

  return (
    <Paper sx={{ p: 2.25 }} variant="outlined">
      <Stack spacing={2}>
        <Typography variant="h6">{formatChronicleTimelineModeLabel(mode)}</Typography>
        {entries.length === 0 ? (
          <Typography color="text.secondary">No chronicle entries with this date yet.</Typography>
        ) : (
          <Stack spacing={0}>
            {entries.map((entry, index) => {
              const dateLabel = formatTimelineDate(
                mode === "IN_WORLD_DATE" ? entry.inWorldDate : entry.occurredAt,
                mode,
              );

              return (
                <ButtonBase
                  key={`${mode}-${entry.id}`}
                  onClick={() => onSelectEntry(entry.id)}
                  sx={{
                    borderRadius: 1.5,
                    display: "block",
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{
                      alignItems: "stretch",
                      borderRadius: 1.5,
                      mb: index < entries.length - 1 ? 0.75 : 0,
                      px: 0.75,
                      py: 0.5,
                    }}
                  >
                    <Stack sx={{ alignItems: "center", minWidth: 20 }}>
                      <Typography
                        sx={{ bgcolor: "primary.main", borderRadius: "50%", height: 12, mt: 0.75, width: 12 }}
                      />
                      {index < entries.length - 1 ? (
                        <Typography
                          sx={(theme) => ({
                            flex: 1,
                            minHeight: 64,
                            width: 3,
                            background: `linear-gradient(180deg, ${alpha(
                              theme.palette.primary.main,
                              0.96,
                            )} 0%, ${alpha(
                              theme.palette.primary.main,
                              0.84,
                            )} 55%, ${alpha(theme.palette.primary.main, 0.66)} 100%)`,
                          })}
                        />
                      ) : null}
                    </Stack>
                    <Stack spacing={0.5} sx={{ pb: index < entries.length - 1 ? 1 : 0 }}>
                      <Typography color="text.secondary" variant="caption">
                        {dateLabel}
                      </Typography>
                      <Typography sx={{ fontWeight: 700 }}>{entry.title}</Typography>
                      <Typography color="text.secondary" variant="body2">
                        {entry.sessionId
                          ? references.getReferenceLabel("SESSION", entry.sessionId)
                          : "No linked session"}
                      </Typography>
                    </Stack>
                  </Stack>
                </ButtonBase>
              );
            })}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}
