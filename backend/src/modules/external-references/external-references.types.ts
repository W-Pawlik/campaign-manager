export const EXTERNAL_REFERENCES_TYPES = {
  ExternalReferenceMapper: Symbol.for(
    "external-references.ExternalReferenceMapper",
  ),
  ExternalReferenceRepository: Symbol.for(
    "external-references.ExternalReferenceRepository",
  ),
  Open5eMapper: Symbol.for("external-references.Open5eMapper"),
  Open5eClient: Symbol.for("external-references.Open5eClient"),
  Open5eExternalReferenceResolver: Symbol.for(
    "external-references.Open5eExternalReferenceResolver",
  ),
  SearchExternalResourcesHandler: Symbol.for(
    "external-references.SearchExternalResourcesHandler",
  ),
  ListOpen5eCreatureCatalogHandler: Symbol.for(
    "external-references.ListOpen5eCreatureCatalogHandler",
  ),
  ListOpen5eItemCatalogHandler: Symbol.for(
    "external-references.ListOpen5eItemCatalogHandler",
  ),
  GetExternalResourceDetailsHandler: Symbol.for(
    "external-references.GetExternalResourceDetailsHandler",
  ),
} as const;
