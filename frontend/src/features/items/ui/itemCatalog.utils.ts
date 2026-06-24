import type {
  ItemTemplateDetails,
  Open5eCatalogItemListItem,
  Open5eItemDetails,
  PublishedItemCatalogListItem,
} from "@/features/items/model/item.types";

export type ItemCatalogListEntry = Open5eCatalogItemListItem | PublishedItemCatalogListItem;
export type ItemCatalogDetailsEntry = Open5eItemDetails | ItemTemplateDetails;

function isOpen5eCatalogListItem(item: ItemCatalogListEntry): item is Open5eCatalogItemListItem {
  return "key" in item;
}

export function isOpen5eCatalogItem(item: ItemCatalogListEntry): item is Open5eCatalogItemListItem {
  return isOpen5eCatalogListItem(item);
}

export function isOpen5eItemDetails(
  item: ItemCatalogListEntry | ItemCatalogDetailsEntry,
): item is Open5eItemDetails {
  return "provider" in item && "cachedAt" in item;
}

export function getItemTypeLabel(item: ItemCatalogListEntry | ItemCatalogDetailsEntry): string | null {
  if (isOpen5eItemDetails(item)) {
    return item.normalizedData?.type ?? null;
  }

  if (isOpen5eCatalogListItem(item)) {
    return item.metadata?.itemType ?? null;
  }

  return item.type ?? null;
}

export function getItemRarityLabel(item: ItemCatalogListEntry | ItemCatalogDetailsEntry): string | null {
  if (isOpen5eItemDetails(item)) {
    return item.normalizedData?.rarity ?? null;
  }

  if (isOpen5eCatalogListItem(item)) {
    return item.metadata?.rarity ?? null;
  }

  return item.rarity ?? null;
}

export function getItemWeight(item: ItemCatalogListEntry | ItemCatalogDetailsEntry): number | null {
  if (isOpen5eItemDetails(item)) {
    return item.normalizedData?.weight ?? null;
  }

  if (isOpen5eCatalogListItem(item)) {
    return item.metadata?.weight ?? null;
  }

  return item.weight ?? null;
}

export function getItemValueLabel(item: ItemCatalogListEntry | ItemCatalogDetailsEntry): string | null {
  const amount =
    isOpen5eItemDetails(item)
      ? item.normalizedData?.valueAmount ?? null
      : isOpen5eCatalogListItem(item)
        ? item.metadata?.valueAmount ?? null
        : item.valueAmount ?? null;
  const currency =
    isOpen5eItemDetails(item)
      ? item.normalizedData?.valueCurrency ?? null
      : isOpen5eCatalogListItem(item)
        ? item.metadata?.valueCurrency ?? null
        : item.valueCurrency ?? null;

  if (amount === null || amount === undefined) {
    return null;
  }

  return `${amount}${currency ? ` ${currency}` : ""}`;
}

export function getItemSourceLabel(item: ItemCatalogListEntry | ItemCatalogDetailsEntry): string {
  if (isOpen5eItemDetails(item)) {
    return item.sourceDocumentName ?? "Open5e source";
  }

  if (isOpen5eCatalogListItem(item)) {
    return item.sourceDocumentName ?? "Open5e source";
  }

  return item.createdById ? "Published by a community creator" : "Published item";
}

export function getItemDescription(item: ItemCatalogListEntry | ItemCatalogDetailsEntry): string | null {
  if (isOpen5eItemDetails(item)) {
    return item.normalizedData?.description ?? null;
  }

  if (isOpen5eCatalogListItem(item)) {
    return null;
  }

  return item.description;
}

export function getIsMagical(item: ItemCatalogListEntry | ItemCatalogDetailsEntry): boolean {
  if (isOpen5eItemDetails(item)) {
    return item.normalizedData?.isMagical ?? item.resourceType === "MAGIC_ITEM";
  }

  if (isOpen5eCatalogListItem(item)) {
    return item.metadata?.isMagical ?? item.resourceType === "MAGIC_ITEM";
  }

  return item.isMagical;
}

export function formatLabel(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  return value.replaceAll("_", " ").replaceAll("-", " ");
}
