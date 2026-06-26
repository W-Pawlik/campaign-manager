import type { CampaignCharacterListItem } from "@/features/campaigns";
import type { CampaignCharacterDetails } from "@/features/characters/model/character.types";

export const characterTypeFilterOptions = [
  "ALL",
  "PLAYER_CHARACTER",
  "COMPANION",
  "TEMPORARY",
] as const;

export const characterSortOptions = ["UPDATED", "NAME", "LEVEL"] as const;

export type CharacterTypeFilterValue = (typeof characterTypeFilterOptions)[number];
export type CharacterSortValue = (typeof characterSortOptions)[number];
export type CharacterViewMode = "cards" | "list";

export function formatCharacterTypeLabel(type: string): string {
  switch (type) {
    case "PLAYER_CHARACTER":
      return "Player character";
    case "COMPANION":
      return "Companion";
    case "TEMPORARY":
      return "Temporary";
    default:
      return type.replaceAll("_", " ").toLowerCase();
  }
}

export function formatCharacterStatusLabel(status: string): string {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatCharacterSortLabel(sort: CharacterSortValue): string {
  switch (sort) {
    case "NAME":
      return "Name";
    case "LEVEL":
      return "Level";
    default:
      return "Last updated";
  }
}

export function getCharacterSubtitle(
  character: CampaignCharacterListItem | CampaignCharacterDetails,
): string {
  const parts = [
    character.characterClass,
    character.level ? `Level ${character.level}` : null,
    character.race,
  ].filter((value): value is string => Boolean(value));

  return parts.length > 0 ? parts.join(" • ") : "Unclassified adventurer";
}

export function getCharacterOwnerLabel(
  ownerUsername: string | null | undefined,
  ownerUserId: string | null,
): string {
  if (ownerUsername?.trim()) {
    return `@${ownerUsername}`;
  }

  return ownerUserId ?? "Unassigned";
}

export function getCharacterHitPointsText(character: CampaignCharacterDetails): string {
  if (character.currentHitPoints == null && character.maxHitPoints == null) {
    return "—";
  }

  return `${character.currentHitPoints ?? 0}/${character.maxHitPoints ?? 0}`;
}

export function getAbilityModifier(value: number | null): string {
  if (value == null) {
    return "—";
  }

  const modifier = Math.floor((value - 10) / 2);

  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

export function getCharacterSearchText(character: CampaignCharacterListItem): string {
  return [
    character.name,
    character.race,
    character.characterClass,
    character.level?.toString(),
    character.type,
    character.status,
    character.ownerUsername,
  ]
    .filter((value): value is string => Boolean(value))
    .join(" ")
    .toLowerCase();
}

export function isCharacterTypeFilterMatch(
  character: CampaignCharacterListItem,
  filter: CharacterTypeFilterValue,
): boolean {
  return filter === "ALL" ? true : character.type === filter;
}

export function sortCharacters(
  characters: CampaignCharacterListItem[],
  sort: CharacterSortValue,
): CampaignCharacterListItem[] {
  return [...characters].sort((left, right) => {
    if (sort === "NAME") {
      return left.name.localeCompare(right.name);
    }

    if (sort === "LEVEL") {
      return (right.level ?? -1) - (left.level ?? -1);
    }

    return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
  });
}

export function buildCharacterStatRows(character: CampaignCharacterDetails) {
  return [
    {
      label: "Hit points",
      value: getCharacterHitPointsText(character),
      secondary: `${character.temporaryHitPoints ?? 0} temp`,
    },
    {
      label: "Armor class",
      value: character.armorClass?.toString() ?? "—",
      secondary: "Defense",
    },
    {
      label: "Initiative",
      value:
        character.initiativeBonus != null
          ? `${character.initiativeBonus >= 0 ? "+" : ""}${character.initiativeBonus}`
          : "—",
      secondary: "Turn order",
    },
    {
      label: "Speed",
      value: character.speed ?? "—",
      secondary: "Movement",
    },
    {
      label: "Proficiency",
      value:
        character.proficiencyBonus != null
          ? `${character.proficiencyBonus >= 0 ? "+" : ""}${character.proficiencyBonus}`
          : "—",
      secondary: "Bonus",
    },
    {
      label: "Alignment",
      value: character.alignment ?? "—",
      secondary: "Ethos",
    },
  ];
}

export function buildAbilityRows(character: CampaignCharacterDetails) {
  return [
    {
      label: "Strength",
      score: character.strength,
      modifier: getAbilityModifier(character.strength),
    },
    {
      label: "Dexterity",
      score: character.dexterity,
      modifier: getAbilityModifier(character.dexterity),
    },
    {
      label: "Constitution",
      score: character.constitution,
      modifier: getAbilityModifier(character.constitution),
    },
    {
      label: "Intelligence",
      score: character.intelligence,
      modifier: getAbilityModifier(character.intelligence),
    },
    {
      label: "Wisdom",
      score: character.wisdom,
      modifier: getAbilityModifier(character.wisdom),
    },
    {
      label: "Charisma",
      score: character.charisma,
      modifier: getAbilityModifier(character.charisma),
    },
  ];
}

export function buildSavingThrowRows(character: CampaignCharacterDetails) {
  return [
    { label: "Strength", modifier: getAbilityModifier(character.strength) },
    { label: "Dexterity", modifier: getAbilityModifier(character.dexterity) },
    { label: "Constitution", modifier: getAbilityModifier(character.constitution) },
    { label: "Intelligence", modifier: getAbilityModifier(character.intelligence) },
    { label: "Wisdom", modifier: getAbilityModifier(character.wisdom) },
    { label: "Charisma", modifier: getAbilityModifier(character.charisma) },
  ];
}

export function buildSkillRows(character: CampaignCharacterDetails) {
  return [
    { label: "Acrobatics", ability: "Dex", modifier: getAbilityModifier(character.dexterity) },
    { label: "Arcana", ability: "Int", modifier: getAbilityModifier(character.intelligence) },
    { label: "Athletics", ability: "Str", modifier: getAbilityModifier(character.strength) },
    { label: "History", ability: "Int", modifier: getAbilityModifier(character.intelligence) },
    { label: "Insight", ability: "Wis", modifier: getAbilityModifier(character.wisdom) },
    {
      label: "Investigation",
      ability: "Int",
      modifier: getAbilityModifier(character.intelligence),
    },
    { label: "Perception", ability: "Wis", modifier: getAbilityModifier(character.wisdom) },
  ];
}

export function stringifyUnknownRecord(value: unknown, fallback: string): string {
  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }

  if (Array.isArray(value)) {
    const normalized = value
      .map((item) => (typeof item === "string" ? item.trim() : JSON.stringify(item)))
      .filter((item) => item.length > 0);

    return normalized.length > 0 ? normalized.join(", ") : fallback;
  }

  if (value && typeof value === "object") {
    try {
      const serialized = JSON.stringify(value, null, 2);

      return serialized.length > 2 ? serialized : fallback;
    } catch {
      return fallback;
    }
  }

  return fallback;
}
