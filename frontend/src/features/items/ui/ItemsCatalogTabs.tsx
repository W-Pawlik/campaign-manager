import { Tab, Tabs } from "@mui/material";

import type { ItemsCatalogTab } from "@/features/items/model/item.types";

type ItemsCatalogTabsProps = {
  activeTab: ItemsCatalogTab;
  onChange: (tab: ItemsCatalogTab) => void;
};

export function ItemsCatalogTabs({ activeTab, onChange }: ItemsCatalogTabsProps) {
  return (
    <Tabs value={activeTab} onChange={(_event, value: ItemsCatalogTab) => onChange(value)}>
      <Tab label="General items" value="general" />
      <Tab label="Magic items" value="magic" />
      <Tab label="Community items" value="community" />
    </Tabs>
  );
}
