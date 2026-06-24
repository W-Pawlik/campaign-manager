import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";

import type { Open5eResourceDetails } from "@/features/monsters/model/monster.types";
import { MonsterDetailsStatblock } from "@/features/monsters/ui/MonsterDetailsStatblock";
import {
  monsterDetailsContentSx,
  monsterDetailsDialogSx,
} from "@/features/monsters/ui/monsterDetailsCard.styles";
import {
  getSpeedEntries,
  getOpen5eIllustrationUrl,
  getRenderableText,
  getStatblockEntries,
} from "@/features/monsters/ui/monsterCatalog.utils";

type Open5eResourceDetailsDialogProps = {
  onClose: () => void;
  onImport?: () => void;
  open: boolean;
  resource: Open5eResourceDetails | null;
};

export function Open5eResourceDetailsDialog({
  onClose,
  onImport,
  open,
  resource,
}: Open5eResourceDetailsDialogProps) {
  const normalized = resource?.normalizedData;
  const illustrationUrl = getOpen5eIllustrationUrl(normalized, resource?.illustrationUrl ?? null);
  const sections = [
    {
      emptyMessage: "No passive features available.",
      entries: getStatblockEntries(normalized?.traits),
      title: "Traits",
    },
    {
      emptyMessage: "No actions available.",
      entries: getStatblockEntries(normalized?.actions),
      title: "Actions",
    },
  ].filter((section) => section.entries.length > 0);

  return (
    <Dialog fullWidth maxWidth="lg" onClose={onClose} open={open} sx={monsterDetailsDialogSx}>
      <DialogContent dividers sx={{ ...monsterDetailsContentSx, p: 0 }}>
        <MonsterDetailsStatblock
          abilities={[
            { label: "STR", value: getRenderableText(normalized?.strength) },
            { label: "DEX", value: getRenderableText(normalized?.dexterity) },
            { label: "CON", value: getRenderableText(normalized?.constitution) },
            { label: "INT", value: getRenderableText(normalized?.intelligence) },
            { label: "WIS", value: getRenderableText(normalized?.wisdom) },
            { label: "CHA", value: getRenderableText(normalized?.charisma) },
          ]}
          badges={[
            String(normalized?.type ?? "Unknown type"),
            String(normalized?.size ?? "Unknown size"),
            `CR ${String(normalized?.challengeRating ?? "?")}`,
          ]}
          description={
            typeof normalized?.description === "string" && normalized.description.length > 0
              ? normalized.description
              : "No creature description available."
          }
          imageAlt={resource?.name ?? "Open5e creature"}
          imageUrl={illustrationUrl}
          metaChips={[resource?.sourceDocumentName ?? "Open5e"].filter((value): value is string =>
            Boolean(value),
          )}
          name={resource?.name ?? "Open5e creature details"}
          secondaryRows={[
            { label: "Languages", value: getRenderableText(normalized?.languages) },
            { label: "Senses", value: getRenderableText(normalized?.senses) },
            { label: "Alignment", value: getRenderableText(normalized?.alignment) },
          ]}
          sections={sections}
          speedEntries={getSpeedEntries(normalized?.speed)}
          strongStats={[
            {
              label: "Armor Class",
              value: getRenderableText(normalized?.armorClass),
              detail: normalized?.armorClassDetails
                ? `(${normalized.armorClassDetails})`
                : null,
            },
            {
              label: "Hit Points",
              value: getRenderableText(normalized?.hitPoints),
              detail: normalized?.hitDice ? `(${normalized.hitDice})` : null,
            },
          ]}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Close</Button>
        {onImport ? (
          <Button onClick={onImport} variant="contained">
            Add to campaign
          </Button>
        ) : null}
      </DialogActions>
    </Dialog>
  );
}
