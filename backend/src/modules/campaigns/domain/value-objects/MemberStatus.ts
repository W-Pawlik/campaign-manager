import { ValidationError } from "@core/application/errors/AppError";

export const MEMBER_STATUS = {
  INVITED: "INVITED",
  ACTIVE: "ACTIVE",
  DECLINED: "DECLINED",
  REMOVED: "REMOVED",
} as const;

export type MemberStatusValue = (typeof MEMBER_STATUS)[keyof typeof MEMBER_STATUS];

export class MemberStatus {
  public readonly value: MemberStatusValue;

  private constructor(value: MemberStatusValue) {
    this.value = value;
  }

  public static create(value: string): MemberStatus {
    const normalizedValue = value.trim().toUpperCase();

    if (
      normalizedValue !== MEMBER_STATUS.INVITED &&
      normalizedValue !== MEMBER_STATUS.ACTIVE &&
      normalizedValue !== MEMBER_STATUS.DECLINED &&
      normalizedValue !== MEMBER_STATUS.REMOVED
    ) {
      throw new ValidationError("Invalid campaign member status");
    }

    return new MemberStatus(normalizedValue);
  }

  public static active(): MemberStatus {
    return new MemberStatus(MEMBER_STATUS.ACTIVE);
  }
}
