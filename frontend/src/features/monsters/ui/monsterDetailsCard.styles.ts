import type { SxProps, Theme } from "@mui/material";

import monsterCardBackground from "@/assets/MonsterCardBackground.png";

export const monsterDetailsColors = {
  bodyText: "#3b281d",
  creamText: "#f4e7c8",
  headerBg: "#2f1b18",
  line: "rgba(104, 43, 36, 0.28)",
  softLine: "rgba(104, 43, 36, 0.18)",
  sectionLabel: "#8f1d1d",
  statNumber: "#6f1418",
  statSurface: "rgba(255, 250, 241, 0.78)",
};

export const monsterDetailsDialogSx: SxProps<Theme> = {
  "& .MuiDialog-paper": {
    bgcolor: "background.paper",
    overflow: "hidden",
  },
};

export const monsterDetailsContentSx: SxProps<Theme> = {
  backgroundColor: "#d8c19a",
  backgroundImage: `url(${monsterCardBackground})`,
  backgroundPosition: "top left",
  backgroundRepeat: "repeat",
  backgroundSize: "auto",
};
