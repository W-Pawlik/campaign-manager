import { omitUndefinedProperties } from "@api/mappers/request-mapper.utils";
import type {
  CreateNoteRequestBody,
  UpdateNoteRequestBody,
} from "@api/schemas/campaigns.schemas";
import type { CreateNoteInput } from "@modules/notes/application/commands/CreateNoteCommand";
import type { UpdateNoteInput } from "@modules/notes/application/commands/UpdateNoteCommand";

interface MapCreateNoteCommandInputParams {
  campaignId: string;
  actorUserId: string;
  body: CreateNoteRequestBody;
}

interface MapUpdateNoteCommandInputParams {
  campaignId: string;
  noteId: string;
  actorUserId: string;
  body: UpdateNoteRequestBody;
}

export function mapCreateNoteCommandInput(params: MapCreateNoteCommandInputParams): CreateNoteInput {
  const body = omitUndefinedProperties(params.body) as Omit<CreateNoteInput, "campaignId" | "actorUserId">;

  return {
    campaignId: params.campaignId,
    actorUserId: params.actorUserId,
    ...body,
  };
}

export function mapUpdateNoteCommandInput(params: MapUpdateNoteCommandInputParams): UpdateNoteInput {
  const body = omitUndefinedProperties(params.body) as Omit<
    UpdateNoteInput,
    "campaignId" | "noteId" | "actorUserId"
  >;

  return {
    campaignId: params.campaignId,
    noteId: params.noteId,
    actorUserId: params.actorUserId,
    ...body,
  };
}
