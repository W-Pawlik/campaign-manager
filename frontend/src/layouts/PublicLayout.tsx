import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";

import { fantasyTokens } from "@/shared/theme";

export function PublicLayout() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 3, md: 5 },
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: fantasyTokens.layout.contentMaxWidth }}>
        <Outlet />
      </Container>
    </Box>
  );
}
