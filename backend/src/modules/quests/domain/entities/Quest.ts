import { ForbiddenError, ValidationError } from "@core/application/errors/AppError";
import type { QuestStatus } from "@modules/quests/domain/value-objects/QuestStatus";
import type { QuestPriority } from "@modules/quests/domain/value-objects/QuestPriority";
import type { QuestType } from "@modules/quests/domain/value-objects/QuestType";
import type { QuestVisibility } from "@modules/quests/domain/value-objects/QuestVisibility";

export interface QuestProps {
  id: string;
  campaignId: string;
  title: string;
  description: string | null;
  status: QuestStatus;
  type: QuestType;
  visibility: QuestVisibility;
  priority: QuestPriority;
  giverNpcId: string | null;
  relatedLocationId: string | null;
  startedAt: Date | null;
  completedAt: Date | null;
  failedAt: Date | null;
  rewardDescription: string | null;
  gmNotes: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type UpdateQuestParams = Omit<Partial<QuestProps>, "id" | "campaignId" | "createdById" | "createdAt" | "updatedAt" | "deletedAt">;

export class Quest {
  public readonly id: string;
  public readonly campaignId: string;
  public readonly title: string;
  public readonly description: string | null;
  public readonly status: QuestStatus;
  public readonly type: QuestType;
  public readonly visibility: QuestVisibility;
  public readonly priority: QuestPriority;
  public readonly giverNpcId: string | null;
  public readonly relatedLocationId: string | null;
  public readonly startedAt: Date | null;
  public readonly completedAt: Date | null;
  public readonly failedAt: Date | null;
  public readonly rewardDescription: string | null;
  public readonly gmNotes: string | null;
  public readonly createdById: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt: Date | null;

  private constructor(props: QuestProps) {
    this.id = props.id;
    this.campaignId = props.campaignId;
    this.title = props.title;
    this.description = props.description;
    this.status = props.status;
    this.type = props.type;
    this.visibility = props.visibility;
    this.priority = props.priority;
    this.giverNpcId = props.giverNpcId;
    this.relatedLocationId = props.relatedLocationId;
    this.startedAt = props.startedAt;
    this.completedAt = props.completedAt;
    this.failedAt = props.failedAt;
    this.rewardDescription = props.rewardDescription;
    this.gmNotes = props.gmNotes;
    this.createdById = props.createdById;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
  }

  public static create(props: QuestProps): Quest {
    Quest.validate(props);

    return new Quest(props);
  }

  public withUpdates(params: UpdateQuestParams): Quest {
    this.ensureEditable();

    return Quest.create({
      ...this.toProps(),
      ...params,
      updatedAt: new Date(),
    });
  }

  public changeStatus(nextStatus: QuestStatus, changedAt: Date): Quest {
    this.ensureNotDeleted();

    if (this.status.value === nextStatus.value) {
      return this;
    }

    return Quest.create({
      ...this.toProps(),
      status: nextStatus,
      startedAt: nextStatus.isActive() ? (this.startedAt ?? changedAt) : this.startedAt,
      completedAt: nextStatus.isCompleted() ? changedAt : null,
      failedAt: nextStatus.isFailed() ? changedAt : null,
      updatedAt: changedAt,
    });
  }

  public softDelete(deletedAt: Date): Quest {
    if (this.deletedAt !== null) {
      return this;
    }

    return Quest.create({
      ...this.toProps(),
      updatedAt: deletedAt,
      deletedAt,
    });
  }

  public ensureEditable(): void {
    this.ensureNotDeleted();
  }

  public ensureNotDeleted(): void {
    if (this.deletedAt !== null) {
      throw new ForbiddenError("Deleted quest cannot be modified");
    }
  }

  private toProps(): QuestProps {
    return {
      id: this.id,
      campaignId: this.campaignId,
      title: this.title,
      description: this.description,
      status: this.status,
      type: this.type,
      visibility: this.visibility,
      priority: this.priority,
      giverNpcId: this.giverNpcId,
      relatedLocationId: this.relatedLocationId,
      startedAt: this.startedAt,
      completedAt: this.completedAt,
      failedAt: this.failedAt,
      rewardDescription: this.rewardDescription,
      gmNotes: this.gmNotes,
      createdById: this.createdById,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  private static validate(props: QuestProps): void {
    const trimmedTitle = props.title.trim();

    if (trimmedTitle.length < 1 || trimmedTitle.length > 200) {
      throw new ValidationError("Quest title must be between 1 and 200 characters");
    }
  }
}
