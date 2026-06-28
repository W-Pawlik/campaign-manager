import { ValidationError } from "@core/application/errors/AppError";

export interface FightEncounterProps {
  id: string;
  campaignId: string;
  name: string;
  environmentName: string;
  environmentDetails: string;
  combatantCount: number;
  conditionCount: number;
  preparationData: unknown | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date | null;
}

export class FightEncounter {
  public readonly id: string;
  public readonly campaignId: string;
  public readonly name: string;
  public readonly environmentName: string;
  public readonly environmentDetails: string;
  public readonly combatantCount: number;
  public readonly conditionCount: number;
  public readonly preparationData: unknown | null;
  public readonly createdById: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly archivedAt: Date | null;

  private constructor(props: FightEncounterProps) {
    this.id = props.id;
    this.campaignId = props.campaignId;
    this.name = props.name;
    this.environmentName = props.environmentName;
    this.environmentDetails = props.environmentDetails;
    this.combatantCount = props.combatantCount;
    this.conditionCount = props.conditionCount;
    this.preparationData = props.preparationData;
    this.createdById = props.createdById;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.archivedAt = props.archivedAt;
  }

  public static create(props: FightEncounterProps): FightEncounter {
    FightEncounter.validate(props);

    return new FightEncounter(props);
  }

  public updatePreparation(input: {
    name: string;
    environmentName: string;
    environmentDetails: string;
    combatantCount: number;
    conditionCount: number;
    preparationData: unknown | null;
    updatedAt: Date;
  }): FightEncounter {
    return FightEncounter.create({
      id: this.id,
      campaignId: this.campaignId,
      name: input.name.trim(),
      environmentName: input.environmentName.trim(),
      environmentDetails: input.environmentDetails.trim(),
      combatantCount: input.combatantCount,
      conditionCount: input.conditionCount,
      preparationData: input.preparationData,
      createdById: this.createdById,
      createdAt: this.createdAt,
      updatedAt: input.updatedAt,
      archivedAt: this.archivedAt,
    });
  }

  public archive(archivedAt: Date): FightEncounter {
    return FightEncounter.create({
      id: this.id,
      campaignId: this.campaignId,
      name: this.name,
      environmentName: this.environmentName,
      environmentDetails: this.environmentDetails,
      combatantCount: this.combatantCount,
      conditionCount: this.conditionCount,
      preparationData: this.preparationData,
      createdById: this.createdById,
      createdAt: this.createdAt,
      updatedAt: archivedAt,
      archivedAt,
    });
  }

  private static validate(props: FightEncounterProps): void {
    if (props.name.trim().length < 1 || props.name.trim().length > 120) {
      throw new ValidationError("Fight encounter name must be between 1 and 120 characters");
    }

    if (props.environmentName.trim().length < 1 || props.environmentName.trim().length > 120) {
      throw new ValidationError("Encounter environment name must be between 1 and 120 characters");
    }

    if (
      props.environmentDetails.trim().length < 1 ||
      props.environmentDetails.trim().length > 5000
    ) {
      throw new ValidationError("Encounter environment details must be between 1 and 5000 characters");
    }

    if (props.combatantCount < 0 || props.conditionCount < 0) {
      throw new ValidationError("Encounter counters cannot be negative");
    }
  }
}
