import { Box, Divider, Stack, Typography } from "@mui/material";

import type { MonsterStatblockEntry } from "@/features/monsters/ui/monsterCatalog.utils";
import { monsterDetailsColors } from "@/features/monsters/ui/monsterDetailsCard.styles";

type MonsterStatblockEntriesProps = {
  emptyMessage: string;
  entries: MonsterStatblockEntry[];
  title: string;
};

export function MonsterStatblockEntries({
  emptyMessage,
  entries,
  title,
}: MonsterStatblockEntriesProps) {
  return (
    <Box
      sx={{
        borderBottom: `1px solid ${monsterDetailsColors.softLine}`,
        borderTop: `2px solid ${monsterDetailsColors.line}`,
        py: 1.5,
      }}
    >
      <Typography
        sx={{
          color: monsterDetailsColors.sectionLabel,
          fontFamily: '"Georgia", "Times New Roman", serif',
          fontWeight: 700,
          textTransform: "uppercase",
        }}
        variant="h6"
      >
        {title}
      </Typography>

      {entries.length === 0 ? (
        <Typography sx={{ color: "text.secondary", mt: 1.5 }} variant="body2">
          {emptyMessage}
        </Typography>
      ) : (
        <Stack
          divider={<Divider flexItem sx={{ borderColor: monsterDetailsColors.softLine }} />}
          spacing={1.5}
          sx={{ mt: 1.5 }}
        >
          {entries.map((entry) => (
            <Stack key={`${title}-${entry.name}-${entry.subtitle ?? "base"}`} spacing={0.75}>
              <Typography sx={{ lineHeight: 1.55 }} variant="body2">
                <Box component="span" sx={{ fontStyle: "italic", fontWeight: 700, mr: 0.75 }}>
                  {entry.name}.
                </Box>
                {entry.description ?? "No description available."}
              </Typography>
              {entry.subtitle ? (
                <Typography sx={{ color: "text.secondary" }} variant="caption">
                  {entry.subtitle}
                </Typography>
              ) : null}
            </Stack>
          ))}
        </Stack>
      )}
    </Box>
  );
}
