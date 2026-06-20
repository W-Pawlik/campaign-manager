import type {
  CreateSessionInput,
} from "@modules/sessions/application/commands/CreateSessionCommand";
import type {
  UpdateSessionInput,
} from "@modules/sessions/application/commands/UpdateSessionCommand";
import type {
  CreateSessionRequestBody,
  UpdateSessionRequestBody,
} from "@api/schemas/campaigns.schemas";
import { omitUndefinedProperties } from "@api/mappers/request-mapper.utils";

interface MapCreateSessionCommandInputParams {
  campaignId: string;
  actorUserId: string;
  body: CreateSessionRequestBody;
}

interface MapUpdateSessionCommandInputParams {
  campaignId: string;
  sessionId: string;
  actorUserId: string;
  body: UpdateSessionRequestBody;
}

function mapDate(value: string | null | undefined): Date | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  return value === null ? null : new Date(value);
}

export function mapCreateSessionCommandInput(
  params: MapCreateSessionCommandInputParams,
): CreateSessionInput {
  const body = omitUndefinedProperties(params.body);

  return {
    campaignId: params.campaignId,
    actorUserId: params.actorUserId,
    ...body,
    scheduledStartAt: mapDate(body.scheduledStartAt as string | null | undefined),
    scheduledEndAt: mapDate(body.scheduledEndAt as string | null | undefined),
    actualStartAt: mapDate(body.actualStartAt as string | null | undefined),
    actualEndAt: mapDate(body.actualEndAt as string | null | undefined),
  } as CreateSessionInput;
}

export function mapUpdateSessionCommandInput(
  params: MapUpdateSessionCommandInputParams,
): UpdateSessionInput {
  const body = omitUndefinedProperties(params.body);

  return {
    campaignId: params.campaignId,
    sessionId: params.sessionId,
    actorUserId: params.actorUserId,
    ...body,
    scheduledStartAt: mapDate(body.scheduledStartAt as string | null | undefined),
    scheduledEndAt: mapDate(body.scheduledEndAt as string | null | undefined),
    actualStartAt: mapDate(body.actualStartAt as string | null | undefined),
    actualEndAt: mapDate(body.actualEndAt as string | null | undefined),
  } as UpdateSessionInput;
}
