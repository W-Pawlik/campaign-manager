import { ForbiddenError, ValidationError } from "@core/application/errors/AppError";
import type { NpcAttitude } from "@modules/npcs/domain/value-objects/NpcAttitude";
import type { NpcImportance } from "@modules/npcs/domain/value-objects/NpcImportance";
import { NpcStatus } from "@modules/npcs/domain/value-objects/NpcStatus";

export interface NpcProps {
  id: string;
  campaignId: string;
  name: string;
  title: string | null;
  avatarUrl: string | null;
  race: string | null;
  occupation: string | null;
  faction: string | null;
  locationId: string | null;
  attitude: NpcAttitude;
  importance: NpcImportance;
  status: NpcStatus;
  publicDescription: string | null;
  gmNotes: string | null;
  appearance: string | null;
  personality: string | null;
  motivations: string | null;
  secrets: string | null;
  statBlock: unknown | null;
  externalReferenceId: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type UpdateNpcParams = Omit<
  Partial<NpcProps>,
  "id" | "campaignId" | "createdById" | "createdAt" | "updatedAt" | "deletedAt"
>;

export class Npc {
  public readonly id: string;
  public readonly campaignId: string;
  public readonly name: string;
  public readonly title: string | null;
  public readonly avatarUrl: string | null;
  public readonly race: string | null;
  public readonly occupation: string | null;
  public readonly faction: string | null;
  public readonly locationId: string | null;
  public readonly attitude: NpcAttitude;
  public readonly importance: NpcImportance;
  public readonly status: NpcStatus;
  public readonly publicDescription: string | null;
  public readonly gmNotes: string | null;
  public readonly appearance: string | null;
  public readonly personality: string | null;
  public readonly motivations: string | null;
  public readonly secrets: string | null;
  public readonly statBlock: unknown | null;
  public readonly externalReferenceId: string | null;
  public readonly createdById: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt: Date | null;

  private constructor(props: NpcProps) {
    this.id = props.id;
    this.campaignId = props.campaignId;
    this.name = props.name;
    this.title = props.title;
    this.avatarUrl = props.avatarUrl;
    this.race = props.race;
    this.occupation = props.occupation;
    this.faction = props.faction;
    this.locationId = props.locationId;
    this.attitude = props.attitude;
    this.importance = props.importance;
    this.status = props.status;
    this.publicDescription = props.publicDescription;
    this.gmNotes = props.gmNotes;
    this.appearance = props.appearance;
    this.personality = props.personality;
    this.motivations = props.motivations;
    this.secrets = props.secrets;
    this.statBlock = props.statBlock;
    this.externalReferenceId = props.externalReferenceId;
    this.createdById = props.createdById;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
  }

  public static create(props: NpcProps): Npc {
    Npc.validate(props);

    return new Npc(props);
  }

  public withUpdates(params: UpdateNpcParams): Npc {
    this.ensureIsEditable();

    return Npc.create({
      ...this.toProps(),
      ...params,
      updatedAt: new Date(),
    });
  }

  public softDelete(deletedAt: Date): Npc {
    if (this.deletedAt !== null) {
      return this;
    }

    return Npc.create({
      ...this.toProps(),
      status: NpcStatus.archived(),
      updatedAt: deletedAt,
      deletedAt,
    });
  }

  public ensureIsEditable(): void {
    this.ensureIsNotDeleted();

    if (this.status.isArchived()) {
      throw new ForbiddenError("Archived NPC cannot be edited");
    }
  }

  public ensureIsNotDeleted(): void {
    if (this.deletedAt !== null) {
      throw new ForbiddenError("Deleted NPC cannot be modified");
    }
  }

  private toProps(): NpcProps {
    return {
      id: this.id,
      campaignId: this.campaignId,
      name: this.name,
      title: this.title,
      avatarUrl: this.avatarUrl,
      race: this.race,
      occupation: this.occupation,
      faction: this.faction,
      locationId: this.locationId,
      attitude: this.attitude,
      importance: this.importance,
      status: this.status,
      publicDescription: this.publicDescription,
      gmNotes: this.gmNotes,
      appearance: this.appearance,
      personality: this.personality,
      motivations: this.motivations,
      secrets: this.secrets,
      statBlock: this.statBlock,
      externalReferenceId: this.externalReferenceId,
      createdById: this.createdById,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  private static validate(props: NpcProps): void {
    const trimmedName = props.name.trim();

    if (trimmedName.length < 1 || trimmedName.length > 120) {
      throw new ValidationError("NPC name must be between 1 and 120 characters");
    }
  }
}
