import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { ForbiddenError, NotFoundError, ValidationError } from "@core/application/errors/AppError";
import type { UpdateCampaignCommand } from "@modules/campaigns/application/commands/UpdateCampaignCommand";
import type { CampaignDetailsDTO } from "@modules/campaigns/application/dto/CampaignDetailsDTO";
import type { CampaignRepository } from "@modules/campaigns/application/ports/CampaignRepository";
import { mapCampaignDetailsFromDomain } from "@modules/campaigns/application/services/CampaignDtoMapper";
import { buildCampaignSlugBaseFromName } from "@modules/campaigns/application/services/CampaignSlugService";
import { findUniqueCampaignSlug } from "@modules/campaigns/application/services/UniqueCampaignSlugFinder";
import { CampaignName } from "@modules/campaigns/domain/value-objects/CampaignName";
import { CampaignVisibility } from "@modules/campaigns/domain/value-objects/CampaignVisibility";

export class UpdateCampaignHandler
  implements CommandHandler<UpdateCampaignCommand, CampaignDetailsDTO>
{
  public constructor(private readonly campaignRepository: CampaignRepository) {}

  public async execute(command: UpdateCampaignCommand): Promise<CampaignDetailsDTO> {
    if (command.input.name === undefined && command.input.visibility === undefined) {
      throw new ValidationError("At least one field must be provided for update");
    }

    const campaign = await this.campaignRepository.findById(command.input.campaignId);

    if (campaign === null || campaign.deletedAt !== null) {
      throw new NotFoundError("Campaign not found");
    }

    const role = await this.campaignRepository.findUserRole(command.input.campaignId, command.input.actorUserId);

    if (role === null || !role.isOwner()) {
      throw new ForbiddenError("Only campaign owner can modify campaign");
    }

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
      ...(visibility === undefined ? {} : { visibility }),
    });

    await this.campaignRepository.save(updatedCampaign);

    return mapCampaignDetailsFromDomain(updatedCampaign, role);
  }
}