import { Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

import { authHeroContent } from "@/features/auth/ui/authContent";

export function AuthHeroPanel() {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: { xs: 420, md: 520, lg: "100%" },
        position: "relative",
      }}
    >
      <Box
        sx={{
          backgroundImage:
            "linear-gradient(180deg, rgba(4, 11, 21, 0.18) 0%, rgba(8, 11, 16, 0.38) 42%, rgba(8, 10, 14, 0.9) 100%), url('/images/signInPageImage2.webp')",
          backgroundPosition: { xs: "center top", lg: "center center" },
          backgroundSize: "cover",
          inset: 0,
          position: "absolute",
        }}
      />

      <Box
        sx={{
          background: (theme) =>
            `radial-gradient(circle at 0% 45%, ${alpha(theme.palette.primary.main, 0.35)} 0%, ${alpha(
              theme.palette.primary.main,
              0,
            )} 34%), linear-gradient(180deg, rgba(8, 10, 14, 0.08) 0%, rgba(8, 10, 14, 0.28) 100%)`,
          inset: 0,
          position: "absolute",
        }}
      />

      <Stack
        spacing={3}
        sx={{
          justifyContent: "space-between",
          p: { xs: 3, md: 4, lg: 5 },
          position: "relative",
          width: "100%",
          zIndex: 1,
        }}
      >
        <Stack spacing={2} sx={{ maxWidth: 400 }}>
          <Typography
            sx={{
              color: "#f8f9fb",
              fontFamily: '"Cinzel", "Times New Roman", serif',
              fontSize: { xs: "3rem", md: "4.2rem" },
              letterSpacing: "0.04em",
              lineHeight: 0.96,
              textShadow: "0 12px 30px rgba(0, 0, 0, 0.48)",
            }}
          >
            {authHeroContent.brand}
          </Typography>
          <Typography
            sx={{
              color: "rgba(240, 243, 247, 0.92)",
              fontSize: { xs: "1rem", md: "1.18rem" },
              lineHeight: 1.6,
              textShadow: "0 8px 18px rgba(0, 0, 0, 0.38)",
            }}
          >
            {authHeroContent.description}
          </Typography>
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{
            alignItems: "center",
            color: "#f2f4f8",
            justifyContent: { xs: "flex-start", sm: "center" },
            textShadow: "0 5px 14px rgba(0, 0, 0, 0.52)",
          }}
        >
          {authHeroContent.highlights.map((item) => (
            <Typography
              key={item}
              sx={{
                fontSize: { xs: "1.06rem", md: "1.18rem" },
                fontWeight: 700,
                letterSpacing: "0.04em",
                textAlign: "center",
              }}
            >
              {item}
            </Typography>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
