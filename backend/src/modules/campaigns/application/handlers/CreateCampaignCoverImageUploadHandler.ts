import { randomUUID } from "node:crypto";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { ForbiddenError, NotFoundError, ValidationError } from "@core/application/errors/AppError";
import type { FileStorage } from "@core/application/storage/FileStorage";
import type { CreateCampaignCoverImageUploadCommand } from "@modules/campaigns/application/commands/CreateCampaignCoverImageUploadCommand";
import type { CampaignCoverImageUploadDTO } from "@modules/campaigns/application/dto/CampaignCoverImageUploadDTO";
import type { CampaignRepository } from "@modules/campaigns/application/ports/CampaignRepository";

const COVER_IMAGE_UPLOAD_EXPIRES_IN_SECONDS = 900;
const ALLOWED_COVER_IMAGE_CONTENT_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export class CreateCampaignCoverImageUploadHandler
  implements CommandHandler<CreateCampaignCoverImageUploadCommand, CampaignCoverImageUploadDTO>
{
  public constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly fileStorage: FileStorage,
  ) {}

  public async execute(
    command: CreateCampaignCoverImageUploadCommand,
  ): Promise<CampaignCoverImageUploadDTO> {
    const campaign = await this.campaignRepository.findById(command.input.campaignId);

    if (campaign === null || campaign.deletedAt !== null) {
      throw new NotFoundError("Campaign not found");
    }

    const role = await this.campaignRepository.findUserRole(
      command.input.campaignId,
      command.input.actorUserId,
    );

    if (role === null || !role.isOwner()) {
      throw new ForbiddenError("Only campaign owner can update campaign cover image");
    }

    if (!ALLOWED_COVER_IMAGE_CONTENT_TYPES.has(command.input.contentType)) {
      throw new ValidationError("Unsupported campaign cover image content type");
    }

    const coverImageKey = this.buildCoverImageKey(
      command.input.campaignId,
      command.input.fileName,
    );
    const upload = await this.fileStorage.createPresignedUploadUrl({
      key: coverImageKey,
      contentType: command.input.contentType,
      expiresInSeconds: COVER_IMAGE_UPLOAD_EXPIRES_IN_SECONDS,
    });
    const updatedCampaign = campaign.withCoverImage({
      coverImageKey,
      coverImageUrl: upload.publicUrl,
    });

    await this.campaignRepository.save(updatedCampaign);

    return {
      uploadUrl: upload.uploadUrl,
      coverImageUrl: upload.publicUrl,
      coverImageKey,
      expiresInSeconds: COVER_IMAGE_UPLOAD_EXPIRES_IN_SECONDS,
    };
  }

  private buildCoverImageKey(campaignId: string, fileName: string): string {
    const safeFileName = fileName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return `campaigns/${campaignId}/cover-images/${randomUUID()}-${
      safeFileName.length > 0 ? safeFileName : "cover-image"
    }`;
  }
}
