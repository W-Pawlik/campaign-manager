import { ValidationError } from "@core/application/errors/AppError";

export const CHRONICLE_VISIBILITY = {
  PUBLIC: "PUBLIC",
  GM_ONLY: "GM_ONLY",
  DRAFT: "DRAFT",
} as const;

export type ChronicleVisibilityValue =
  (typeof CHRONICLE_VISIBILITY)[keyof typeof CHRONICLE_VISIBILITY];

export class ChronicleVisibility {
  public readonly value: ChronicleVisibilityValue;

  private constructor(value: ChronicleVisibilityValue) {
    this.value = value;
  }

  public static create(value: string): ChronicleVisibility {
    const normalizedValue = value.trim().toUpperCase();

    if (!Object.values(CHRONICLE_VISIBILITY).includes(normalizedValue as ChronicleVisibilityValue)) {
      throw new ValidationError("Invalid chronicle visibility");
    }

    return new ChronicleVisibility(normalizedValue as ChronicleVisibilityValue);
  }

  public static public(): ChronicleVisibility {
    return new ChronicleVisibility(CHRONICLE_VISIBILITY.PUBLIC);
  }

  public static gmOnly(): ChronicleVisibility {
    return new ChronicleVisibility(CHRONICLE_VISIBILITY.GM_ONLY);
  }

  public static draft(): ChronicleVisibility {
    return new ChronicleVisibility(CHRONICLE_VISIBILITY.DRAFT);
  }

  public isPublic(): boolean {
    return this.value === CHRONICLE_VISIBILITY.PUBLIC;
  }

  public isGmOnly(): boolean {
    return this.value === CHRONICLE_VISIBILITY.GM_ONLY;
  }

  public isDraft(): boolean {
    return this.value === CHRONICLE_VISIBILITY.DRAFT;
  }
}
