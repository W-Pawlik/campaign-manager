import { Icon } from "@iconify/react";

export type CampaignWorkspaceIconKey =
  | "overview"
  | "sessions"
  | "characters"
  | "quests"
  | "chronicle"
  | "notes"
  | "npcs"
  | "locations"
  | "monsters"
  | "items"
  | "members"
  | "settings";

const iconByKey: Record<CampaignWorkspaceIconKey, string> = {
  overview: "solar:widget-5-bold",
  sessions: "mingcute:calendar-fill",
  characters: "game-icons:crested-helmet",
  quests: "temaki:info-board",
  chronicle: "mdi:book-open-page-variant",
  notes: "streamline-plump:feather-pen-solid",
  npcs: "streamline-sharp:theater-mask-solid",
  locations: "mdi:location",
  monsters: "game-icons:dragon-head",
  items: "mdi:treasure-chest",
  members: "tdesign:member-filled",
  settings: "material-symbols:settings-rounded",
};

type CampaignWorkspaceIconProps = {
  icon: CampaignWorkspaceIconKey;
  size?: number;
};

export function CampaignWorkspaceIcon({ icon, size = 22 }: CampaignWorkspaceIconProps) {
  return <Icon icon={iconByKey[icon]} style={{ fontSize: size }} />;
}
