import { ValidationError } from "@core/application/errors/AppError";

export const NPC_IMPORTANCE = {
  MINOR: "MINOR",
  SUPPORTING: "SUPPORTING",
  MAJOR: "MAJOR",
  BOSS: "BOSS",
} as const;

export type NpcImportanceValue = (typeof NPC_IMPORTANCE)[keyof typeof NPC_IMPORTANCE];

export class NpcImportance {
  public readonly value: NpcImportanceValue;

  private constructor(value: NpcImportanceValue) {
    this.value = value;
  }

  public static create(value: string): NpcImportance {
    if (!Object.values(NPC_IMPORTANCE).includes(value as NpcImportanceValue)) {
      throw new ValidationError("Invalid NPC importance");
    }

    return new NpcImportance(value as NpcImportanceValue);
  }

  public static minor(): NpcImportance {
    return new NpcImportance(NPC_IMPORTANCE.MINOR);
  }
}
