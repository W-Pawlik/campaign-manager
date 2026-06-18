import { Box, CircularProgress } from "@mui/material";

type LoadingScreenProps = {
  minHeight?: number | string;
};

export function LoadingScreen({ minHeight = "100vh" }: LoadingScreenProps) {
  return (
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        minHeight,
      }}
    >
      <CircularProgress />
    </Box>
  );
}
