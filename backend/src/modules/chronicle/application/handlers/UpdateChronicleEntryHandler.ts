import { ForbiddenError, NotFoundError } from "@core/application/errors/AppError";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import type { ChronicleEntryDTO } from "@modules/chronicle/application/dto/ChronicleEntryDTO";
import type { UpdateChronicleEntryCommand } from "@modules/chronicle/application/commands/UpdateChronicleEntryCommand";
import type { ChronicleEntryRepository } from "@modules/chronicle/application/ports/ChronicleEntryRepository";
import { mapChronicleEntryDtoFromDomain } from "@modules/chronicle/application/services/ChronicleDtoMapper";
import type { ChroniclePermissionDomainService } from "@modules/chronicle/domain/services/ChroniclePermissionDomainService";
import { ChronicleVisibility } from "@modules/chronicle/domain/value-objects/ChronicleVisibility";

export class UpdateChronicleEntryHandler
  implements CommandHandler<UpdateChronicleEntryCommand, ChronicleEntryDTO>
{
  public constructor(
    private readonly chronicleRepository: ChronicleEntryRepository,
    private readonly accessService: CampaignAccessApplicationService,
    private readonly permissionService: ChroniclePermissionDomainService,
  ) {}

  public async execute(command: UpdateChronicleEntryCommand): Promise<ChronicleEntryDTO> {
    const access = await this.accessService.requirePermission(
      command.input.campaignId,
      command.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.CHRONICLE_UPDATE,
    );
    const entry = await this.chronicleRepository.findById(command.input.campaignId, command.input.entryId);

    if (entry === null) {
      throw new NotFoundError("Chronicle entry not found");
    }

    if (!this.permissionService.canManageEntry(access.role, command.input.actorUserId, entry)) {
      throw new ForbiddenError("Insufficient chronicle entry permissions");
    }

    const nextVisibility =
      command.input.visibility === undefined
        ? undefined
        : ChronicleVisibility.create(command.input.visibility);

    if (
      nextVisibility !== undefined &&
      !this.permissionService.canSetVisibility(access.role, command.input.actorUserId, nextVisibility)
    ) {
      throw new ForbiddenError("Insufficient chronicle visibility permissions");
    }

    const updatedEntry = entry.withUpdates({
      ...(command.input.sessionId === undefined ? {} : { sessionId: command.input.sessionId }),
      ...(command.input.title === undefined ? {} : { title: command.input.title.trim() }),
      ...(command.input.content === undefined ? {} : { content: command.input.content.trim() }),
      ...(command.input.inWorldDate === undefined ? {} : { inWorldDate: command.input.inWorldDate }),
      ...(command.input.occurredAt === undefined ? {} : { occurredAt: command.input.occurredAt }),
      ...(nextVisibility === undefined ? {} : { visibility: nextVisibility }),
    });

    await this.chronicleRepository.save(updatedEntry);

    return mapChronicleEntryDtoFromDomain(updatedEntry);
  }
}
