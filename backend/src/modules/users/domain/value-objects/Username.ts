import { ValidationError } from "@core/application/errors/AppError";

const USERNAME_REGEX = /^[A-Za-z0-9_-]{3,32}$/;

export class Username {
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(value: string): Username {
    const normalizedValue = value.trim();

    if (!USERNAME_REGEX.test(normalizedValue)) {
      throw new ValidationError(
        "Username must be 3-32 chars and contain only letters, digits, underscore, or hyphen",
      );
    }

    return new Username(normalizedValue);
  }
}
