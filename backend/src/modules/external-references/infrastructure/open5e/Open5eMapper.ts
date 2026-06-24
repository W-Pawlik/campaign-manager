import { Open5eInvalidResponseError } from "@modules/external-references/application/errors/Open5eErrors";
import type {
  Open5eCreatureListItem,
  Open5eListPage,
  Open5eResourceDetails,
  Open5eSearchResult,
} from "@modules/external-references/application/ports/Open5eClient";
import { EXTERNAL_RESOURCE_TYPE } from "@modules/external-references/domain/value-objects/ExternalResourceType";

interface Open5eSearchApiResult {
  route?: unknown;
  object_name?: unknown;
  object_pk?: unknown;
  text?: unknown;
  highlighted?: unknown;
  document?: {
    key?: unknown;
    name?: unknown;
  } | null;
  object?: Record<string, unknown>;
}

interface Open5eListApiResponse {
  count?: unknown;
  next?: unknown;
  results?: unknown;
}

function toNullableString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function toNullableNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function mapEndpointToResourceType(endpoint: string): string {
  switch (endpoint) {
    case "creatures":
      return EXTERNAL_RESOURCE_TYPE.CREATURE;
    case "spells":
      return EXTERNAL_RESOURCE_TYPE.SPELL;
    case "magicitems":
      return EXTERNAL_RESOURCE_TYPE.MAGIC_ITEM;
    case "weapons":
      return EXTERNAL_RESOURCE_TYPE.WEAPON;
    case "armor":
      return EXTERNAL_RESOURCE_TYPE.ARMOR;
    case "items":
      return EXTERNAL_RESOURCE_TYPE.EQUIPMENT;
    case "classes":
      return EXTERNAL_RESOURCE_TYPE.CLASS;
    case "species":
      return EXTERNAL_RESOURCE_TYPE.SPECIES;
    case "backgrounds":
      return EXTERNAL_RESOURCE_TYPE.BACKGROUND;
    case "feats":
      return EXTERNAL_RESOURCE_TYPE.FEAT;
    case "rules":
      return EXTERNAL_RESOURCE_TYPE.RULE;
    case "conditions":
      return EXTERNAL_RESOURCE_TYPE.CONDITION;
    case "documents":
      return EXTERNAL_RESOURCE_TYPE.DOCUMENT;
    default:
      throw new Open5eInvalidResponseError();
  }
}

function mapSizeToMonsterSize(value: unknown): string | null {
  const rawKey =
    typeof value === "string"
      ? value
      : value !== null &&
          typeof value === "object" &&
          "key" in value &&
          typeof value.key === "string"
        ? value.key
        : null;

  if (rawKey === null) {
    return null;
  }

  switch (rawKey.trim().toUpperCase()) {
    case "TINY":
      return "TINY";
    case "SMALL":
      return "SMALL";
    case "MEDIUM":
      return "MEDIUM";
    case "LARGE":
      return "LARGE";
    case "HUGE":
      return "HUGE";
    case "GARGANTUAN":
      return "GARGANTUAN";
    default:
      return "UNKNOWN";
  }
}

function mapTypeName(value: unknown): string | null {
  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }

  if (
    value !== null &&
    typeof value === "object" &&
    "name" in value &&
    typeof value.name === "string" &&
    value.name.trim().length > 0
  ) {
    return value.name;
  }

  return null;
}

function mapChallengeRatingString(value: unknown): string | null {
  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }

  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return null;
  }

  if (value === 0.125) {
    return "1/8";
  }

  if (value === 0.25) {
    return "1/4";
  }

  if (value === 0.5) {
    return "1/2";
  }

  if (Number.isInteger(value)) {
    return value.toString();
  }

  return value.toString();
}

