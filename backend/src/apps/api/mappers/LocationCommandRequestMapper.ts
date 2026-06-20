import { omitUndefinedProperties } from "@api/mappers/request-mapper.utils";
import type {
  CreateLocationRequestBody,
  UpdateLocationRequestBody,
} from "@api/schemas/campaigns.schemas";
import type { CreateLocationInput } from "@modules/locations/application/commands/CreateLocationCommand";
import type { UpdateLocationInput } from "@modules/locations/application/commands/UpdateLocationCommand";

interface MapCreateLocationCommandInputParams {
  campaignId: string;
  actorUserId: string;
  body: CreateLocationRequestBody;
}

interface MapUpdateLocationCommandInputParams {
  campaignId: string;
  locationId: string;
  actorUserId: string;
  body: UpdateLocationRequestBody;
}

export function mapCreateLocationCommandInput(
  params: MapCreateLocationCommandInputParams,
): CreateLocationInput {
  const body = omitUndefinedProperties(params.body) as Omit<
    CreateLocationInput,
    "campaignId" | "actorUserId"
  >;

  return {
    campaignId: params.campaignId,
    actorUserId: params.actorUserId,
    ...body,
  };
}

export function mapUpdateLocationCommandInput(
  params: MapUpdateLocationCommandInputParams,
): UpdateLocationInput {
  const body = omitUndefinedProperties(params.body) as Omit<
    UpdateLocationInput,
    "campaignId" | "locationId" | "actorUserId"
  >;

  return {
    campaignId: params.campaignId,
    locationId: params.locationId,
    actorUserId: params.actorUserId,
    ...body,
  };
}
