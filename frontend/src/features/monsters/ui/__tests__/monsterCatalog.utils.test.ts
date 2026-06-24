import { describe, expect, it } from "vitest";

import type { Open5eCatalogCreatureListItem } from "@/features/monsters/model/monster.types";
import {
  createMonsterFallbackImage,
  formatSpeed,
  getCatalogItemCrLabel,
  getCatalogItemImageUrl,
  getOpen5eIllustrationUrl,
  getCatalogItemSourceLabel,
  getRenderableText,
  getStatblockEntries,
} from "@/features/monsters/ui/monsterCatalog.utils";

describe("monsterCatalog utils", () => {
  const open5eMonster: Open5eCatalogCreatureListItem = {
    provider: "OPEN5E",
    resourceType: "CREATURE",
    key: "goblin",
    name: "Goblin",
    illustrationUrl: "https://cdn.example.com/goblin.webp",
    sourceDocumentName: "SRD 2024",
    metadata: {
      challengeRating: "1/4",
      creatureType: "Humanoid",
      size: "SMALL",
    },
  };

  it("reads Open5e catalog fields", () => {
    expect(getCatalogItemCrLabel(open5eMonster)).toBe("1/4");
    expect(getCatalogItemImageUrl(open5eMonster)).toBe("https://cdn.example.com/goblin.webp");
    expect(getCatalogItemSourceLabel(open5eMonster)).toBe("SRD 2024");
  });

  it("renders complex values as strings", () => {
    expect(getRenderableText({ walk: 30 })).toContain('"walk": 30');
    expect(getRenderableText(null)).toBe("N/A");
  });

  it("formats speed and statblock entries", () => {
    expect(
      formatSpeed({
        unit: "ft.",
        walk: 10,
        swim: 40,
      }),
    ).toBe("10 ft., swim 40 ft.");

    expect(
      getStatblockEntries([
        {
          name: "Tentacle",
          desc: "Melee Weapon Attack.",
          action_type: "ACTION",
        },
      ]),
    ).toEqual([
      {
        description: "Melee Weapon Attack.",
        name: "Tentacle",
        subtitle: "Action",
      },
    ]);
  });

  it("prefers top-level illustration url when present", () => {
    expect(
      getOpen5eIllustrationUrl(
        {
          illustrationUrl: "https://cdn.example.com/from-normalized.webp",
        },
        "https://cdn.example.com/from-top-level.webp",
      ),
    ).toBe("https://cdn.example.com/from-top-level.webp");
  });

  it("creates a data-uri fallback image", () => {
    expect(createMonsterFallbackImage("Goblin")).toMatch(/^data:image\/svg\+xml/);
  });
});
