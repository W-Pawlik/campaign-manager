import type { ParsedQs } from "qs";
import { ValidationError } from "@core/application/errors/AppError";
import type { SearchExternalResourcesInput } from "@modules/external-references/application/queries/SearchExternalResourcesQuery";

function parseOptionalString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length === 0 ? undefined : trimmedValue;
}

function parseOptionalPositiveInteger(
  value: unknown,
  fieldName: string,
): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new ValidationError(`${fieldName} must be a numeric query parameter`);
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    throw new ValidationError(
      `${fieldName} must be a positive integer query parameter`,
    );
  }

  return parsedValue;
}

function parseResourceTypes(value: unknown): string[] | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) =>
      typeof item === "string"
        ? item
            .split(",")
            .map((part) => part.trim())
            .filter((part) => part.length > 0)
        : [],
    );
  }

  throw new ValidationError("resourceType must be a string or string[] query parameter");
}

export function mapSearchExternalResourcesQueryInput(
  query: ParsedQs,
): SearchExternalResourcesInput {
  const normalizedQuery = parseOptionalString(query.query);

  if (normalizedQuery === undefined) {
    throw new ValidationError("query is required");
  }

  const resourceTypes = parseResourceTypes(query.resourceType);
  const limit = parseOptionalPositiveInteger(query.limit, "limit");
  const page = parseOptionalPositiveInteger(query.page, "page");

  return {
    provider: "OPEN5E",
    query: normalizedQuery,
    ...(resourceTypes === undefined ? {} : { resourceTypes }),
    ...(limit === undefined ? {} : { limit }),
    ...(page === undefined ? {} : { page }),
  };
}
