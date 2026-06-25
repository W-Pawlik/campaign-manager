import { Box, Chip, Stack, Typography } from "@mui/material";

import type { CampaignDetails } from "@/features/campaigns/model/campaign.types";

type CampaignOverviewHeaderProps = {
  campaign: CampaignDetails;
};

export function CampaignOverviewHeader({ campaign }: CampaignOverviewHeaderProps) {
  const description = campaign.description
    ? campaign.description
    : "Your campaign workspace is ready. Sessions, characters, notes, and quests will live here.";

  const details = [
    campaign.startingLevel ? `Starting level ${campaign.startingLevel}` : null,
    campaign.worldName ?? null,
    campaign.defaultLanguage ?? null,
  ].filter((value): value is string => Boolean(value));

  return (
    <Box
      sx={{
        mr: { xs: "-16px", md: "-16px" },
        mt: { xs: "-16px", md: "-20px" },
        minHeight: { xs: 220, md: 290 },
        overflow: "hidden",
        position: "relative",
        "&::before": {
          background:
            "radial-gradient(circle at 88% 12%, rgba(143, 82, 46, 0.28), transparent 28%), linear-gradient(180deg, rgba(10, 12, 18, 0.04) 0%, rgba(10, 12, 18, 0) 42%, rgba(10, 12, 18, 0.22) 100%)",
          content: '""',
          inset: 0,
          pointerEvents: "none",
          position: "absolute",
          zIndex: 0,
        },
        "&::after": {
          backgroundImage: `
            linear-gradient(270deg, rgba(10, 12, 18, 0) 0%, rgba(10, 12, 18, 0.03) 16%, rgba(10, 12, 18, 0.2) 34%, rgba(10, 12, 18, 0.58) 54%, rgba(10, 12, 18, 0.86) 71%, rgba(10, 12, 18, 0.96) 82%, rgba(10, 12, 18, 1) 100%),
            linear-gradient(180deg, rgba(10, 12, 18, 0) 0%, rgba(10, 12, 18, 0.08) 60%, rgba(10, 12, 18, 0.48) 100%),
            url('/images/campaignImageBackgorundOverview.jpg')
          `,
          backgroundPosition: "right top",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          content: '""',
          height: "100%",
          maskImage:
            "linear-gradient(270deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.98) 18%, rgba(0, 0, 0, 0.9) 34%, rgba(0, 0, 0, 0.55) 58%, rgba(0, 0, 0, 0.14) 78%, rgba(0, 0, 0, 0) 100%)",
          WebkitMaskImage:
            "linear-gradient(270deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.98) 18%, rgba(0, 0, 0, 0.9) 34%, rgba(0, 0, 0, 0.55) 58%, rgba(0, 0, 0, 0.14) 78%, rgba(0, 0, 0, 0) 100%)",
          opacity: 0.95,
          pointerEvents: "none",
          position: "absolute",
          right: 0,
          top: 0,
          width: { xs: "76%", md: "54%" },
          zIndex: 0,
        },
      }}
    >
      <Stack
        spacing={2}
        sx={{
          maxWidth: { xs: "100%", md: "52%" },
          px: { xs: 0.5, md: 1 },
          py: { xs: 1.5, md: 3 },
          position: "relative",
          zIndex: 1,
        }}
      >
        <Stack spacing={1}>
          <Typography
            component="h1"
            sx={{
              color: "#fff5e5",
              fontSize: { xs: "2.4rem", md: "4.1rem" },
              letterSpacing: "-0.05em",
              lineHeight: 0.95,
            }}
            variant="h3"
          >
            {campaign.name}
          </Typography>
          <Typography
            color="text.secondary"
            sx={{
              fontSize: { xs: "1rem", md: "1.25rem" },
              maxWidth: 720,
            }}
            variant="body1"
          >
            {description}
          </Typography>
        </Stack>

        {details.length > 0 ? (
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
            {details.map((item) => (
              <Chip
                key={item}
                label={item}
                sx={{
                  backdropFilter: "blur(10px)",
                  bgcolor: "rgba(18, 21, 29, 0.46)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "text.primary",
                }}
              />
            ))}
          </Stack>
        ) : null}
      </Stack>
    </Box>
  );
}
