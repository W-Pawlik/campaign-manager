import type { ParsedQs } from "qs";
import { ValidationError } from "@core/application/errors/AppError";
import type { ListOpen5eCreatureCatalogInput } from "@modules/external-references/application/queries/ListOpen5eCreatureCatalogQuery";
import type { ListPublishedMonstersInput } from "@modules/monsters/application/queries/ListPublishedMonstersQuery";

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

function parseOptionalNumber(value: unknown, fieldName: string): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new ValidationError(`${fieldName} must be a numeric query parameter`);
  }

  const parsedValue = Number(value);

  if (Number.isNaN(parsedValue)) {
    throw new ValidationError(`${fieldName} must be a valid number`);
  }

  return parsedValue;
}

export function mapListOpen5eCreatureCatalogQueryInput(
  params: BaseCatalogQueryParams,
): ListOpen5eCreatureCatalogInput {
  const search = parseOptionalString(params.query.search);
  const type = parseOptionalString(params.query.type);
  const documentKey = parseOptionalString(params.query.documentKey);
  const minCr = parseOptionalNumber(params.query.minCr, "minCr");
  const maxCr = parseOptionalNumber(params.query.maxCr, "maxCr");
  const ordering = parseOptionalString(params.query.ordering);
  const limit = parseOptionalPositiveInteger(params.query.limit, "limit");
  const page = parseOptionalPositiveInteger(params.query.page, "page");

  return {
    actorUserId: params.actorUserId,
    ...(search === undefined ? {} : { search }),
    ...(type === undefined ? {} : { type }),
    ...(documentKey === undefined ? {} : { documentKey }),
    ...(minCr === undefined ? {} : { minCr }),
    ...(maxCr === undefined ? {} : { maxCr }),
    ...(ordering === undefined ? {} : { ordering }),
    ...(limit === undefined ? {} : { limit }),
    ...(page === undefined ? {} : { page }),
  };
}

export function mapListPublishedMonstersQueryInput(
  params: BaseCatalogQueryParams,
): ListPublishedMonstersInput {
  const search = parseOptionalString(params.query.search);
  const type = parseOptionalString(params.query.type);
  const minCr = parseOptionalNumber(params.query.minCr, "minCr");
  const maxCr = parseOptionalNumber(params.query.maxCr, "maxCr");
  const limit = parseOptionalPositiveInteger(params.query.limit, "limit");
  const page = parseOptionalPositiveInteger(params.query.page, "page");

  return {
    actorUserId: params.actorUserId,
    ...(search === undefined ? {} : { search }),
    ...(type === undefined ? {} : { type }),
    ...(minCr === undefined ? {} : { minCr }),
    ...(maxCr === undefined ? {} : { maxCr }),
    ...(limit === undefined ? {} : { limit }),
    ...(page === undefined ? {} : { page }),
  };
}
