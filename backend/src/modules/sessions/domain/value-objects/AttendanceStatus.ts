import { ValidationError } from "@core/application/errors/AppError";

export const ATTENDANCE_STATUS = {
  INVITED: "INVITED",
  CONFIRMED: "CONFIRMED",
  DECLINED: "DECLINED",
  MAYBE: "MAYBE",
  ABSENT: "ABSENT",
  ATTENDED: "ATTENDED",
} as const;

export type AttendanceStatusValue = (typeof ATTENDANCE_STATUS)[keyof typeof ATTENDANCE_STATUS];

export class AttendanceStatus {
  public readonly value: AttendanceStatusValue;

  private constructor(value: AttendanceStatusValue) {
    this.value = value;
  }

  public static create(value: string): AttendanceStatus {
    const normalizedValue = value.trim().toUpperCase();

    if (!Object.values(ATTENDANCE_STATUS).includes(normalizedValue as AttendanceStatusValue)) {
      throw new ValidationError("Invalid attendance status");
    }

    return new AttendanceStatus(normalizedValue as AttendanceStatusValue);
  }

  public static invited(): AttendanceStatus {
    return new AttendanceStatus(ATTENDANCE_STATUS.INVITED);
  }

  public static confirmed(): AttendanceStatus {
    return new AttendanceStatus(ATTENDANCE_STATUS.CONFIRMED);
  }

  public static declined(): AttendanceStatus {
    return new AttendanceStatus(ATTENDANCE_STATUS.DECLINED);
  }
}
