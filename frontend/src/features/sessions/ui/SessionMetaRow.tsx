import { Icon } from "@iconify/react";
import { Stack, Typography } from "@mui/material";

import type { CampaignSessionListItem } from "@/features/campaigns";
import {
  formatSessionDate,
  formatSessionTime,
  getSessionChronicleLabel,
  getSessionLocationLabel,
} from "@/features/sessions/ui/sessionUi.utils";

type SessionMetaRowProps = {
  session: CampaignSessionListItem;
  variant?: "default" | "compact";
};

export function SessionMetaRow({ session, variant = "default" }: SessionMetaRowProps) {
  const iconSize = variant === "compact" ? 16 : 18;
  const typographyVariant = variant === "compact" ? "body2" : "body1";

  const items = [
    {
      icon: "solar:calendar-mark-bold",
      label: formatSessionDate(session.scheduledStartAt),
    },
    {
      icon: "solar:clock-circle-bold",
      label: formatSessionTime(session.scheduledStartAt),
    },
    {
      icon: "mdi:map-marker",
      label: getSessionLocationLabel(session),
    },
    {
      icon: "mdi:book-open-page-variant",
      label: getSessionChronicleLabel(session),
    },
  ];

  return (
    <Stack direction="row" spacing={{ xs: 1.5, md: 2.5 }} sx={{ flexWrap: "wrap", rowGap: 1.25 }}>
      {items.map((item) => (
        <Stack
          direction="row"
          key={`${session.id}-${item.icon}`}
          spacing={0.75}
          sx={{ alignItems: "center", color: "#d5ae70" }}
        >
          <Icon icon={item.icon} style={{ fontSize: iconSize }} />
          <Typography color="inherit" variant={typographyVariant}>
            {item.label}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}
