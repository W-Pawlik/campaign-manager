import { describe, expect, it, vi } from "vitest";
import { ForbiddenError, ValidationError } from "@core/application/errors/AppError";
import type { LocationReadRepository } from "@modules/locations/application/ports/LocationReadRepository";
import { LocationHierarchyApplicationService } from "@modules/locations/application/services/LocationHierarchyApplicationService";
import { Location } from "@modules/locations/domain/entities/Location";
import { LocationStatus } from "@modules/locations/domain/value-objects/LocationStatus";
import { LocationType } from "@modules/locations/domain/value-objects/LocationType";
import { LocationVisibility } from "@modules/locations/domain/value-objects/LocationVisibility";

function createLocation(
  id: string,
  parentLocationId: string | null,
  name: string,
): Location {
  return Location.create({
    id,
    campaignId: "campaign-1",
    parentLocationId,
    name,
    type: LocationType.create("CITY"),
    shortDescription: null,
    description: null,
    gmNotes: null,
    mapImageUrl: null,
    coordinates: null,
    status: LocationStatus.active(),
    visibility: LocationVisibility.create("PUBLIC"),
    createdById: "gm-1",
    createdAt: new Date("2026-06-20T10:00:00.000Z"),
    updatedAt: new Date("2026-06-20T10:00:00.000Z"),
    deletedAt: null,
  });
}

function createReadRepository(locations: Location[]): LocationReadRepository {
  return {
    listCampaignLocations: vi.fn().mockResolvedValue(locations),
    getLocationDetails: vi.fn(),
  };
}

describe("LocationHierarchyApplicationService", () => {
  it("rejects parent location from outside the campaign list", async () => {
    const service = new LocationHierarchyApplicationService(createReadRepository([]));

    await expect(service.ensureParentIsValid("campaign-1", "missing-parent")).rejects.toBeInstanceOf(
      ValidationError,
    );
  });

  it("rejects cycles in the hierarchy", async () => {
    const root = createLocation("root", null, "Root");
    const child = createLocation("child", "root", "Child");
    const grandchild = createLocation("grandchild", "child", "Grandchild");
    const service = new LocationHierarchyApplicationService(
      createReadRepository([root, child, grandchild]),
    );

    await expect(
      service.ensureParentIsValid("campaign-1", "grandchild", "root"),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("blocks deleting location with children", async () => {
    const root = createLocation("root", null, "Root");
    const child = createLocation("child", "root", "Child");
    const service = new LocationHierarchyApplicationService(createReadRepository([root, child]));

    await expect(service.ensureHasNoChildren("campaign-1", "root")).rejects.toBeInstanceOf(
      ForbiddenError,
    );
  });
});
