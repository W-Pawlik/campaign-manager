import { createTheme, type PaletteMode } from "@mui/material";

import { components } from "@/shared/theme/components";
import { createPalette } from "@/shared/theme/palette";
import { fantasyTokens } from "@/shared/theme/tokens";
import { typography } from "@/shared/theme/typography";

export function createAppTheme(mode: PaletteMode = "dark") {
  return createTheme({
    fantasyTokens,
    palette: createPalette(mode),
    shape: {
      borderRadius: fantasyTokens.radius.md,
    },
    spacing: 8,
    typography,
    components,
  });
}
