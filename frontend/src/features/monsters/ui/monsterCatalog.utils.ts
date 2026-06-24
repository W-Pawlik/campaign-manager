import type {
  Open5eCatalogCreatureListItem,
  Open5eCreatureNormalizedData,
  PublishedMonsterCatalogListItem,
} from "@/features/monsters/model/monster.types";

export type MonsterStatblockEntry = {
  description: string | null;
  name: string;
  subtitle?: string | null;
};

export type MonsterCatalogListEntry =
  | Open5eCatalogCreatureListItem
  | PublishedMonsterCatalogListItem;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

export function isOpen5eCatalogItem(item: MonsterCatalogListEntry): item is Open5eCatalogCreatureListItem {
  return "key" in item && !("id" in item);
}

export function getCatalogItemCrLabel(item: MonsterCatalogListEntry): string | null {
  if (isOpen5eCatalogItem(item)) {
    const challengeRating = item.metadata?.challengeRating;

    return typeof challengeRating === "string" && challengeRating.length > 0
      ? challengeRating
      : null;
  }

  return item.challengeRating;
}

export function getCatalogItemTypeLabel(item: MonsterCatalogListEntry): string | null {
  if (isOpen5eCatalogItem(item)) {
    const creatureType = item.metadata?.creatureType;

    return typeof creatureType === "string" && creatureType.length > 0
      ? creatureType
      : null;
  }

  return item.type;
}

export function getCatalogItemSizeLabel(item: MonsterCatalogListEntry): string | null {
  if (isOpen5eCatalogItem(item)) {
    const size = item.metadata?.size;

    return typeof size === "string" && size.length > 0 ? size : null;
  }

  return item.size;
}

export function getCatalogItemSourceLabel(item: MonsterCatalogListEntry): string {
  if (isOpen5eCatalogItem(item)) {
    return item.sourceDocumentName ?? "Open5e creature";
  }

  return item.source === "CUSTOM" ? "Community creation" : item.source;
}

export function getCatalogItemImageUrl(item: MonsterCatalogListEntry): string | null {
  if (isOpen5eCatalogItem(item)) {
    return item.illustrationUrl ?? null;
  }

  return null;
}

export function getOpen5eIllustrationUrl(
  normalizedData: Open5eCreatureNormalizedData | undefined,
  topLevelIllustrationUrl?: string | null,
): string | null {
  if (typeof topLevelIllustrationUrl === "string" && topLevelIllustrationUrl.length > 0) {
    return topLevelIllustrationUrl;
  }

  const illustrationUrl = normalizedData?.illustrationUrl;

  return typeof illustrationUrl === "string" && illustrationUrl.length > 0
    ? illustrationUrl
    : null;
}

export function getRenderableText(value: unknown, fallback = "N/A"): string {
  if (value === null || value === undefined) {
    return fallback;
  }

  if (typeof value === "string") {
    return value.trim().length > 0 ? value : fallback;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.length > 0 ? JSON.stringify(value, null, 2) : fallback;
  }

  if (isRecord(value)) {
    return Object.keys(value).length > 0 ? JSON.stringify(value, null, 2) : fallback;
  }

  return fallback;
}

export function formatSpeed(value: unknown): string {
  if (!isRecord(value)) {
    return getRenderableText(value);
  }

  const unit = typeof value.unit === "string" && value.unit.length > 0 ? value.unit : "ft.";
  const segments: string[] = [];
  const movementLabels: Array<[key: string, label: string]> = [
    ["walk", ""],
    ["fly", "fly"],
    ["swim", "swim"],
    ["climb", "climb"],
    ["burrow", "burrow"],
    ["crawl", "crawl"],
  ];

  for (const [key, label] of movementLabels) {
    const movementValue = value[key];

    if (typeof movementValue === "number" && movementValue > 0) {
      segments.push(label.length > 0 ? `${label} ${movementValue} ${unit}` : `${movementValue} ${unit}`);
    }
  }

  if (value.hover === true) {
    segments.push("hover");
  }

  return segments.length > 0 ? segments.join(", ") : "N/A";
}

function formatActionType(value: unknown): string | null {
  if (typeof value !== "string" || value.trim().length === 0) {
    return null;
  }

  return value
    .toLowerCase()
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function formatUsageLimits(value: unknown): string | null {
  if (!isRecord(value) || typeof value.type !== "string") {
    return null;
  }

  const param = typeof value.param === "number" ? value.param : null;

  switch (value.type) {
    case "PER_DAY":
      return param === null ? "Per day" : `${param}/day`;
    case "RECHARGE_ON_ROLL":
      return param === null ? "Recharge" : `Recharge ${param}-6`;
    default:
      return formatActionType(value.type);
  }
}

function toStatblockEntry(value: unknown): MonsterStatblockEntry | null {
  if (!isRecord(value)) {
    return null;
  }

  const name = typeof value.name === "string" && value.name.trim().length > 0 ? value.name : null;

  if (name === null) {
    return null;
  }

  const parts = [
    formatActionType(value.action_type),
    formatUsageLimits(value.usage_limits),
    typeof value.legendary_action_cost === "number" && value.legendary_action_cost > 1
      ? `Cost ${value.legendary_action_cost}`
      : null,
  ].filter((segment): segment is string => segment !== null);

  return {
    description:
      typeof value.desc === "string" && value.desc.trim().length > 0 ? value.desc.trim() : null,
    name,
    subtitle: parts.length > 0 ? parts.join(" | ") : null,
  };
}

export function getStatblockEntries(value: unknown): MonsterStatblockEntry[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry) => {
    const mappedEntry = toStatblockEntry(entry);

    return mappedEntry === null ? [] : [mappedEntry];
  });
}

export function createMonsterFallbackImage(name: string): string {
  const safeName = name.replace(/[<&>"]/g, "");
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#17120f"/>
          <stop offset="55%" stop-color="#2f241d"/>
          <stop offset="100%" stop-color="#a67b3d"/>
        </linearGradient>
        <linearGradient id="sheet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f8f1e5"/>
          <stop offset="100%" stop-color="#ead4a8"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="900" fill="url(#bg)"/>
      <rect x="52" y="50" width="780" height="105" rx="8" fill="#0f0f11"/>
      <rect x="54" y="180" width="900" height="610" rx="18" fill="url(#sheet)" opacity="0.96"/>
      <path d="M730 180h224l170 610H870z" fill="#f5ede0" opacity="0.88"/>
      <circle cx="890" cy="430" r="150" fill="#3c2f26" opacity="0.18"/>
      <path d="M845 558c29-127 61-233 160-304 39-28 95-50 139-41-36 20-69 54-91 88 41 2 70 17 85 34-53 8-104 34-145 68 18 1 43 10 63 23-55 12-114 51-146 110-24 44-33 85-46 120-20-38-29-70-19-98z" fill="#2a1b16" opacity="0.9"/>
      <text x="96" y="120" font-family="Georgia, serif" font-size="68" fill="#fff7eb">${safeName}</text>
      <text x="102" y="272" font-family="Georgia, serif" font-size="40" fill="#32251d">Illustration unavailable</text>
      <text x="102" y="336" font-family="Georgia, serif" font-size="26" fill="#6f5a46">Open the card to inspect the full statblock.</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
