import { Prisma } from "@prisma/client";
import { Location } from "@modules/locations/domain/entities/Location";
import { LocationStatus } from "@modules/locations/domain/value-objects/LocationStatus";
import { LocationType } from "@modules/locations/domain/value-objects/LocationType";
import { LocationVisibility } from "@modules/locations/domain/value-objects/LocationVisibility";

export interface LocationPersistenceRecord {
  id: string;
  campaignId: string;
  parentLocationId: string | null;
  name: string;
  type: string;
  shortDescription: string | null;
  description: string | null;
  gmNotes: string | null;
  mapImageUrl: string | null;
  coordinates: unknown | null;
  status: string;
  visibility: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class LocationMapper {
  public toDomain(prismaLocation: LocationPersistenceRecord): Location {
    return Location.create({
      id: prismaLocation.id,
      campaignId: prismaLocation.campaignId,
      parentLocationId: prismaLocation.parentLocationId,
      name: prismaLocation.name,
      type: LocationType.create(prismaLocation.type),
      shortDescription: prismaLocation.shortDescription,
      description: prismaLocation.description,
      gmNotes: prismaLocation.gmNotes,
      mapImageUrl: prismaLocation.mapImageUrl,
      coordinates: prismaLocation.coordinates,
      status: LocationStatus.create(prismaLocation.status),
      visibility: LocationVisibility.create(prismaLocation.visibility),
      createdById: prismaLocation.createdById,
      createdAt: prismaLocation.createdAt,
      updatedAt: prismaLocation.updatedAt,
      deletedAt: prismaLocation.deletedAt,
    });
  }

  public toPersistenceCreate(location: Location): Record<string, unknown> {
    return {
      id: location.id,
      campaignId: location.campaignId,
      parentLocationId: location.parentLocationId,
      name: location.name,
      type: location.type.value,
      shortDescription: location.shortDescription,
      description: location.description,
      gmNotes: location.gmNotes,
      mapImageUrl: location.mapImageUrl,
      coordinates: this.toJsonValue(location.coordinates),
      status: location.status.value,
      visibility: location.visibility.value,
      createdById: location.createdById,
      createdAt: location.createdAt,
      updatedAt: location.updatedAt,
      deletedAt: location.deletedAt,
    };
  }

  public toPersistenceUpdate(location: Location): Record<string, unknown> {
    return this.toPersistenceCreate(location);
  }

  private toJsonValue(value: unknown | null): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput {
    return value === null ? Prisma.JsonNull : (value as Prisma.InputJsonValue);
  }
}
