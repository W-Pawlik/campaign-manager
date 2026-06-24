import { Box, Divider, Stack, Typography } from "@mui/material";

import type { MonsterStatblockEntry } from "@/features/monsters/ui/monsterCatalog.utils";

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
        bgcolor: "rgba(35, 24, 19, 0.08)",
        borderRadius: 2,
        p: 2,
      }}
    >
      <Typography sx={{ fontFamily: '"Georgia", "Times New Roman", serif' }} variant="h6">
        {title}
      </Typography>

      {entries.length === 0 ? (
        <Typography sx={{ mt: 1.5 }} variant="body2">
          {emptyMessage}
        </Typography>
      ) : (
        <Stack divider={<Divider flexItem sx={{ borderColor: "rgba(35, 24, 19, 0.12)" }} />} spacing={1.5} sx={{ mt: 1.5 }}>
          {entries.map((entry) => (
            <Stack key={`${title}-${entry.name}-${entry.subtitle ?? "base"}`} spacing={0.75}>
              <Typography sx={{ fontWeight: 700 }} variant="body1">
                {entry.name}
              </Typography>
              {entry.subtitle ? (
                <Typography sx={{ color: "rgba(35, 24, 19, 0.64)" }} variant="caption">
                  {entry.subtitle}
                </Typography>
              ) : null}
              <Typography sx={{ lineHeight: 1.7, whiteSpace: "pre-line" }} variant="body2">
                {entry.description ?? "No description available."}
              </Typography>
            </Stack>
          ))}
        </Stack>
      )}
    </Box>
  );
}
