import { describe, expect, it } from "vitest";
import { ValidationError } from "@core/application/errors/AppError";
import { Email } from "@modules/auth/domain/value-objects/Email";

describe("Email", () => {
  it("normalizes value to lowercase and trims whitespace", () => {
    const email = Email.create("  USER@Example.com ");

    expect(email.value).toBe("user@example.com");
  });

  it("throws for invalid email format", () => {
    expect(() => Email.create("invalid-email")).toThrow(ValidationError);
  });
});
