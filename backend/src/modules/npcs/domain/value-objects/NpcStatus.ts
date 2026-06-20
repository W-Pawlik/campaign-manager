import { ValidationError } from "@core/application/errors/AppError";

export const NPC_STATUS = {
  ALIVE: "ALIVE",
  DEAD: "DEAD",
  MISSING: "MISSING",
  UNKNOWN: "UNKNOWN",
  ARCHIVED: "ARCHIVED",
} as const;

export type NpcStatusValue = (typeof NPC_STATUS)[keyof typeof NPC_STATUS];

export class NpcStatus {
  public readonly value: NpcStatusValue;

  private constructor(value: NpcStatusValue) {
    this.value = value;
  }

  public static create(value: string): NpcStatus {
    if (!Object.values(NPC_STATUS).includes(value as NpcStatusValue)) {
      throw new ValidationError("Invalid NPC status");
    }

    return new NpcStatus(value as NpcStatusValue);
  }

  public static alive(): NpcStatus {
    return new NpcStatus(NPC_STATUS.ALIVE);
  }

  public static archived(): NpcStatus {
    return new NpcStatus(NPC_STATUS.ARCHIVED);
  }

  public isArchived(): boolean {
    return this.value === NPC_STATUS.ARCHIVED;
  }
}
