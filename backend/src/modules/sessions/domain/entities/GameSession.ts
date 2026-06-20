import { ForbiddenError, ValidationError } from "@core/application/errors/AppError";
import type { SessionLocationType } from "@modules/sessions/domain/value-objects/SessionLocationType";
import { SessionStatus } from "@modules/sessions/domain/value-objects/SessionStatus";

export interface GameSessionProps {
  id: string;
  campaignId: string;
  title: string;
  description: string | null;
  status: SessionStatus;
  scheduledStartAt: Date | null;
  scheduledEndAt: Date | null;
  actualStartAt: Date | null;
  actualEndAt: Date | null;
  locationType: SessionLocationType | null;
  locationDetails: string | null;
  meetingUrl: string | null;
  summaryPublic: string | null;
  summaryPrivate: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  cancelledAt: Date | null;
}

export type UpdateGameSessionParams = Omit<
  Partial<GameSessionProps>,
  "id" | "campaignId" | "createdById" | "createdAt" | "updatedAt"
>;

export class GameSession {
  public readonly id: string;
  public readonly campaignId: string;
  public readonly title: string;
  public readonly description: string | null;
  public readonly status: SessionStatus;
  public readonly scheduledStartAt: Date | null;
  public readonly scheduledEndAt: Date | null;
  public readonly actualStartAt: Date | null;
  public readonly actualEndAt: Date | null;
  public readonly locationType: SessionLocationType | null;
  public readonly locationDetails: string | null;
  public readonly meetingUrl: string | null;
  public readonly summaryPublic: string | null;
  public readonly summaryPrivate: string | null;
  public readonly createdById: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly cancelledAt: Date | null;

  private constructor(props: GameSessionProps) {
    this.id = props.id;
    this.campaignId = props.campaignId;
    this.title = props.title;
    this.description = props.description;
    this.status = props.status;
    this.scheduledStartAt = props.scheduledStartAt;
    this.scheduledEndAt = props.scheduledEndAt;
    this.actualStartAt = props.actualStartAt;
    this.actualEndAt = props.actualEndAt;
    this.locationType = props.locationType;
    this.locationDetails = props.locationDetails;
    this.meetingUrl = props.meetingUrl;
    this.summaryPublic = props.summaryPublic;
    this.summaryPrivate = props.summaryPrivate;
    this.createdById = props.createdById;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.cancelledAt = props.cancelledAt;
  }

  public static create(props: GameSessionProps): GameSession {
    GameSession.validate(props);

    return new GameSession(props);
  }

  public withUpdates(params: UpdateGameSessionParams): GameSession {
    this.ensureIsEditable();

    return GameSession.create({
      ...this.toProps(),
      ...params,
      updatedAt: new Date(),
    });
  }

  public cancel(cancelledAt: Date): GameSession {
    if (this.status.isCancelled()) {
      return this;
    }

    this.ensureIsEditable();

    return GameSession.create({
      ...this.toProps(),
      status: SessionStatus.cancelled(),
      updatedAt: cancelledAt,
      cancelledAt,
    });
  }

  public complete(completedAt: Date): GameSession {
    if (this.status.isCompleted()) {
      return this;
    }

    if (this.status.isCancelled()) {
      throw new ForbiddenError("Cancelled session cannot be completed");
    }

    return GameSession.create({
      ...this.toProps(),
      status: SessionStatus.completed(),
      actualStartAt: this.actualStartAt ?? completedAt,
      actualEndAt: completedAt,
      updatedAt: completedAt,
    });
  }

  public ensureIsEditable(): void {
    if (this.status.isCompleted()) {
      throw new ForbiddenError("Completed session cannot be edited");
    }

    if (this.status.isCancelled()) {
      throw new ForbiddenError("Cancelled session cannot be edited");
    }
  }

  private toProps(): GameSessionProps {
    return {
      id: this.id,
      campaignId: this.campaignId,
      title: this.title,
      description: this.description,
      status: this.status,
      scheduledStartAt: this.scheduledStartAt,
      scheduledEndAt: this.scheduledEndAt,
      actualStartAt: this.actualStartAt,
      actualEndAt: this.actualEndAt,
      locationType: this.locationType,
      locationDetails: this.locationDetails,
      meetingUrl: this.meetingUrl,
      summaryPublic: this.summaryPublic,
      summaryPrivate: this.summaryPrivate,
      createdById: this.createdById,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      cancelledAt: this.cancelledAt,
    };
  }

  private static validate(props: GameSessionProps): void {
    const trimmedTitle = props.title.trim();

    if (trimmedTitle.length < 1 || trimmedTitle.length > 200) {
      throw new ValidationError("Session title must be between 1 and 200 characters");
    }

    if (
      props.scheduledStartAt !== null &&
      props.scheduledEndAt !== null &&
      props.scheduledEndAt.getTime() < props.scheduledStartAt.getTime()
    ) {
      throw new ValidationError("Scheduled session end must be after start");
    }

    if (
      props.actualStartAt !== null &&
      props.actualEndAt !== null &&
      props.actualEndAt.getTime() < props.actualStartAt.getTime()
    ) {
      throw new ValidationError("Actual session end must be after start");
    }
  }
}
