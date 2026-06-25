import { Icon } from "@iconify/react";
import { Box, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

import type { CampaignCharacterListItem } from "@/features/campaigns";
import type { CampaignCharacterDetails } from "@/features/characters/model/character.types";
import { getCharacterSubtitle } from "@/features/characters/ui/characterUi.utils";

type CharacterSidePanelsProps = {
  characters: CampaignCharacterListItem[];
  selectedCharacter: CampaignCharacterDetails | null;
};

export function CharacterSidePanels({ characters, selectedCharacter }: CharacterSidePanelsProps) {
  const recentCharacters = [...characters]
    .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
    .slice(0, 3);

  return (
    <Stack spacing={2}>
      <PanelCard icon="streamline-plump:feather-pen-solid" title="GM quick notes">
        <Typography color="text.secondary" variant="body2">
          {selectedCharacter?.backstory?.trim()
            ? selectedCharacter.backstory.slice(0, 180)
            : "Capture hooks, secrets, or future scene ideas for the currently selected character."}
        </Typography>
      </PanelCard>

      <PanelCard icon="solar:history-bold" title="Recently edited">
        <Stack spacing={1.25}>
          {recentCharacters.map((character) => (
            <Stack direction="row" key={character.id} spacing={1.1} sx={{ alignItems: "center" }}>
              <Box
                sx={{
                  bgcolor: "rgba(216, 176, 112, 0.08)",
                  border: "1px solid rgba(216, 176, 112, 0.16)",
                  borderRadius: "50%",
                  height: 42,
                  overflow: "hidden",
                  width: 42,
                }}
              >
                {character.avatarUrl ? (
                  <Box
                    alt={character.name}
                    component="img"
                    src={character.avatarUrl}
                    sx={{ display: "block", height: "100%", objectFit: "cover", width: "100%" }}
                  />
                ) : (
                  <Box
                    sx={{
                      alignItems: "center",
                      display: "flex",
                      height: "100%",
                      justifyContent: "center",
                    }}
                  >
                    <Icon
                      icon="game-icons:crested-helmet"
                      style={{ color: "#d8b070", fontSize: 18 }}
                    />
                  </Box>
                )}
              </Box>
              <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                <Typography sx={{ color: "#f2e1bf" }} variant="body2">
                  {character.name}
                </Typography>
                <Typography color="text.secondary" variant="caption">
                  {getCharacterSubtitle(character)}
                </Typography>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </PanelCard>
    </Stack>
  );
}

function PanelCard({
  children,
  icon,
  title,
}: {
  children: ReactNode;
  icon: string;
  title: string;
}) {
  return (
    <Box
      sx={{
        background:
          "linear-gradient(180deg, rgba(18, 21, 29, 0.96) 0%, rgba(12, 15, 20, 0.98) 100%)",
        border: "1px solid rgba(188, 128, 52, 0.16)",
        borderRadius: 2.5,
        p: 2,
      }}
    >
      <Stack spacing={1.4}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Icon icon={icon} style={{ color: "#d8b070", fontSize: 18 }} />
          <Typography sx={{ color: "#f2e1bf" }} variant="h6">
            {title}
          </Typography>
        </Stack>
        {children}
      </Stack>
    </Box>
  );
}
