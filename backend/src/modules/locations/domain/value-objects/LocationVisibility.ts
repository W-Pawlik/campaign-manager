import { ValidationError } from "@core/application/errors/AppError";

export const LOCATION_VISIBILITY = {
  PUBLIC: "PUBLIC",
  DISCOVERED: "DISCOVERED",
  GM_ONLY: "GM_ONLY",
} as const;

export type LocationVisibilityValue =
  (typeof LOCATION_VISIBILITY)[keyof typeof LOCATION_VISIBILITY];

export class LocationVisibility {
  public readonly value: LocationVisibilityValue;

  private constructor(value: LocationVisibilityValue) {
    this.value = value;
  }

  public static create(value: string): LocationVisibility {
    if (!Object.values(LOCATION_VISIBILITY).includes(value as LocationVisibilityValue)) {
      throw new ValidationError("Invalid location visibility");
    }

    return new LocationVisibility(value as LocationVisibilityValue);
  }

  public static discovered(): LocationVisibility {
    return new LocationVisibility(LOCATION_VISIBILITY.DISCOVERED);
  }

  public isGmOnly(): boolean {
    return this.value === LOCATION_VISIBILITY.GM_ONLY;
  }
}