function mapCreatureNormalizedData(record: Record<string, unknown>): Record<string, unknown> {
  const document =
    record.document !== null && typeof record.document === "object"
      ? (record.document as Record<string, unknown>)
      : null;
  const abilityScores =
    record.ability_scores !== null && typeof record.ability_scores === "object"
      ? (record.ability_scores as Record<string, unknown>)
      : {};
  const languages =
    record.languages !== null && typeof record.languages === "object"
      ? (record.languages as Record<string, unknown>)
      : null;
  const resistances =
    record.resistances_and_immunities !== null &&
    typeof record.resistances_and_immunities === "object"
      ? (record.resistances_and_immunities as Record<string, unknown>)
      : {};
  const senses: string[] = [];
  const darkvision = toNullableNumber(record.darkvision_range);

  if (darkvision !== null) {
    senses.push(`darkvision ${darkvision} ft.`);
  }

  const blindsight = toNullableNumber(record.blindsight_range);

  if (blindsight !== null) {
    senses.push(`blindsight ${blindsight} ft.`);
  }

  const tremorsense = toNullableNumber(record.tremorsense_range);

  if (tremorsense !== null) {
    senses.push(`tremorsense ${tremorsense} ft.`);
  }

  const truesight = toNullableNumber(record.truesight_range);

  if (truesight !== null) {
    senses.push(`truesight ${truesight} ft.`);
  }

  return {
    key: toNullableString(record.key),
    name: toNullableString(record.name),
    slug: toNullableString(record.key),
    size: mapSizeToMonsterSize(record.size),
    type: mapTypeName(record.type),
    subtype: toNullableString(record.subcategory),
    alignment: toNullableString(record.alignment),
    armorClass: toNullableNumber(record.armor_class),
    armorClassDetails: toNullableString(record.armor_detail),
    hitPoints: toNullableNumber(record.hit_points),
    hitDice: toNullableString(record.hit_dice),
    speed: record.speed_all ?? record.speed ?? null,
    strength: toNullableNumber(abilityScores.strength),
    dexterity: toNullableNumber(abilityScores.dexterity),
    constitution: toNullableNumber(abilityScores.constitution),
    intelligence: toNullableNumber(abilityScores.intelligence),
    wisdom: toNullableNumber(abilityScores.wisdom),
    charisma: toNullableNumber(abilityScores.charisma),
    savingThrows: record.saving_throws_all ?? record.saving_throws ?? null,
    skills: record.skill_bonuses_all ?? record.skill_bonuses ?? null,
    damageResistances: resistances.damage_resistances ?? null,
    damageImmunities: resistances.damage_immunities ?? null,
    conditionImmunities: resistances.condition_immunities ?? null,
    damageVulnerabilities: resistances.damage_vulnerabilities ?? null,
    senses: senses.length === 0 ? null : senses.join(", "),
    languages:
      toNullableString(record.languages_as_text) ??
      toNullableString(record.languages_string) ??
      toNullableString(languages?.as_string) ??
      null,
    challengeRating: mapChallengeRatingString(record.challenge_rating),
    challengeRatingDecimal: toNullableNumber(record.challenge_rating),
    proficiencyBonus: toNullableNumber(record.proficiency_bonus),
    xp: toNullableNumber(record.experience_points),
    traits: Array.isArray(record.traits) ? record.traits : null,
    actions: Array.isArray(record.actions) ? record.actions : null,
    bonusActions: Array.isArray(record.bonus_actions)
      ? record.bonus_actions
      : null,
    reactions: Array.isArray(record.reactions) ? record.reactions : null,
    legendaryActions: Array.isArray(record.legendary_actions)
      ? record.legendary_actions
      : null,
    lairActions: Array.isArray(record.lair_actions) ? record.lair_actions : null,
    regionalEffects: Array.isArray(record.regional_effects)
      ? record.regional_effects
      : null,
    spellcasting: record.spellcasting ?? null,
    description: toNullableString(record.desc),
    sourceDocumentKey: toNullableString(document?.key),
    sourceDocumentName: toNullableString(document?.name),
  };
}

export class Open5eMapper {
  public mapCreatureListPage(
    payload: unknown,
    options: {
      limit: number;
      page: number;
    },
  ): Open5eListPage<Open5eCreatureListItem> {
    if (
      payload === null ||
      typeof payload !== "object" ||
      !("results" in payload) ||
      !Array.isArray(payload.results)
    ) {
      throw new Open5eInvalidResponseError();
    }

    const total =
      "count" in payload && typeof payload.count === "number" && Number.isFinite(payload.count)
        ? payload.count
        : null;
    const hasNext = "next" in payload ? payload.next !== null : false;

    if (total === null) {
      throw new Open5eInvalidResponseError();
    }

    return {
      items: payload.results.flatMap((item): Open5eCreatureListItem[] => {
        if (item === null || typeof item !== "object") {
          return [];
        }

        const record = item as Record<string, unknown>;
        const key = toNullableString(record.key);
        const name = toNullableString(record.name);

        if (key === null || name === null) {
          return [];
        }

        const document =
          record.document !== null && typeof record.document === "object"
            ? (record.document as Record<string, unknown>)
            : null;

        return [
          {
            provider: "OPEN5E",
            resourceType: EXTERNAL_RESOURCE_TYPE.CREATURE,
            key,
            name,
            sourceDocumentKey: toNullableString(document?.key),
            sourceDocumentName: toNullableString(document?.name),
            metadata: {
              challengeRating: mapChallengeRatingString(record.challenge_rating),
              challengeRatingDecimal: toNullableNumber(record.challenge_rating),
              creatureType: mapTypeName(record.type),
              size: mapSizeToMonsterSize(record.size),
            },
          },
        ];
      }),
      limit: options.limit,
      page: options.page,
      total,
      hasNext,
    };
  }

