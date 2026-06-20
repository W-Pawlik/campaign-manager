import { ValidationError } from "@core/application/errors/AppError";

export const NPC_ATTITUDE = {
  FRIENDLY: "FRIENDLY",
  NEUTRAL: "NEUTRAL",
  HOSTILE: "HOSTILE",
  UNKNOWN: "UNKNOWN",
} as const;

export type NpcAttitudeValue = (typeof NPC_ATTITUDE)[keyof typeof NPC_ATTITUDE];

export class NpcAttitude {
  public readonly value: NpcAttitudeValue;

  private constructor(value: NpcAttitudeValue) {
    this.value = value;
  }

  public static create(value: string): NpcAttitude {
    if (!Object.values(NPC_ATTITUDE).includes(value as NpcAttitudeValue)) {
      throw new ValidationError("Invalid NPC attitude");
    }

    return new NpcAttitude(value as NpcAttitudeValue);
  }

  public static unknown(): NpcAttitude {
    return new NpcAttitude(NPC_ATTITUDE.UNKNOWN);
  }
}
