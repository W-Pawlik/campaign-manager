import { ForbiddenError, ValidationError } from "@core/application/errors/AppError";
import type { NoteCategory } from "@modules/notes/domain/value-objects/NoteCategory";
import type { NoteVisibility } from "@modules/notes/domain/value-objects/NoteVisibility";
import type { RelatedEntityType } from "@modules/notes/domain/value-objects/RelatedEntityType";

export interface NoteProps {
  id: string;
  campaignId: string;
  authorId: string;
  title: string | null;
  content: string;
  visibility: NoteVisibility;
  category: NoteCategory;
  relatedEntityType: RelatedEntityType | null;
  relatedEntityId: string | null;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type UpdateNoteParams = Omit<
  Partial<NoteProps>,
  "id" | "campaignId" | "authorId" | "createdAt" | "updatedAt" | "deletedAt"
>;

export class Note {
  public readonly id: string;
  public readonly campaignId: string;
  public readonly authorId: string;
  public readonly title: string | null;
  public readonly content: string;
  public readonly visibility: NoteVisibility;
  public readonly category: NoteCategory;
  public readonly relatedEntityType: RelatedEntityType | null;
  public readonly relatedEntityId: string | null;
  public readonly isPinned: boolean;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt: Date | null;

  private constructor(props: NoteProps) {
    this.id = props.id;
    this.campaignId = props.campaignId;
    this.authorId = props.authorId;
    this.title = props.title;
    this.content = props.content;
    this.visibility = props.visibility;
    this.category = props.category;
    this.relatedEntityType = props.relatedEntityType;
    this.relatedEntityId = props.relatedEntityId;
    this.isPinned = props.isPinned;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
  }

  public static create(props: NoteProps): Note {
    Note.validate(props);

    return new Note(props);
  }

  public withUpdates(params: UpdateNoteParams): Note {
    this.ensureIsEditable();

    return Note.create({
      ...this.toProps(),
      ...params,
      updatedAt: new Date(),
    });
  }

  public pin(): Note {
    this.ensureIsEditable();

    if (this.isPinned) {
      return this;
    }

    return this.withUpdates({ isPinned: true });
  }

  public unpin(): Note {
    this.ensureIsEditable();

    if (!this.isPinned) {
      return this;
    }

    return this.withUpdates({ isPinned: false });
  }

  public softDelete(deletedAt: Date): Note {
    if (this.deletedAt !== null) {
      return this;
    }

    return Note.create({
      ...this.toProps(),
      updatedAt: deletedAt,
      deletedAt,
    });
  }

  public ensureIsEditable(): void {
    if (this.deletedAt !== null) {
      throw new ForbiddenError("Deleted note cannot be modified");
    }
  }

  private toProps(): NoteProps {
    return {
      id: this.id,
      campaignId: this.campaignId,
      authorId: this.authorId,
      title: this.title,
      content: this.content,
      visibility: this.visibility,
      category: this.category,
      relatedEntityType: this.relatedEntityType,
      relatedEntityId: this.relatedEntityId,
      isPinned: this.isPinned,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  private static validate(props: NoteProps): void {
    const trimmedContent = props.content.trim();

    if (trimmedContent.length < 1 || trimmedContent.length > 20000) {
      throw new ValidationError("Note content must be between 1 and 20000 characters");
    }

    if (props.title !== null) {
      const trimmedTitle = props.title.trim();

      if (trimmedTitle.length < 1 || trimmedTitle.length > 200) {
        throw new ValidationError("Note title must be between 1 and 200 characters");
      }
    }

    if ((props.relatedEntityType === null) !== (props.relatedEntityId === null)) {
      throw new ValidationError("Related entity type and id must be provided together");
    }
  }
}
