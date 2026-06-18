import { Box, Paper } from "@mui/material";
import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        p: 2,
      }}
    >
      <Paper sx={{ maxWidth: 460, p: { xs: 3, md: 4 }, width: "100%" }}>
        <Outlet />
      </Paper>
    </Box>
  );
}
