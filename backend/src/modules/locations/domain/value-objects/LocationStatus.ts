import { ValidationError } from "@core/application/errors/AppError";

export const LOCATION_STATUS = {
  ACTIVE: "ACTIVE",
  DESTROYED: "DESTROYED",
  LOST: "LOST",
  HIDDEN: "HIDDEN",
  ARCHIVED: "ARCHIVED",
} as const;

export type LocationStatusValue = (typeof LOCATION_STATUS)[keyof typeof LOCATION_STATUS];

export class LocationStatus {
  public readonly value: LocationStatusValue;

  private constructor(value: LocationStatusValue) {
    this.value = value;
  }

  public static create(value: string): LocationStatus {
    if (!Object.values(LOCATION_STATUS).includes(value as LocationStatusValue)) {
      throw new ValidationError("Invalid location status");
    }

    return new LocationStatus(value as LocationStatusValue);
  }

  public static active(): LocationStatus {
    return new LocationStatus(LOCATION_STATUS.ACTIVE);
  }

  public static archived(): LocationStatus {
    return new LocationStatus(LOCATION_STATUS.ARCHIVED);
  }

  public isArchived(): boolean {
    return this.value === LOCATION_STATUS.ARCHIVED;
  }
}
