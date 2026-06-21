import { ValidationError } from "@core/application/errors/AppError";

export const OBJECTIVE_STATUS = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
  FAILED: "FAILED",
  OPTIONAL_SKIPPED: "OPTIONAL_SKIPPED",
} as const;

export type ObjectiveStatusValue = (typeof OBJECTIVE_STATUS)[keyof typeof OBJECTIVE_STATUS];

export class ObjectiveStatus {
  public readonly value: ObjectiveStatusValue;

  private constructor(value: ObjectiveStatusValue) {
    this.value = value;
  }

  public static create(value: string): ObjectiveStatus {
    const normalizedValue = value.trim().toUpperCase();

    if (!Object.values(OBJECTIVE_STATUS).includes(normalizedValue as ObjectiveStatusValue)) {
      throw new ValidationError("Invalid objective status");
    }

    return new ObjectiveStatus(normalizedValue as ObjectiveStatusValue);
  }

  public static todo(): ObjectiveStatus { return new ObjectiveStatus(OBJECTIVE_STATUS.TODO); }
}
