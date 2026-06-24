import type { PrismaClient } from "@prisma/client";
import type { Container } from "inversify";
import { CORE_TYPES } from "@core/di/core.types";
import { GetExternalResourceDetailsHandler } from "@modules/external-references/application/handlers/GetExternalResourceDetailsHandler";
import { ListOpen5eCreatureCatalogHandler } from "@modules/external-references/application/handlers/ListOpen5eCreatureCatalogHandler";
import { ListOpen5eItemCatalogHandler } from "@modules/external-references/application/handlers/ListOpen5eItemCatalogHandler";
import { SearchExternalResourcesHandler } from "@modules/external-references/application/handlers/SearchExternalResourcesHandler";
import type { ExternalReferenceRepository } from "@modules/external-references/application/ports/ExternalReferenceRepository";
import type { Open5eClient } from "@modules/external-references/application/ports/Open5eClient";
import { Open5eExternalReferenceResolver } from "@modules/external-references/application/services/Open5eExternalReferenceResolver";
import { Open5eHttpAdapter } from "@modules/external-references/infrastructure/open5e/Open5eHttpAdapter";
import { Open5eMapper } from "@modules/external-references/infrastructure/open5e/Open5eMapper";
import { ExternalReferenceMapper } from "@modules/external-references/infrastructure/persistence/ExternalReferenceMapper";
import { PrismaExternalReferenceRepository } from "@modules/external-references/infrastructure/persistence/PrismaExternalReferenceRepository";
import { EXTERNAL_REFERENCES_TYPES } from "@modules/external-references/external-references.types";

export function loadExternalReferencesContainerModule(
  container: Container,
): void {
  container
    .bind<ExternalReferenceMapper>(EXTERNAL_REFERENCES_TYPES.ExternalReferenceMapper)
    .toDynamicValue(() => new ExternalReferenceMapper())
    .inSingletonScope();

  container
    .bind<Open5eMapper>(EXTERNAL_REFERENCES_TYPES.Open5eMapper)
    .toDynamicValue(() => new Open5eMapper())
    .inSingletonScope();

  container
    .bind<ExternalReferenceRepository>(
      EXTERNAL_REFERENCES_TYPES.ExternalReferenceRepository,
    )
    .toDynamicValue((context) => {
      const prismaClient = context.get<PrismaClient>(CORE_TYPES.PrismaClient);
      const mapper = context.get<ExternalReferenceMapper>(
        EXTERNAL_REFERENCES_TYPES.ExternalReferenceMapper,
      );

      return new PrismaExternalReferenceRepository(prismaClient, mapper);
    })
    .inSingletonScope();

  container
    .bind<Open5eClient>(EXTERNAL_REFERENCES_TYPES.Open5eClient)
    .toDynamicValue((context) => {
      const mapper = context.get<Open5eMapper>(EXTERNAL_REFERENCES_TYPES.Open5eMapper);

      return new Open5eHttpAdapter(mapper);
    })
    .inTransientScope();

  container
    .bind<Open5eExternalReferenceResolver>(
      EXTERNAL_REFERENCES_TYPES.Open5eExternalReferenceResolver,
    )
    .toDynamicValue((context) => {
      const repository = context.get<ExternalReferenceRepository>(
        EXTERNAL_REFERENCES_TYPES.ExternalReferenceRepository,
      );
      const open5eClient = context.get<Open5eClient>(
        EXTERNAL_REFERENCES_TYPES.Open5eClient,
      );

      return new Open5eExternalReferenceResolver(repository, open5eClient);
    })
    .inTransientScope();

  container
    .bind<SearchExternalResourcesHandler>(
      EXTERNAL_REFERENCES_TYPES.SearchExternalResourcesHandler,
    )
    .toDynamicValue((context) => {
      const open5eClient = context.get<Open5eClient>(
        EXTERNAL_REFERENCES_TYPES.Open5eClient,
      );

      return new SearchExternalResourcesHandler(open5eClient);
    })
    .inTransientScope();

  container
    .bind<ListOpen5eCreatureCatalogHandler>(
      EXTERNAL_REFERENCES_TYPES.ListOpen5eCreatureCatalogHandler,
    )
    .toDynamicValue((context) => {
      const open5eClient = context.get<Open5eClient>(
        EXTERNAL_REFERENCES_TYPES.Open5eClient,
      );

      return new ListOpen5eCreatureCatalogHandler(open5eClient);
    })
    .inTransientScope();

  container
    .bind<ListOpen5eItemCatalogHandler>(
      EXTERNAL_REFERENCES_TYPES.ListOpen5eItemCatalogHandler,
    )
    .toDynamicValue((context) => {
      const open5eClient = context.get<Open5eClient>(
        EXTERNAL_REFERENCES_TYPES.Open5eClient,
      );

      return new ListOpen5eItemCatalogHandler(open5eClient);
    })
    .inTransientScope();

  container
    .bind<GetExternalResourceDetailsHandler>(
      EXTERNAL_REFERENCES_TYPES.GetExternalResourceDetailsHandler,
    )
    .toDynamicValue((context) => {
      const resolver = context.get<Open5eExternalReferenceResolver>(
        EXTERNAL_REFERENCES_TYPES.Open5eExternalReferenceResolver,
      );

      return new GetExternalResourceDetailsHandler(resolver);
    })
    .inTransientScope();
}