  public mapSearchResults(payload: unknown): Open5eSearchResult[] {
    if (
      payload === null ||
      typeof payload !== "object" ||
      !("results" in payload) ||
      !Array.isArray(payload.results)
    ) {
      throw new Open5eInvalidResponseError();
    }

    return payload.results.flatMap((item): Open5eSearchResult[] => {
      const result = item as Open5eSearchApiResult;
      const route = toNullableString(result.route);
      const name = toNullableString(result.object_name);
      const key = toNullableString(result.object_pk);

      if (route === null || name === null || key === null) {
        return [];
      }

      const endpoint = route.split("/").filter(Boolean).at(-1);

      if (endpoint === undefined) {
        return [];
      }

      let resourceType: string;

      try {
        resourceType = mapEndpointToResourceType(endpoint);
      } catch {
        return [];
      }

      const metadata =
        result.object !== undefined &&
        result.object !== null &&
        typeof result.object === "object"
          ? this.mapSearchMetadata(resourceType, result.object)
          : undefined;

      return [
        {
          provider: "OPEN5E",
          resourceType,
          key,
          name,
          summary: toNullableString(result.text),
          highlighted: toNullableString(result.highlighted),
          sourceDocumentKey: toNullableString(result.document?.key),
          sourceDocumentName: toNullableString(result.document?.name),
          ...(metadata === undefined ? {} : { metadata }),
          rawData: item,
        },
      ];
    });
  }

  public mapResourceDetails(
    resourceType: string,
    payload: unknown,
    endpointBaseUrl: string,
  ): Open5eResourceDetails {
    if (
      payload === null ||
      typeof payload !== "object" ||
      !("results" in payload)
    ) {
      throw new Open5eInvalidResponseError();
    }

    const results = (payload as Open5eListApiResponse).results;

    if (!Array.isArray(results) || results.length === 0) {
      throw new Open5eInvalidResponseError();
    }

    const rawRecord = results[0];

    if (rawRecord === null || typeof rawRecord !== "object") {
      throw new Open5eInvalidResponseError();
    }

    const record = rawRecord as Record<string, unknown>;
    const key = toNullableString(record.key);
    const name = toNullableString(record.name);

    if (key === null || name === null) {
      throw new Open5eInvalidResponseError();
    }

    const document =
      record.document !== null && typeof record.document === "object"
        ? (record.document as Record<string, unknown>)
        : null;
    const normalizedData =
      resourceType === EXTERNAL_RESOURCE_TYPE.CREATURE
        ? mapCreatureNormalizedData(record)
        : null;

    return {
      provider: "OPEN5E",
      resourceType,
      key,
      name,
      slug: key,
      url: `${endpointBaseUrl}${key}/`,
      sourceDocumentKey: toNullableString(document?.key),
      sourceDocumentName: toNullableString(document?.name),
      rawData: rawRecord,
      normalizedData,
    };
  }

  private mapSearchMetadata(
    resourceType: string,
    payload: Record<string, unknown>,
  ): Record<string, unknown> | undefined {
    if (resourceType === EXTERNAL_RESOURCE_TYPE.CREATURE) {
      return {
        ...(payload.cr === undefined ? {} : { challengeRating: payload.cr }),
        ...(payload.cr === undefined
          ? {}
          : { challengeRatingDecimal: payload.cr }),
        ...(payload.type === undefined ? {} : { creatureType: payload.type }),
      };
    }

    if (resourceType === EXTERNAL_RESOURCE_TYPE.SPELL) {
      return {
        ...(payload.level === undefined ? {} : { spellLevel: payload.level }),
        ...(payload.school === undefined ? {} : { spellSchool: payload.school }),
      };
    }

    if (
      resourceType === EXTERNAL_RESOURCE_TYPE.MAGIC_ITEM ||
      resourceType === EXTERNAL_RESOURCE_TYPE.WEAPON ||
      resourceType === EXTERNAL_RESOURCE_TYPE.ARMOR ||
      resourceType === EXTERNAL_RESOURCE_TYPE.EQUIPMENT
    ) {
      return {
        ...(payload.type === undefined ? {} : { itemType: payload.type }),
        ...(payload.rarity === undefined ? {} : { rarity: payload.rarity }),
      };
    }

    return undefined;
  }
}
