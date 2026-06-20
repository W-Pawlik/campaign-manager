import { ValidationError } from "@core/application/errors/AppError";

export const SESSION_STATUS = {
  PLANNED: "PLANNED",
  CONFIRMED: "CONFIRMED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  POSTPONED: "POSTPONED",
} as const;

export type SessionStatusValue = (typeof SESSION_STATUS)[keyof typeof SESSION_STATUS];

export class SessionStatus {
  public readonly value: SessionStatusValue;

  private constructor(value: SessionStatusValue) {
    this.value = value;
  }

  public static create(value: string): SessionStatus {
    const normalizedValue = value.trim().toUpperCase();

    if (!Object.values(SESSION_STATUS).includes(normalizedValue as SessionStatusValue)) {
      throw new ValidationError("Invalid session status");
    }

    return new SessionStatus(normalizedValue as SessionStatusValue);
  }

  public static planned(): SessionStatus {
    return new SessionStatus(SESSION_STATUS.PLANNED);
  }

  public static completed(): SessionStatus {
    return new SessionStatus(SESSION_STATUS.COMPLETED);
  }

  public static cancelled(): SessionStatus {
    return new SessionStatus(SESSION_STATUS.CANCELLED);
  }

  public isCompleted(): boolean {
    return this.value === SESSION_STATUS.COMPLETED;
  }

  public isCancelled(): boolean {
    return this.value === SESSION_STATUS.CANCELLED;
  }
}
