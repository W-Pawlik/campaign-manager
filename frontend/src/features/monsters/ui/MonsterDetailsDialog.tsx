import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";

import type { CampaignMonsterDetails } from "@/features/monsters/model/monster.types";
import { MonsterDetailsStatblock } from "@/features/monsters/ui/MonsterDetailsStatblock";
import {
  monsterDetailsContentSx,
  monsterDetailsDialogSx,
} from "@/features/monsters/ui/monsterDetailsCard.styles";
import {
  getSpeedEntries,
  getRenderableText,
  getStatblockEntries,
} from "@/features/monsters/ui/monsterCatalog.utils";

type MonsterDetailsDialogProps = {
  monster: CampaignMonsterDetails | null;
  onClose: () => void;
  open: boolean;
};

export function MonsterDetailsDialog({ monster, onClose, open }: MonsterDetailsDialogProps) {
  const sections = [
    {
      emptyMessage: "No passive features available.",
      entries: getStatblockEntries(monster?.traits),
      title: "Traits",
    },
    {
      emptyMessage: "No actions available.",
      entries: getStatblockEntries(monster?.actions),
      title: "Actions",
    },
    {
      emptyMessage: "No bonus actions available.",
      entries: getStatblockEntries(monster?.bonusActions),
      title: "Bonus Actions",
    },
    {
      emptyMessage: "No reactions available.",
      entries: getStatblockEntries(monster?.reactions),
      title: "Reactions",
    },
    {
      emptyMessage: "No legendary actions available.",
      entries: getStatblockEntries(monster?.legendaryActions),
      title: "Legendary Actions",
    },
    {
      emptyMessage: "No lair actions available.",
      entries: getStatblockEntries(monster?.lairActions),
      title: "Lair Actions",
    },
  ].filter((section) => section.entries.length > 0);

  return (
    <Dialog fullWidth maxWidth="lg" onClose={onClose} open={open} sx={monsterDetailsDialogSx}>
      <DialogContent dividers sx={{ ...monsterDetailsContentSx, p: 0 }}>
        <MonsterDetailsStatblock
          abilities={[
            { label: "STR", value: getRenderableText(monster?.abilities.strength) },
            { label: "DEX", value: getRenderableText(monster?.abilities.dexterity) },
            { label: "CON", value: getRenderableText(monster?.abilities.constitution) },
            { label: "INT", value: getRenderableText(monster?.abilities.intelligence) },
            { label: "WIS", value: getRenderableText(monster?.abilities.wisdom) },
            { label: "CHA", value: getRenderableText(monster?.abilities.charisma) },
          ]}
          badges={[
            monster?.type ?? "Unknown type",
            monster?.size ?? "Unknown size",
            `CR ${monster?.challengeRating ?? "?"}`,
          ]}
          description={monster?.description ?? "No description yet."}
          imageAlt={monster?.name ?? "Community monster"}
          imageUrl={null}
          metaChips={[
            monster?.source,
            monster?.visibility?.replace("_", " "),
            monster?.sourceBook,
          ].filter((value): value is string => Boolean(value))}
          name={monster?.name ?? "Monster details"}
          secondaryRows={[
            { label: "Alignment", value: getRenderableText(monster?.alignment) },
            { label: "Languages", value: getRenderableText(monster?.languages) },
            { label: "Senses", value: getRenderableText(monster?.senses) },
          ]}
          sections={sections}
          speedEntries={getSpeedEntries(monster?.speed)}
          strongStats={[
            {
              label: "Armor Class",
              value: getRenderableText(monster?.armorClass),
              detail: monster?.armorClassDetails ? `(${monster.armorClassDetails})` : null,
            },
            {
              label: "Hit Points",
              value: getRenderableText(monster?.hitPoints),
              detail: monster?.hitDice ? `(${monster.hitDice})` : null,
            },
          ]}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
