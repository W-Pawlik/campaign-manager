import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";

import type { Open5eResourceDetails } from "@/features/monsters/model/monster.types";

type Open5eResourceDetailsDialogProps = {
  onClose: () => void;
  onImport?: () => void;
  open: boolean;
  resource: Open5eResourceDetails | null;
};

function renderJson(value: unknown): string {
  if (value === null || value === undefined) {
    return "No normalized data available.";
  }

  return JSON.stringify(value, null, 2);
}

export function Open5eResourceDetailsDialog({
  onClose,
  onImport,
  open,
  resource,
}: Open5eResourceDetailsDialogProps) {
  return (
    <Dialog fullWidth maxWidth="lg" onClose={onClose} open={open}>
      <DialogTitle>{resource?.name ?? "Open5e resource details"}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Typography color="text.secondary">
            {resource?.sourceDocumentName ?? "Open5e"} · cached {resource?.cachedAt ?? "N/A"}
          </Typography>
          <Typography
            component="pre"
            sx={{ bgcolor: "background.default", borderRadius: 2, overflowX: "auto", p: 2, whiteSpace: "pre-wrap" }}
            variant="body2"
          >
            {renderJson(resource?.normalizedData)}
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Close</Button>
        {onImport ? (
          <Button onClick={onImport} variant="contained">
            Import to campaign
          </Button>
        ) : null}
      </DialogActions>
    </Dialog>
  );
}
