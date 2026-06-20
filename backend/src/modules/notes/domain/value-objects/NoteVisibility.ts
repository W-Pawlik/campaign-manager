import { ValidationError } from "@core/application/errors/AppError";

export const NOTE_VISIBILITY = {
  PRIVATE_AUTHOR: "PRIVATE_AUTHOR",
  PRIVATE_GM: "PRIVATE_GM",
  CAMPAIGN_PUBLIC: "CAMPAIGN_PUBLIC",
  SESSION_PUBLIC: "SESSION_PUBLIC",
  CHARACTER_OWNER: "CHARACTER_OWNER",
} as const;

export type NoteVisibilityValue = (typeof NOTE_VISIBILITY)[keyof typeof NOTE_VISIBILITY];

export class NoteVisibility {
  public readonly value: NoteVisibilityValue;

  private constructor(value: NoteVisibilityValue) {
    this.value = value;
  }

  public static create(value: string): NoteVisibility {
    if (!Object.values(NOTE_VISIBILITY).includes(value as NoteVisibilityValue)) {
      throw new ValidationError("Invalid note visibility");
    }

    return new NoteVisibility(value as NoteVisibilityValue);
  }

  public static campaignPublic(): NoteVisibility {
    return new NoteVisibility(NOTE_VISIBILITY.CAMPAIGN_PUBLIC);
  }

  public isPrivateGm(): boolean {
    return this.value === NOTE_VISIBILITY.PRIVATE_GM;
  }

  public isPrivateAuthor(): boolean {
    return this.value === NOTE_VISIBILITY.PRIVATE_AUTHOR;
  }

  public isCharacterOwner(): boolean {
    return this.value === NOTE_VISIBILITY.CHARACTER_OWNER;
  }

  public isSessionPublic(): boolean {
    return this.value === NOTE_VISIBILITY.SESSION_PUBLIC;
  }
}
