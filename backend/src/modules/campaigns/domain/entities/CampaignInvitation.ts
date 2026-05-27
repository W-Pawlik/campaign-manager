import type { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";
import { MemberStatus } from "@modules/campaigns/domain/value-objects/MemberStatus";

export interface CampaignInvitationProps {
  id: string;
  campaignId: string;
  userId: string;
  role: CampaignRole;
  status: MemberStatus;
  invitedById: string;
  respondedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class CampaignInvitation {
  public readonly id: string;
  public readonly campaignId: string;
  public readonly userId: string;
  public readonly role: CampaignRole;
  public readonly status: MemberStatus;
  public readonly invitedById: string;
  public readonly respondedAt: Date | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  private constructor(props: CampaignInvitationProps) {
    this.id = props.id;
    this.campaignId = props.campaignId;
    this.userId = props.userId;
    this.role = props.role;
    this.status = props.status;
    this.invitedById = props.invitedById;
    this.respondedAt = props.respondedAt;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public static create(props: CampaignInvitationProps): CampaignInvitation {
    return new CampaignInvitation(props);
  }

  public accept(respondedAt: Date): CampaignInvitation {
    return new CampaignInvitation({
      ...this.toProps(),
      status: MemberStatus.active(),
      respondedAt,
      updatedAt: respondedAt,
    });
  }

  public decline(respondedAt: Date): CampaignInvitation {
    return new CampaignInvitation({
      ...this.toProps(),
      status: MemberStatus.create("DECLINED"),
      respondedAt,
      updatedAt: respondedAt,
    });
  }

  private toProps(): CampaignInvitationProps {
    return {
      id: this.id,
      campaignId: this.campaignId,
      userId: this.userId,
      role: this.role,
      status: this.status,
      invitedById: this.invitedById,
      respondedAt: this.respondedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
