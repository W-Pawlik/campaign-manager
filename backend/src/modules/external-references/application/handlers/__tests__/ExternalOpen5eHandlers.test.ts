import { describe, expect, it, vi } from "vitest";
import { ValidationError } from "@core/application/errors/AppError";
import { GetExternalResourceDetailsHandler } from "@modules/external-references/application/handlers/GetExternalResourceDetailsHandler";
import { ListOpen5eCreatureCatalogHandler } from "@modules/external-references/application/handlers/ListOpen5eCreatureCatalogHandler";
import { SearchExternalResourcesHandler } from "@modules/external-references/application/handlers/SearchExternalResourcesHandler";
import type { ExternalReferenceRepository } from "@modules/external-references/application/ports/ExternalReferenceRepository";
import type { Open5eClient } from "@modules/external-references/application/ports/Open5eClient";
import { GetExternalResourceDetailsQuery } from "@modules/external-references/application/queries/GetExternalResourceDetailsQuery";
import { ListOpen5eCreatureCatalogQuery } from "@modules/external-references/application/queries/ListOpen5eCreatureCatalogQuery";
import { SearchExternalResourcesQuery } from "@modules/external-references/application/queries/SearchExternalResourcesQuery";
import { Open5eExternalReferenceResolver } from "@modules/external-references/application/services/Open5eExternalReferenceResolver";
import { ExternalReference } from "@modules/external-references/domain/entities/ExternalReference";
import { ExternalProvider } from "@modules/external-references/domain/value-objects/ExternalProvider";
import { ExternalResourceType } from "@modules/external-references/domain/value-objects/ExternalResourceType";

function createExternalReference(): ExternalReference {
  return ExternalReference.create({
    id: "external-reference-1",
    provider: ExternalProvider.open5e(),
    resourceType: ExternalResourceType.create("CREATURE"),
    externalId: null,
    key: "goblin",
    slug: "goblin",
    url: "https://api.open5e.com/v2/creatures/goblin/",
    name: "Goblin",
    sourceDocumentKey: "srd-2024",
    sourceDocumentName: "SRD 2024",
    rawData: {
      key: "goblin",
      illustration: {
        file_url: "/static/img/object_illustrations/open5e-illustrations/monsters/goblin.png",
      },
    },
    normalizedData: { name: "Goblin", challengeRating: "1/4" },
    cachedAt: new Date("2026-06-22T10:00:00.000Z"),
    expiresAt: new Date("2026-07-22T10:00:00.000Z"),
    createdAt: new Date("2026-06-22T10:00:00.000Z"),
    updatedAt: new Date("2026-06-22T10:00:00.000Z"),
  });
}

function createRepository(
  overrides: Partial<ExternalReferenceRepository> = {},
): ExternalReferenceRepository {
  return {
    findById: vi.fn().mockResolvedValue(null),
    findByProviderResourceTypeAndKey: vi.fn().mockResolvedValue(null),
    create: vi.fn(),
    save: vi.fn(),
    ...overrides,
  };
}

describe("External Open5e handlers", () => {
  it("maps Open5e search results into lightweight DTOs", async () => {
    const open5eClient: Open5eClient = {
      listCreatures: vi.fn(),
      search: vi.fn().mockResolvedValue([
        {
          provider: "OPEN5E",
          resourceType: "CREATURE",
          key: "goblin",
          name: "Goblin",
          summary: "Goblin",
          highlighted: "<span>Goblin</span>",
          sourceDocumentKey: "srd-2024",
          sourceDocumentName: "SRD 2024",
          metadata: { challengeRating: "1/4" },
        },
      ]),
      getResource: vi.fn(),
    };
    const handler = new SearchExternalResourcesHandler(open5eClient);

    const result = await handler.execute(
      new SearchExternalResourcesQuery({
        provider: "OPEN5E",
        query: "goblin",
        resourceTypes: ["CREATURE"],
        limit: 10,
        page: 1,
      }),
    );

    expect(open5eClient.search).toHaveBeenCalledWith({
      query: "goblin",
      resourceTypes: ["CREATURE"],
      limit: 10,
      page: 1,
    });
    expect(result).toEqual([
      {
        provider: "OPEN5E",
        resourceType: "CREATURE",
        key: "goblin",
        name: "Goblin",
        summary: "Goblin",
        highlighted: "<span>Goblin</span>",
        sourceDocumentKey: "srd-2024",
        sourceDocumentName: "SRD 2024",
        metadata: { challengeRating: "1/4" },
      },
    ]);
  });

  it("validates search query minimum length", async () => {
    const open5eClient: Open5eClient = {
      listCreatures: vi.fn(),
      search: vi.fn(),
      getResource: vi.fn(),
    };
    const handler = new SearchExternalResourcesHandler(open5eClient);

    await expect(
      handler.execute(
        new SearchExternalResourcesQuery({
          provider: "OPEN5E",
          query: "g",
        }),
      ),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("lists Open5e creatures as paginated catalog results", async () => {
    const open5eClient: Open5eClient = {
      listCreatures: vi.fn().mockResolvedValue({
        items: [
          {
            provider: "OPEN5E",
            resourceType: "CREATURE",
            key: "goblin",
            name: "Goblin",
            illustrationUrl: "https://cdn.example.com/goblin.webp",
            sourceDocumentKey: "srd-2024",
            sourceDocumentName: "SRD 2024",
            metadata: { challengeRating: "1/4" },
          },
        ],
        limit: 20,
        page: 2,
        total: 45,
        hasNext: true,
      }),
      search: vi.fn(),
      getResource: vi.fn(),
    };
    const handler = new ListOpen5eCreatureCatalogHandler(open5eClient);

    const result = await handler.execute(
      new ListOpen5eCreatureCatalogQuery({
        actorUserId: "user-1",
        search: "goblin",
        page: 2,
      }),
    );

    expect(open5eClient.listCreatures).toHaveBeenCalledWith({
      search: "goblin",
      limit: 20,
      page: 2,
    });
    expect(result.total).toBe(45);
    expect(result.hasNext).toBe(true);
    expect(result.items[0]?.key).toBe("goblin");
    expect(result.items[0]?.illustrationUrl).toBe("https://cdn.example.com/goblin.webp");
  });

  it("returns cached external resource details without refetching when reference is fresh", async () => {
    const externalReference = createExternalReference();
    const repository = createRepository({
      findByProviderResourceTypeAndKey: vi.fn().mockResolvedValue(externalReference),
    });
    const open5eClient: Open5eClient = {
      listCreatures: vi.fn(),
      search: vi.fn(),
      getResource: vi.fn(),
    };
    const resolver = new Open5eExternalReferenceResolver(repository, open5eClient);
    const handler = new GetExternalResourceDetailsHandler(resolver);

    const result = await handler.execute(
      new GetExternalResourceDetailsQuery({
        provider: "OPEN5E",
        resourceType: "CREATURE",
        key: "goblin",
      }),
    );

    expect(open5eClient.getResource).not.toHaveBeenCalled();
    expect(result.id).toBe("external-reference-1");
    expect(result.key).toBe("goblin");
    expect(result.illustrationUrl).toBe(
      "https://open5e.com/static/img/object_illustrations/open5e-illustrations/monsters/goblin.png",
    );
    expect(result.normalizedData).toEqual({
      name: "Goblin",
      challengeRating: "1/4",
      illustrationUrl:
        "https://open5e.com/static/img/object_illustrations/open5e-illustrations/monsters/goblin.png",
    });
  });
});
