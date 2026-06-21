import { ValidationError } from "@core/application/errors/AppError";
import type { RelatedEntityType } from "@modules/notes/domain/value-objects/RelatedEntityType";

export interface QuestRelationProps {
  id: string;
  questId: string;
  entityType: RelatedEntityType;
  entityId: string;
  relationType: string;
  createdAt: Date;
}

export class QuestRelation {
  public readonly id: string;
  public readonly questId: string;
  public readonly entityType: RelatedEntityType;
  public readonly entityId: string;
  public readonly relationType: string;
  public readonly createdAt: Date;

  private constructor(props: QuestRelationProps) {
    this.id = props.id;
    this.questId = props.questId;
    this.entityType = props.entityType;
    this.entityId = props.entityId;
    this.relationType = props.relationType;
    this.createdAt = props.createdAt;
  }

  public static create(props: QuestRelationProps): QuestRelation {
    const relationType = props.relationType.trim();

    if (relationType.length < 1 || relationType.length > 120) {
      throw new ValidationError("Quest relation type must be between 1 and 120 characters");
    }

    return new QuestRelation({ ...props, relationType });
  }
}
