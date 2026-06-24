import { Tab, Tabs } from "@mui/material";

export type MonsterCatalogSource = "open5e" | "community";

type MonsterCatalogSourceTabsProps = {
  activeSource: MonsterCatalogSource;
  onChange: (source: MonsterCatalogSource) => void;
};

export function MonsterCatalogSourceTabs({
  activeSource,
  onChange,
}: MonsterCatalogSourceTabsProps) {
  return (
    <Tabs
      value={activeSource}
      onChange={(_event, value: MonsterCatalogSource) => onChange(value)}
    >
      <Tab
        label="Open5e Compendium"
        value="open5e"
      />
      <Tab
        label="Community Monsters"
        value="community"
      />
    </Tabs>
  );
}
