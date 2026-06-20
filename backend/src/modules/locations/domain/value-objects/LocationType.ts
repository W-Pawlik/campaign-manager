import { ValidationError } from "@core/application/errors/AppError";

export const LOCATION_TYPE = {
  WORLD: "WORLD",
  CONTINENT: "CONTINENT",
  REGION: "REGION",
  KINGDOM: "KINGDOM",
  CITY: "CITY",
  DISTRICT: "DISTRICT",
  BUILDING: "BUILDING",
  DUNGEON: "DUNGEON",
  ROOM: "ROOM",
  LANDMARK: "LANDMARK",
  PLANE: "PLANE",
  OTHER: "OTHER",
} as const;

export type LocationTypeValue = (typeof LOCATION_TYPE)[keyof typeof LOCATION_TYPE];

export class LocationType {
  public readonly value: LocationTypeValue;

  private constructor(value: LocationTypeValue) {
    this.value = value;
  }

  public static create(value: string): LocationType {
    if (!Object.values(LOCATION_TYPE).includes(value as LocationTypeValue)) {
      throw new ValidationError("Invalid location type");
    }

    return new LocationType(value as LocationTypeValue);
  }

  public static other(): LocationType {
    return new LocationType(LOCATION_TYPE.OTHER);
  }
}
