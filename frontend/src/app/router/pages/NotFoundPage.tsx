import { Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { appPaths } from "@/app/router/paths";
import { EmptyState } from "@/shared/components";

export function NotFoundPage() {
  return (
    <Stack sx={{ minHeight: "100vh", justifyContent: "center", px: 2 }}>
      <EmptyState
        title="Page not found"
        description="The requested route is not available in this frontend shell."
        action={
          <Button component={RouterLink} to={appPaths.home} variant="contained">
            Go home
          </Button>
        }
      >
        <Typography variant="caption" color="text.secondary">
          Error 404
        </Typography>
      </EmptyState>
    </Stack>
  );
}
