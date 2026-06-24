import type { ParsedQs } from "qs";
import { ValidationError } from "@core/application/errors/AppError";
import type { ListOpen5eItemCatalogInput } from "@modules/external-references/application/queries/ListOpen5eItemCatalogQuery";
import type { ListPublishedItemTemplatesInput } from "@modules/items/application/queries/ListPublishedItemTemplatesQuery";

interface BaseCatalogQueryParams {
  actorUserId: string;
  query: ParsedQs;
}

function parseOptionalString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length === 0 ? undefined : trimmedValue;
}

function parseOptionalPositiveInteger(value: unknown, fieldName: string): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new ValidationError(`${fieldName} must be a numeric query parameter`);
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    throw new ValidationError(`${fieldName} must be a positive integer query parameter`);
  }

  return parsedValue;
}

function parseOptionalBoolean(value: unknown, fieldName: string): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new ValidationError(`${fieldName} must be a boolean query parameter`);
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  throw new ValidationError(`${fieldName} must be true or false`);
}

export function mapListOpen5eItemCatalogQueryInput(params: BaseCatalogQueryParams & {
  resourceType: "EQUIPMENT" | "MAGIC_ITEM";
}): ListOpen5eItemCatalogInput {
  const search = parseOptionalString(params.query.search);
  const documentKey = parseOptionalString(params.query.documentKey);
  const ordering = parseOptionalString(params.query.ordering);
  const limit = parseOptionalPositiveInteger(params.query.limit, "limit");
  const page = parseOptionalPositiveInteger(params.query.page, "page");

  return {
    actorUserId: params.actorUserId,
    resourceType: params.resourceType,
    ...(search === undefined ? {} : { search }),
    ...(documentKey === undefined ? {} : { documentKey }),
    ...(ordering === undefined ? {} : { ordering }),
    ...(limit === undefined ? {} : { limit }),
    ...(page === undefined ? {} : { page }),
  };
}

export function mapListPublishedItemsQueryInput(
  params: BaseCatalogQueryParams,
): ListPublishedItemTemplatesInput {
  const search = parseOptionalString(params.query.search);
  const type = parseOptionalString(params.query.type);
  const rarity = parseOptionalString(params.query.rarity);
  const isMagical = parseOptionalBoolean(params.query.isMagical, "isMagical");
  const limit = parseOptionalPositiveInteger(params.query.limit, "limit");
  const page = parseOptionalPositiveInteger(params.query.page, "page");

  return {
    actorUserId: params.actorUserId,
    ...(search === undefined ? {} : { search }),
    ...(type === undefined ? {} : { type }),
    ...(rarity === undefined ? {} : { rarity }),
    ...(isMagical === undefined ? {} : { isMagical }),
    ...(limit === undefined ? {} : { limit }),
    ...(page === undefined ? {} : { page }),
  };
}
