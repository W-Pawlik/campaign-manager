import type { Container } from "inversify";
import type { QueryBus } from "@core/application/cqrs/QueryBus";
import { CORE_TYPES } from "@core/di/core.types";
import { GetExternalResourceDetailsQuery } from "@modules/external-references/application/queries/GetExternalResourceDetailsQuery";
import { SearchExternalResourcesQuery } from "@modules/external-references/application/queries/SearchExternalResourcesQuery";
import { EXTERNAL_REFERENCES_TYPES } from "@modules/external-references/external-references.types";

export function registerExternalReferencesHandlers(container: Container): void {
  const queryBus = container.get<QueryBus>(CORE_TYPES.QueryBus);

  queryBus.register(
    SearchExternalResourcesQuery.name,
    EXTERNAL_REFERENCES_TYPES.SearchExternalResourcesHandler,
  );
  queryBus.register(
    GetExternalResourceDetailsQuery.name,
    EXTERNAL_REFERENCES_TYPES.GetExternalResourceDetailsHandler,
  );
}
