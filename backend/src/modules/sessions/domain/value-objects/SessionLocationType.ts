import { ValidationError } from "@core/application/errors/AppError";

export const SESSION_LOCATION_TYPE = {
  ONLINE: "ONLINE",
  IN_PERSON: "IN_PERSON",
  HYBRID: "HYBRID",
  UNKNOWN: "UNKNOWN",
} as const;

export type SessionLocationTypeValue =
  (typeof SESSION_LOCATION_TYPE)[keyof typeof SESSION_LOCATION_TYPE];

export class SessionLocationType {
  public readonly value: SessionLocationTypeValue;

  private constructor(value: SessionLocationTypeValue) {
    this.value = value;
  }

  public static create(value: string): SessionLocationType {
    const normalizedValue = value.trim().toUpperCase();

    if (!Object.values(SESSION_LOCATION_TYPE).includes(normalizedValue as SessionLocationTypeValue)) {
      throw new ValidationError("Invalid session location type");
    }

    return new SessionLocationType(normalizedValue as SessionLocationTypeValue);
  }

  public static unknown(): SessionLocationType {
    return new SessionLocationType(SESSION_LOCATION_TYPE.UNKNOWN);
  }
}
