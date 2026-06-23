import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <Box sx={{ minHeight: "100vh", width: "100%" }}>
        <Outlet />
      </Box>
    </Box>
  );
}
