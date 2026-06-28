import { ConflictError, ValidationError } from "@core/application/errors/AppError";

export const FIGHT_ENCOUNTER_RUN_STATUS = {
  ACTIVE: "ACTIVE",
  FINISHED: "FINISHED",
} as const;

export type FightEncounterRunStatusValue =
  (typeof FIGHT_ENCOUNTER_RUN_STATUS)[keyof typeof FIGHT_ENCOUNTER_RUN_STATUS];

export interface FightEncounterRunProps {
  id: string;
  campaignId: string;
  encounterId: string;
  status: FightEncounterRunStatusValue;
  startedById: string;
  finishedById: string | null;
  roundsCompleted: number;
  durationSeconds: number | null;
  outcomeLabel: string | null;
  summaryData: unknown | null;
  startedAt: Date;
  finishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class FightEncounterRun {
  public readonly id: string;
  public readonly campaignId: string;
  public readonly encounterId: string;
  public readonly status: FightEncounterRunStatusValue;
  public readonly startedById: string;
  public readonly finishedById: string | null;
  public readonly roundsCompleted: number;
  public readonly durationSeconds: number | null;
  public readonly outcomeLabel: string | null;
  public readonly summaryData: unknown | null;
  public readonly startedAt: Date;
  public readonly finishedAt: Date | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  private constructor(props: FightEncounterRunProps) {
    this.id = props.id;
    this.campaignId = props.campaignId;
    this.encounterId = props.encounterId;
    this.status = props.status;
    this.startedById = props.startedById;
    this.finishedById = props.finishedById;
    this.roundsCompleted = props.roundsCompleted;
    this.durationSeconds = props.durationSeconds;
    this.outcomeLabel = props.outcomeLabel;
    this.summaryData = props.summaryData;
    this.startedAt = props.startedAt;
    this.finishedAt = props.finishedAt;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public static create(props: FightEncounterRunProps): FightEncounterRun {
    FightEncounterRun.validate(props);

    return new FightEncounterRun(props);
  }

  public finish(input: {
    finishedById: string;
    roundsCompleted: number;
    durationSeconds: number;
    outcomeLabel: string;
    summaryData: unknown | null;
    finishedAt: Date;
  }): FightEncounterRun {
    if (this.status === FIGHT_ENCOUNTER_RUN_STATUS.FINISHED) {
      throw new ConflictError("Fight encounter run is already finished");
    }

    return FightEncounterRun.create({
      ...this.toProps(),
      status: FIGHT_ENCOUNTER_RUN_STATUS.FINISHED,
      finishedById: input.finishedById,
      roundsCompleted: input.roundsCompleted,
      durationSeconds: input.durationSeconds,
      outcomeLabel: input.outcomeLabel.trim(),
      summaryData: input.summaryData,
      finishedAt: input.finishedAt,
      updatedAt: input.finishedAt,
    });
  }

  public updateState(input: {
    roundsCompleted: number;
    durationSeconds: number | null;
    stateData: unknown | null;
    updatedAt: Date;
  }): FightEncounterRun {
    if (this.status !== FIGHT_ENCOUNTER_RUN_STATUS.ACTIVE) {
      throw new ConflictError("Only an active fight encounter run can be updated");
    }

    return FightEncounterRun.create({
      ...this.toProps(),
      roundsCompleted: input.roundsCompleted,
      durationSeconds: input.durationSeconds,
      summaryData: input.stateData,
      updatedAt: input.updatedAt,
    });
  }

  private toProps(): FightEncounterRunProps {
    return {
      id: this.id,
      campaignId: this.campaignId,
      encounterId: this.encounterId,
      status: this.status,
      startedById: this.startedById,
      finishedById: this.finishedById,
      roundsCompleted: this.roundsCompleted,
      durationSeconds: this.durationSeconds,
      outcomeLabel: this.outcomeLabel,
      summaryData: this.summaryData,
      startedAt: this.startedAt,
      finishedAt: this.finishedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  private static validate(props: FightEncounterRunProps): void {
    if (
      props.status !== FIGHT_ENCOUNTER_RUN_STATUS.ACTIVE &&
      props.status !== FIGHT_ENCOUNTER_RUN_STATUS.FINISHED
    ) {
      throw new ValidationError("Invalid fight encounter run status");
    }

    if (props.roundsCompleted < 0) {
      throw new ValidationError("Rounds completed cannot be negative");
    }

    if (props.durationSeconds !== null && props.durationSeconds < 0) {
      throw new ValidationError("Duration seconds cannot be negative");
    }
  }
}
