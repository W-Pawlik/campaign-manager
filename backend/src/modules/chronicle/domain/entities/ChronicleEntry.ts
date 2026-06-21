import { ForbiddenError, ValidationError } from "@core/application/errors/AppError";
import { ChronicleVisibility } from "@modules/chronicle/domain/value-objects/ChronicleVisibility";

export interface ChronicleEntryProps {
  id: string;
  campaignId: string;
  sessionId: string | null;
  title: string;
  content: string;
  inWorldDate: string | null;
  occurredAt: Date | null;
  visibility: ChronicleVisibility;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UpdateChronicleEntryParams = Omit<
  Partial<ChronicleEntryProps>,
  "id" | "campaignId" | "createdById" | "createdAt" | "updatedAt"
>;

export class ChronicleEntry {
  public readonly id: string;
  public readonly campaignId: string;
  public readonly sessionId: string | null;
  public readonly title: string;
  public readonly content: string;
  public readonly inWorldDate: string | null;
  public readonly occurredAt: Date | null;
  public readonly visibility: ChronicleVisibility;
  public readonly createdById: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  private constructor(props: ChronicleEntryProps) {
    this.id = props.id;
    this.campaignId = props.campaignId;
    this.sessionId = props.sessionId;
    this.title = props.title;
    this.content = props.content;
    this.inWorldDate = props.inWorldDate;
    this.occurredAt = props.occurredAt;
    this.visibility = props.visibility;
    this.createdById = props.createdById;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public static create(props: ChronicleEntryProps): ChronicleEntry {
    ChronicleEntry.validate(props);

    return new ChronicleEntry(props);
  }

  public withUpdates(params: UpdateChronicleEntryParams): ChronicleEntry {
    return ChronicleEntry.create({
      ...this.toProps(),
      ...params,
      updatedAt: new Date(),
    });
  }

  public publish(publishedAt: Date): ChronicleEntry {
    if (this.visibility.isPublic()) {
      return this;
    }

    return ChronicleEntry.create({
      ...this.toProps(),
      visibility: ChronicleVisibility.public(),
      updatedAt: publishedAt,
    });
  }

  public ensureEditable(): void {
    if (this.visibility.isPublic()) {
      return;
    }

    if (this.visibility.isGmOnly() || this.visibility.isDraft()) {
      return;
    }

    throw new ForbiddenError("Chronicle entry cannot be edited");
  }

  private toProps(): ChronicleEntryProps {
    return {
      id: this.id,
      campaignId: this.campaignId,
      sessionId: this.sessionId,
      title: this.title,
      content: this.content,
      inWorldDate: this.inWorldDate,
      occurredAt: this.occurredAt,
      visibility: this.visibility,
      createdById: this.createdById,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  private static validate(props: ChronicleEntryProps): void {
    const trimmedTitle = props.title.trim();
    const trimmedContent = props.content.trim();

    if (trimmedTitle.length < 1 || trimmedTitle.length > 200) {
      throw new ValidationError("Chronicle title must be between 1 and 200 characters");
    }

    if (trimmedContent.length < 1 || trimmedContent.length > 20000) {
      throw new ValidationError("Chronicle content must be between 1 and 20000 characters");
    }

    if (props.inWorldDate !== null) {
      const trimmedInWorldDate = props.inWorldDate.trim();

      if (trimmedInWorldDate.length < 1 || trimmedInWorldDate.length > 120) {
        throw new ValidationError("Chronicle in-world date must be between 1 and 120 characters");
      }
    }
  }
}
