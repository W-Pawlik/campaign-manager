import { ValidationError } from "@core/application/errors/AppError";

export const NOTE_CATEGORY = {
  GENERAL: "GENERAL",
  SESSION: "SESSION",
  CHARACTER: "CHARACTER",
  QUEST: "QUEST",
  LOCATION: "LOCATION",
  NPC: "NPC",
  ITEM: "ITEM",
  LORE: "LORE",
  GM_SECRET: "GM_SECRET",
  PLAYER_NOTE: "PLAYER_NOTE",
} as const;

export type NoteCategoryValue = (typeof NOTE_CATEGORY)[keyof typeof NOTE_CATEGORY];

export class NoteCategory {
  public readonly value: NoteCategoryValue;

  private constructor(value: NoteCategoryValue) {
    this.value = value;
  }

  public static create(value: string): NoteCategory {
    if (!Object.values(NOTE_CATEGORY).includes(value as NoteCategoryValue)) {
      throw new ValidationError("Invalid note category");
    }

    return new NoteCategory(value as NoteCategoryValue);
  }

  public static general(): NoteCategory {
    return new NoteCategory(NOTE_CATEGORY.GENERAL);
  }
}
