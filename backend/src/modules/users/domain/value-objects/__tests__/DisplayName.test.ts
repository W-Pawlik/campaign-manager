import { describe, expect, it } from "vitest";
import { ValidationError } from "@core/application/errors/AppError";
import { DisplayName } from "@modules/users/domain/value-objects/DisplayName";

describe("DisplayName", () => {
  it("accepts valid display name", () => {
    const displayName = DisplayName.create("John the Brave");

    expect(displayName.value).toBe("John the Brave");
  });

  it("throws when display name length is invalid", () => {
    expect(() => DisplayName.create("A")).toThrow(ValidationError);
    expect(() => DisplayName.create("x".repeat(81))).toThrow(ValidationError);
  });
});
