import type { ImportOpen5eCreatureAsMonsterInput } from "@modules/monsters/application/commands/ImportOpen5eCreatureAsMonsterCommand";
import type { ImportOpen5eMonsterRequestBody } from "@api/schemas/campaigns.schemas";

interface MapImportOpen5eMonsterCommandInputParams {
  campaignId: string;
  actorUserId: string;
  body: ImportOpen5eMonsterRequestBody;
}

export function mapImportOpen5eMonsterCommandInput(
  params: MapImportOpen5eMonsterCommandInputParams,
): ImportOpen5eCreatureAsMonsterInput {
  return {
    campaignId: params.campaignId,
    actorUserId: params.actorUserId,
    ...(params.body.resourceKey === undefined
      ? {}
      : { resourceKey: params.body.resourceKey }),
    ...(params.body.externalReferenceId === undefined
      ? {}
      : { externalReferenceId: params.body.externalReferenceId }),
    ...(params.body.nameOverride === undefined
      ? {}
      : { nameOverride: params.body.nameOverride }),
  };
}
