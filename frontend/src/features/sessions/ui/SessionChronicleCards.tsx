import { ButtonBase, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";

import type { CampaignChronicleEntry } from "@/features/campaigns";

type SessionChronicleCardsProps = {
  entries: CampaignChronicleEntry[];
};

function buildPreview(content: string): string {
  const trimmed = content.trim();

  if (trimmed.length <= 220) {
    return trimmed;
  }

  return `${trimmed.slice(0, 220).trimEnd()}...`;
}

export function SessionChronicleCards({ entries }: SessionChronicleCardsProps) {
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);

  if (entries.length === 0) {
    return (
      <Typography color="text.secondary">No chronicle entries are linked to this session yet.</Typography>
    );
  }

  return (
    <Stack spacing={1.25}>
      {entries.map((entry) => {
        const expanded = expandedEntryId === entry.id;

        return (
          <ButtonBase
            key={entry.id}
            onClick={() => setExpandedEntryId(expanded ? null : entry.id)}
            sx={{ borderRadius: 1.5, display: "block", textAlign: "left", width: "100%" }}
          >
            <Paper
              sx={(theme) => ({
                p: expanded ? 2 : 1.5,
                transition: theme.transitions.create(["padding", "transform"], {
                  duration: theme.transitions.duration.shorter,
                }),
                transform: expanded ? "scale(1.01)" : "scale(1)",
              })}
              variant="outlined"
            >
              <Stack spacing={0.75}>
                <Typography sx={{ fontWeight: 700 }}>{entry.title}</Typography>
                <Typography color="text.secondary" variant="body2">
                  {expanded ? entry.content : buildPreview(entry.content)}
                </Typography>
              </Stack>
            </Paper>
          </ButtonBase>
        );
      })}
    </Stack>
  );
}
