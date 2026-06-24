import { describe, expect, it } from "vitest";
import { ValidationError } from "@core/application/errors/AppError";
import {
  mapListOpen5eCreatureCatalogQueryInput,
  mapListPublishedMonstersQueryInput,
} from "@api/mappers/MonsterCatalogQueryRequestMapper";

describe("Monster catalog request mappers", () => {
  it("maps open5e catalog filters from query params", () => {
    const result = mapListOpen5eCreatureCatalogQueryInput({
      actorUserId: "user-1",
      query: {
        search: "goblin",
        type: "humanoid",
        minCr: "0.25",
        maxCr: "2",
        limit: "15",
        page: "3",
      },
    });

    expect(result).toEqual({
      actorUserId: "user-1",
      search: "goblin",
      type: "humanoid",
      minCr: 0.25,
      maxCr: 2,
      limit: 15,
      page: 3,
    });
  });

  it("rejects invalid published monster catalog page query", () => {
    expect(() =>
      mapListPublishedMonstersQueryInput({
        actorUserId: "user-1",
        query: {
          page: "0",
        },
      }),
    ).toThrow(ValidationError);
  });
});
