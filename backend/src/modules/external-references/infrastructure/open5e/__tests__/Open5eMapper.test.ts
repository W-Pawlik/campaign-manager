import { describe, expect, it } from "vitest";
import { Open5eInvalidResponseError } from "@modules/external-references/application/errors/Open5eErrors";
import { Open5eMapper } from "@modules/external-references/infrastructure/open5e/Open5eMapper";

describe("Open5eMapper", () => {
  it("maps the exact requested item record instead of the first result", () => {
    const mapper = new Open5eMapper();

    const result = mapper.mapResourceDetails(
      "EQUIPMENT",
      {
        results: [
          {
            key: "srd-2024_acid",
            name: "Acid",
            desc: "Acid description",
          },
          {
            key: "srd-2024_airship",
            name: "Airship",
            desc: "A magical flying vessel capable of air travel.",
            category: {
              key: "wondrous-item",
            },
            cost: "40000.00",
          },
        ],
      },
      "https://api.open5e.com/v2/items/",
      "srd-2024_airship",
    );

    expect(result.key).toBe("srd-2024_airship");
    expect(result.name).toBe("Airship");
    expect(result.normalizedData?.description).toBe(
      "A magical flying vessel capable of air travel.",
    );
  });

  it("throws when the requested key is missing from returned results", () => {
    const mapper = new Open5eMapper();

    expect(() =>
      mapper.mapResourceDetails(
        "EQUIPMENT",
        {
          results: [
            {
              key: "srd-2024_acid",
              name: "Acid",
            },
          ],
        },
        "https://api.open5e.com/v2/items/",
        "srd-2024_airship",
      ),
    ).toThrow(Open5eInvalidResponseError);
  });
});
