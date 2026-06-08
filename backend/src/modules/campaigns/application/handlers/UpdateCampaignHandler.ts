import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { ValidationError } from "@core/application/errors/AppError";
import type { UpdateCampaignCommand } from "@modules/campaigns/application/commands/UpdateCampaignCommand";
import type { CampaignDetailsDTO } from "@modules/campaigns/application/dto/CampaignDetailsDTO";
import type { CampaignRepository } from "@modules/campaigns/application/ports/CampaignRepository";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { mapCampaignDetailsFromDomain } from "@modules/campaigns/application/services/CampaignDtoMapper";
import { buildCampaignSlugBaseFromName } from "@modules/campaigns/application/services/CampaignSlugService";
import { findUniqueCampaignSlug } from "@modules/campaigns/application/services/UniqueCampaignSlugFinder";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import { CampaignName } from "@modules/campaigns/domain/value-objects/CampaignName";
import { CampaignVisibility } from "@modules/campaigns/domain/value-objects/CampaignVisibility";

export class UpdateCampaignHandler
  implements CommandHandler<UpdateCampaignCommand, CampaignDetailsDTO>
{
  public constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly accessService: CampaignAccessApplicationService,
  ) {}

  public async execute(command: UpdateCampaignCommand): Promise<CampaignDetailsDTO> {
    if (
      command.input.name === undefined &&
      command.input.description === undefined &&
      command.input.gameSystemId === undefined &&
      command.input.visibility === undefined &&
      command.input.defaultLanguage === undefined &&
      command.input.currentDateInWorld === undefined &&
      command.input.worldName === undefined &&
      command.input.startingLevel === undefined
    ) {
      throw new ValidationError("At least one field must be provided for update");
    }

    const { campaign, role } = await this.accessService.requirePermission(
      command.input.campaignId,
      command.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.CAMPAIGN_UPDATE,
    );

    const name = command.input.name === undefined ? undefined : CampaignName.create(command.input.name);
    let slug: string | undefined;

    if (name !== undefined && name.value !== campaign.name.value) {
      const baseSlug = buildCampaignSlugBaseFromName(name.value);
      slug = await findUniqueCampaignSlug(this.campaignRepository, baseSlug, campaign.id);
    }

    const visibility =
      command.input.visibility === undefined
        ? undefined
        : CampaignVisibility.create(command.input.visibility);
    const updatedCampaign = campaign.withUpdates({
      ...(name === undefined ? {} : { name }),
      ...(slug === undefined ? {} : { slug }),
      ...(command.input.description === undefined
        ? {}
        : { description: command.input.description }),
      ...(command.input.gameSystemId === undefined
        ? {}
        : { gameSystemId: command.input.gameSystemId }),
      ...(visibility === undefined ? {} : { visibility }),
      ...(command.input.defaultLanguage === undefined
        ? {}
        : { defaultLanguage: command.input.defaultLanguage }),
      ...(command.input.currentDateInWorld === undefined
        ? {}
        : { currentDateInWorld: command.input.currentDateInWorld }),
      ...(command.input.worldName === undefined ? {} : { worldName: command.input.worldName }),
      ...(command.input.startingLevel === undefined
        ? {}
        : { startingLevel: command.input.startingLevel }),
    });

    await this.campaignRepository.save(updatedCampaign);

    return mapCampaignDetailsFromDomain(updatedCampaign, role);
  }
}
