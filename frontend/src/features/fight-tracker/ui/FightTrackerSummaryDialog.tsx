import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

import type { FightEncounterSummary } from "@/features/fight-tracker/model/fightTracker.types";

type FightTrackerSummaryDialogProps = {
  onClose: () => void;
  open: boolean;
  summary: FightEncounterSummary | null;
};

export function FightTrackerSummaryDialog({
  onClose,
  open,
  summary,
}: FightTrackerSummaryDialogProps) {
  return (
    <Dialog fullWidth maxWidth="sm" onClose={onClose} open={open}>
      <DialogTitle>Combat summary</DialogTitle>
      <DialogContent dividers>
        {summary ? (
          <Stack spacing={2}>
            <Stack spacing={0.45}>
              <Typography
                sx={{
                  color: "#f3e0b5",
                  fontFamily: '"Georgia", "Times New Roman", serif',
                  fontSize: "2rem",
                  lineHeight: 1,
                }}
              >
                {summary.encounterName}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {summary.environmentName}
              </Typography>
              <Typography color="text.secondary" variant="caption">
                Finished {summary.finishedAtLabel}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
              <Chip label={summary.outcomeLabel} size="small" />
              <Chip label={`${summary.roundsCompleted} rounds`} size="small" variant="outlined" />
              <Chip label={summary.durationLabel} size="small" variant="outlined" />
              <Chip
                label={`${summary.combatantCount} combatants`}
                size="small"
                variant="outlined"
              />
            </Stack>

            <Stack spacing={1}>
              <Typography variant="h6">Highlights</Typography>
              {summary.highlights.map((highlight) => (
                <Box
                  key={highlight}
                  sx={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 2,
                    px: 1.3,
                    py: 1.1,
                  }}
                >
                  <Typography color="text.secondary" variant="body2">
                    {highlight}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Stack>
        ) : null}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
