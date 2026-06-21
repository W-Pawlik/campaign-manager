import { ValidationError } from "@core/application/errors/AppError";
import type { ObjectiveStatus } from "@modules/quests/domain/value-objects/ObjectiveStatus";

export interface QuestObjectiveProps {
  id: string;
  questId: string;
  title: string;
  description: string | null;
  status: ObjectiveStatus;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export type UpdateQuestObjectiveParams = Omit<Partial<QuestObjectiveProps>, "id" | "questId" | "createdAt" | "updatedAt">;

export class QuestObjective {
  public readonly id: string;
  public readonly questId: string;
  public readonly title: string;
  public readonly description: string | null;
  public readonly status: ObjectiveStatus;
  public readonly sortOrder: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  private constructor(props: QuestObjectiveProps) {
    this.id = props.id;
    this.questId = props.questId;
    this.title = props.title;
    this.description = props.description;
    this.status = props.status;
    this.sortOrder = props.sortOrder;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public static create(props: QuestObjectiveProps): QuestObjective {
    QuestObjective.validate(props);

    return new QuestObjective(props);
  }

  public withUpdates(params: UpdateQuestObjectiveParams): QuestObjective {
    return QuestObjective.create({
      ...this.toProps(),
      ...params,
      updatedAt: new Date(),
    });
  }

  private toProps(): QuestObjectiveProps {
    return {
      id: this.id,
      questId: this.questId,
      title: this.title,
      description: this.description,
      status: this.status,
      sortOrder: this.sortOrder,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  private static validate(props: QuestObjectiveProps): void {
    const trimmedTitle = props.title.trim();

    if (trimmedTitle.length < 1 || trimmedTitle.length > 200) {
      throw new ValidationError("Quest objective title must be between 1 and 200 characters");
    }

    if (!Number.isInteger(props.sortOrder) || props.sortOrder < 0) {
      throw new ValidationError("Quest objective sort order must be a non-negative integer");
    }
  }
}
