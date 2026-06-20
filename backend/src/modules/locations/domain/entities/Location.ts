import { ForbiddenError, ValidationError } from "@core/application/errors/AppError";
import type { LocationStatus } from "@modules/locations/domain/value-objects/LocationStatus";
import type { LocationType } from "@modules/locations/domain/value-objects/LocationType";
import type { LocationVisibility } from "@modules/locations/domain/value-objects/LocationVisibility";

export interface LocationProps {
  id: string;
  campaignId: string;
  parentLocationId: string | null;
  name: string;
  type: LocationType;
  shortDescription: string | null;
  description: string | null;
  gmNotes: string | null;
  mapImageUrl: string | null;
  coordinates: unknown | null;
  status: LocationStatus;
  visibility: LocationVisibility;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type UpdateLocationParams = Omit<
  Partial<LocationProps>,
  "id" | "campaignId" | "createdById" | "createdAt" | "updatedAt" | "deletedAt"
>;

export class Location {
  public readonly id: string;
  public readonly campaignId: string;
  public readonly parentLocationId: string | null;
  public readonly name: string;
  public readonly type: LocationType;
  public readonly shortDescription: string | null;
  public readonly description: string | null;
  public readonly gmNotes: string | null;
  public readonly mapImageUrl: string | null;
  public readonly coordinates: unknown | null;
  public readonly status: LocationStatus;
  public readonly visibility: LocationVisibility;
  public readonly createdById: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt: Date | null;

  private constructor(props: LocationProps) {
    this.id = props.id;
    this.campaignId = props.campaignId;
    this.parentLocationId = props.parentLocationId;
    this.name = props.name;
    this.type = props.type;
    this.shortDescription = props.shortDescription;
    this.description = props.description;
    this.gmNotes = props.gmNotes;
    this.mapImageUrl = props.mapImageUrl;
    this.coordinates = props.coordinates;
    this.status = props.status;
    this.visibility = props.visibility;
    this.createdById = props.createdById;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
  }

  public static create(props: LocationProps): Location {
    Location.validate(props);

    return new Location(props);
  }

  public withUpdates(params: UpdateLocationParams): Location {
    this.ensureIsEditable();

    return Location.create({
      ...this.toProps(),
      ...params,
      updatedAt: new Date(),
    });
  }

  public softDelete(deletedAt: Date): Location {
    if (this.deletedAt !== null) {
      return this;
    }

    return Location.create({
      ...this.toProps(),
      updatedAt: deletedAt,
      deletedAt,
    });
  }

  public ensureIsEditable(): void {
    this.ensureIsNotDeleted();

    if (this.status.isArchived()) {
      throw new ForbiddenError("Archived location cannot be edited");
    }
  }

  public ensureIsNotDeleted(): void {
    if (this.deletedAt !== null) {
      throw new ForbiddenError("Deleted location cannot be modified");
    }
  }

  private toProps(): LocationProps {
    return {
      id: this.id,
      campaignId: this.campaignId,
      parentLocationId: this.parentLocationId,
      name: this.name,
      type: this.type,
      shortDescription: this.shortDescription,
      description: this.description,
      gmNotes: this.gmNotes,
      mapImageUrl: this.mapImageUrl,
      coordinates: this.coordinates,
      status: this.status,
      visibility: this.visibility,
      createdById: this.createdById,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  private static validate(props: LocationProps): void {
    const trimmedName = props.name.trim();

    if (trimmedName.length < 1 || trimmedName.length > 120) {
      throw new ValidationError("Location name must be between 1 and 120 characters");
    }
  }
}
