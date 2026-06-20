import type { PrismaClient } from "@prisma/client";
import type { LocationReadRepository } from "@modules/locations/application/ports/LocationReadRepository";
import type { Location } from "@modules/locations/domain/entities/Location";
import type {
  LocationMapper,
  LocationPersistenceRecord,
} from "@modules/locations/infrastructure/persistence/LocationMapper";

interface LocationReadDelegate {
  findMany(args: unknown): Promise<LocationPersistenceRecord[]>;
  findFirst(args: unknown): Promise<LocationPersistenceRecord | null>;
}

export class PrismaLocationReadRepository implements LocationReadRepository {
  public constructor(
    private readonly prismaClient: PrismaClient,
    private readonly mapper: LocationMapper,
  ) {}

  public async listCampaignLocations(campaignId: string): Promise<Location[]> {
    const locationClient = this.prismaClient as PrismaClient & { location: LocationReadDelegate };
    const locations = await locationClient.location.findMany({
      where: {
        campaignId,
        deletedAt: null,
      },
      orderBy: [
        { name: "asc" },
        { createdAt: "asc" },
      ],
    });

    return locations.map((location) => this.mapper.toDomain(location));
  }

  public async getLocationDetails(campaignId: string, locationId: string): Promise<Location | null> {
    const locationClient = this.prismaClient as PrismaClient & { location: LocationReadDelegate };
    const location = await locationClient.location.findFirst({
      where: {
        id: locationId,
        campaignId,
        deletedAt: null,
      },
    });

    return location === null ? null : this.mapper.toDomain(location);
  }
}
