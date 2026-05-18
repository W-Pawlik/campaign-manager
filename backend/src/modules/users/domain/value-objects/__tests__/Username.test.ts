import { describe, expect, it } from "vitest";
import { ValidationError } from "@core/application/errors/AppError";
import { Username } from "@modules/users/domain/value-objects/Username";

describe("Username", () => {
  it("accepts valid username", () => {
    const username = Username.create("user_name-123");

    expect(username.value).toBe("user_name-123");
  });

  it("throws for invalid username format", () => {
    expect(() => Username.create("ab")).toThrow(ValidationError);
    expect(() => Username.create("invalid name")).toThrow(ValidationError);
  });
});
