import type { ParsedQs } from "qs";
import { ValidationError } from "@core/application/errors/AppError";
import type { ListCampaignMonstersInput } from "@modules/monsters/application/queries/ListCampaignMonstersQuery";

interface MapListCampaignMonstersQueryInputParams {
  campaignId: string;
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

function parseOptionalBoolean(value: unknown, fieldName: string): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new ValidationError(`${fieldName} must be a boolean query parameter`);
  }

  const normalizedValue = value.trim().toLowerCase();

  if (normalizedValue === "true") {
    return true;
  }

  if (normalizedValue === "false") {
    return false;
  }

  throw new ValidationError(`${fieldName} must be 'true' or 'false'`);
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

export function mapListCampaignMonstersQueryInput(
  params: MapListCampaignMonstersQueryInputParams,
): ListCampaignMonstersInput {
  const includeGlobal = parseOptionalBoolean(params.query.includeGlobal, "includeGlobal");
  const search = parseOptionalString(params.query.search);
  const type = parseOptionalString(params.query.type);
  const minCr = parseOptionalNumber(params.query.minCr, "minCr");
  const maxCr = parseOptionalNumber(params.query.maxCr, "maxCr");
  const status = parseOptionalString(params.query.status);

  return {
    campaignId: params.campaignId,
    actorUserId: params.actorUserId,
    ...(includeGlobal === undefined ? {} : { includeGlobal }),
    ...(search === undefined ? {} : { search }),
    ...(type === undefined ? {} : { type }),
    ...(minCr === undefined ? {} : { minCr }),
    ...(maxCr === undefined ? {} : { maxCr }),
    ...(status === undefined ? {} : { status }),
  };
}
