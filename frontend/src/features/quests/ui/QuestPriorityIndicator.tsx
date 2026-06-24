import { Box, Stack, Typography } from "@mui/material";

import type { QuestPriority } from "@/features/quests/model/quest.types";

const priorityLevelMap: Record<QuestPriority, number> = {
  LOW: 1,
  NORMAL: 2,
  HIGH: 3,
  CRITICAL: 4,
};

type QuestPriorityIndicatorProps = {
  priority: string;
};

export function QuestPriorityIndicator({ priority }: QuestPriorityIndicatorProps) {
  const normalizedPriority = (priority in priorityLevelMap ? priority : "NORMAL") as QuestPriority;
  const activeStars = priorityLevelMap[normalizedPriority];

  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
      <Typography color="text.secondary" variant="body2">
        Priority:
      </Typography>
      <Stack direction="row" spacing={0.35} sx={{ alignItems: "center" }}>
        {Array.from({ length: 4 }, (_value, index) => (
          <Box
            key={index}
            sx={(theme) => ({
              width: 12,
              height: 12,
              borderRadius: "50%",
              color: index < activeStars ? theme.palette.primary.main : theme.palette.action.disabled,
              bgcolor: index < activeStars ? theme.palette.primary.main : theme.palette.action.disabled,
            })}
          />
        ))}
      </Stack>
      <Typography sx={{ fontWeight: 700 }} variant="body2">
        {activeStars}/4
      </Typography>
    </Stack>
  );
}
