import { describe, expect, it } from "vitest";
import { ValidationError } from "@core/application/errors/AppError";
import {
  mapListOpen5eItemCatalogQueryInput,
  mapListPublishedItemsQueryInput,
} from "@api/mappers/ItemCatalogQueryRequestMapper";

describe("item catalog request mappers", () => {
  it("maps public item filters with boolean parsing", () => {
    const result = mapListPublishedItemsQueryInput({
      actorUserId: "user-1",
      query: {
        search: " potion ",
        rarity: "RARE",
        isMagical: "true",
        limit: "12",
        page: "2",
      },
    });

    expect(result).toEqual({
      actorUserId: "user-1",
      search: "potion",
      rarity: "RARE",
      isMagical: true,
      limit: 12,
      page: 2,
    });
  });

  it("maps Open5e item provider query", () => {
    const result = mapListOpen5eItemCatalogQueryInput({
      actorUserId: "user-1",
      resourceType: "MAGIC_ITEM",
      query: {
        search: " wand ",
        ordering: "-name",
      },
    });

    expect(result).toEqual({
      actorUserId: "user-1",
      resourceType: "MAGIC_ITEM",
      search: "wand",
      ordering: "-name",
    });
  });

  it("rejects invalid boolean query values", () => {
    expect(() =>
      mapListPublishedItemsQueryInput({
        actorUserId: "user-1",
        query: {
          isMagical: "yes",
        },
      }),
    ).toThrow(ValidationError);
  });
});
