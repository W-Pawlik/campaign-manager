import type { PrismaClient } from "@prisma/client";
import type { LocationRepository } from "@modules/locations/application/ports/LocationRepository";
import type { Location } from "@modules/locations/domain/entities/Location";
import type {
  LocationMapper,
  LocationPersistenceRecord,
} from "@modules/locations/infrastructure/persistence/LocationMapper";

interface LocationDelegate {
  findFirst(args: unknown): Promise<LocationPersistenceRecord | null>;
  create(args: unknown): Promise<unknown>;
  update(args: unknown): Promise<unknown>;
}

export class PrismaLocationRepository implements LocationRepository {
  public constructor(
    private readonly prismaClient: PrismaClient,
    private readonly mapper: LocationMapper,
  ) {}

  public async findById(campaignId: string, locationId: string): Promise<Location | null> {
    const locationClient = this.prismaClient as PrismaClient & { location: LocationDelegate };
    const location = await locationClient.location.findFirst({
      where: {
        id: locationId,
        campaignId,
        deletedAt: null,
      },
    });

    return location === null ? null : this.mapper.toDomain(location);
  }

  public async create(location: Location): Promise<void> {
    const locationClient = this.prismaClient as PrismaClient & { location: LocationDelegate };

    await locationClient.location.create({
      data: this.mapper.toPersistenceCreate(location),
    });
  }

  public async save(location: Location): Promise<void> {
    const locationClient = this.prismaClient as PrismaClient & { location: LocationDelegate };

    await locationClient.location.update({
      where: { id: location.id },
      data: this.mapper.toPersistenceUpdate(location),
    });
  }
}
