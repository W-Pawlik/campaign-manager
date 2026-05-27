import { ForbiddenError } from "@core/application/errors/AppError";
import type { CampaignName } from "@modules/campaigns/domain/value-objects/CampaignName";
import { CAMPAIGN_STATUS, CampaignStatus } from "@modules/campaigns/domain/value-objects/CampaignStatus";
import type { CampaignVisibility } from "@modules/campaigns/domain/value-objects/CampaignVisibility";

export interface CampaignProps {
  id: string;
  ownerId: string;
  name: CampaignName;
  slug: string;
  description: string | null;
  gameSystemId: string | null;
  status: CampaignStatus;
  visibility: CampaignVisibility;
  coverImageUrl: string | null;
  coverImageKey: string | null;
  defaultLanguage: string | null;
  currentDateInWorld: string | null;
  worldName: string | null;
  startingLevel: number | null;
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date | null;
  deletedAt: Date | null;
}

export interface UpdateCampaignParams {
  name?: CampaignName;
  slug?: string;
  description?: string | null;
  gameSystemId?: string | null;
  visibility?: CampaignVisibility;
  defaultLanguage?: string | null;
  currentDateInWorld?: string | null;
  worldName?: string | null;
  startingLevel?: number | null;
}

export interface UpdateCampaignCoverImageParams {
  coverImageUrl: string;
  coverImageKey: string;
}

export class Campaign {
  public readonly id: string;
  public readonly ownerId: string;
  public readonly name: CampaignName;
  public readonly slug: string;
  public readonly description: string | null;
  public readonly gameSystemId: string | null;
  public readonly status: CampaignStatus;
  public readonly visibility: CampaignVisibility;
  public readonly coverImageUrl: string | null;
  public readonly coverImageKey: string | null;
  public readonly defaultLanguage: string | null;
  public readonly currentDateInWorld: string | null;
  public readonly worldName: string | null;
  public readonly startingLevel: number | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly archivedAt: Date | null;
  public readonly deletedAt: Date | null;

  private constructor(props: CampaignProps) {
    this.id = props.id;
    this.ownerId = props.ownerId;
    this.name = props.name;
    this.slug = props.slug;
    this.description = props.description;
    this.gameSystemId = props.gameSystemId;
    this.status = props.status;
    this.visibility = props.visibility;
    this.coverImageUrl = props.coverImageUrl;
    this.coverImageKey = props.coverImageKey;
    this.defaultLanguage = props.defaultLanguage;
    this.currentDateInWorld = props.currentDateInWorld;
    this.worldName = props.worldName;
    this.startingLevel = props.startingLevel;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.archivedAt = props.archivedAt;
    this.deletedAt = props.deletedAt;
  }

  public static create(props: CampaignProps): Campaign {
    return new Campaign(props);
  }

  public ensureIsEditable(): void {
    this.ensureIsNotDeleted();

    if (this.status.value === CAMPAIGN_STATUS.ARCHIVED) {
      throw new ForbiddenError("Archived campaign cannot be edited");
    }
  }

  public withUpdates(params: UpdateCampaignParams): Campaign {
    this.ensureIsEditable();

    return new Campaign({
      ...this.toProps(),
      name: params.name ?? this.name,
      slug: params.slug ?? this.slug,
      description: params.description === undefined ? this.description : params.description,
      gameSystemId: params.gameSystemId === undefined ? this.gameSystemId : params.gameSystemId,
      visibility: params.visibility ?? this.visibility,
      defaultLanguage:
        params.defaultLanguage === undefined ? this.defaultLanguage : params.defaultLanguage,
      currentDateInWorld:
        params.currentDateInWorld === undefined
          ? this.currentDateInWorld
          : params.currentDateInWorld,
      worldName: params.worldName === undefined ? this.worldName : params.worldName,
      startingLevel: params.startingLevel === undefined ? this.startingLevel : params.startingLevel,
      updatedAt: new Date(),
    });
  }

  public withCoverImage(params: UpdateCampaignCoverImageParams): Campaign {
    this.ensureIsEditable();

    return new Campaign({
      ...this.toProps(),
      coverImageUrl: params.coverImageUrl,
      coverImageKey: params.coverImageKey,
      updatedAt: new Date(),
    });
  }

  public archive(archivedAt: Date): Campaign {
    this.ensureIsNotDeleted();

    if (this.status.value === CAMPAIGN_STATUS.ARCHIVED) {
      return this;
    }

    return new Campaign({
      ...this.toProps(),
      status: CampaignStatus.archived(),
      archivedAt,
      updatedAt: archivedAt,
    });
  }

  public restore(restoredAt: Date): Campaign {
    return new Campaign({
      ...this.toProps(),
      status: CampaignStatus.active(),
      archivedAt: null,
      deletedAt: null,
      updatedAt: restoredAt,
    });
  }

  public softDelete(deletedAt: Date): Campaign {
    if (this.deletedAt !== null) {
      return this;
    }

    return new Campaign({
      ...this.toProps(),
      status: CampaignStatus.archived(),
      archivedAt: deletedAt,
      deletedAt,
      updatedAt: deletedAt,
    });
  }

  public ensureIsNotDeleted(): void {
    if (this.deletedAt !== null) {
      throw new ForbiddenError("Deleted campaign cannot be modified");
    }
  }

  private toProps(): CampaignProps {
    return {
      id: this.id,
      ownerId: this.ownerId,
      name: this.name,
      slug: this.slug,
      description: this.description,
      gameSystemId: this.gameSystemId,
      status: this.status,
      visibility: this.visibility,
      coverImageUrl: this.coverImageUrl,
      coverImageKey: this.coverImageKey,
      defaultLanguage: this.defaultLanguage,
      currentDateInWorld: this.currentDateInWorld,
      worldName: this.worldName,
      startingLevel: this.startingLevel,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      archivedAt: this.archivedAt,
      deletedAt: this.deletedAt,
    };
  }
}
