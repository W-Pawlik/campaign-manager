import type {
  CreateChronicleEntryInput,
} from "@modules/chronicle/application/commands/CreateChronicleEntryCommand";
import type {
  UpdateChronicleEntryInput,
} from "@modules/chronicle/application/commands/UpdateChronicleEntryCommand";
import type {
  CreateChronicleEntryRequestBody,
  UpdateChronicleEntryRequestBody,
} from "@api/schemas/campaigns.schemas";
import { omitUndefinedProperties } from "@api/mappers/request-mapper.utils";

interface MapCreateChronicleEntryCommandInputParams {
  campaignId: string;
  actorUserId: string;
  body: CreateChronicleEntryRequestBody;
}

interface MapUpdateChronicleEntryCommandInputParams {
  campaignId: string;
  entryId: string;
  actorUserId: string;
  body: UpdateChronicleEntryRequestBody;
}

function mapDate(value: string | null | undefined): Date | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  return value === null ? null : new Date(value);
}

export function mapCreateChronicleEntryCommandInput(
  params: MapCreateChronicleEntryCommandInputParams,
): CreateChronicleEntryInput {
  const body = omitUndefinedProperties(params.body);

  return {
    campaignId: params.campaignId,
    actorUserId: params.actorUserId,
    ...body,
    occurredAt: mapDate(body.occurredAt as string | null | undefined),
  } as CreateChronicleEntryInput;
}

export function mapUpdateChronicleEntryCommandInput(
  params: MapUpdateChronicleEntryCommandInputParams,
): UpdateChronicleEntryInput {
  const body = omitUndefinedProperties(params.body);

  return {
    campaignId: params.campaignId,
    entryId: params.entryId,
    actorUserId: params.actorUserId,
    ...body,
    occurredAt: mapDate(body.occurredAt as string | null | undefined),
  } as UpdateChronicleEntryInput;
}
