import { ForbiddenError } from "@core/application/errors/AppError";
import type { CampaignName } from "@modules/campaigns/domain/value-objects/CampaignName";
import { CAMPAIGN_STATUS, CampaignStatus } from "@modules/campaigns/domain/value-objects/CampaignStatus";
import type { CampaignVisibility } from "@modules/campaigns/domain/value-objects/CampaignVisibility";

export interface CampaignProps {
  id: string;
  name: CampaignName;
  slug: string;
  status: CampaignStatus;
  visibility: CampaignVisibility;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface UpdateCampaignParams {
  name?: CampaignName;
  slug?: string;
  visibility?: CampaignVisibility;
}

export class Campaign {
  public readonly id: string;
  public readonly name: CampaignName;
  public readonly slug: string;
  public readonly status: CampaignStatus;
  public readonly visibility: CampaignVisibility;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt: Date | null;

  private constructor(props: CampaignProps) {
    this.id = props.id;
    this.name = props.name;
    this.slug = props.slug;
    this.status = props.status;
    this.visibility = props.visibility;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
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
      visibility: params.visibility ?? this.visibility,
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
      updatedAt: archivedAt,
    });
  }

  public restore(restoredAt: Date): Campaign {
    return new Campaign({
      ...this.toProps(),
      status: CampaignStatus.active(),
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
      name: this.name,
      slug: this.slug,
      status: this.status,
      visibility: this.visibility,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }
}