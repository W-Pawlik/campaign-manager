import type { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";
import { MemberStatus } from "@modules/campaigns/domain/value-objects/MemberStatus";

export interface CampaignMemberProps {
  id: string;
  campaignId: string;
  userId: string;
  role: CampaignRole;
  status: MemberStatus;
  nickname: string | null;
  joinedAt: Date | null;
  invitedAt: Date | null;
  invitedById: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class CampaignMember {
  public readonly id: string;
  public readonly campaignId: string;
  public readonly userId: string;
  public readonly role: CampaignRole;
  public readonly status: MemberStatus;
  public readonly nickname: string | null;
  public readonly joinedAt: Date | null;
  public readonly invitedAt: Date | null;
  public readonly invitedById: string | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  private constructor(props: CampaignMemberProps) {
    this.id = props.id;
    this.campaignId = props.campaignId;
    this.userId = props.userId;
    this.role = props.role;
    this.status = props.status;
    this.nickname = props.nickname;
    this.joinedAt = props.joinedAt;
    this.invitedAt = props.invitedAt;
    this.invitedById = props.invitedById;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public static create(props: CampaignMemberProps): CampaignMember {
    return new CampaignMember(props);
  }

  public withRole(role: CampaignRole, updatedAt: Date): CampaignMember {
    return new CampaignMember({
      ...this.toProps(),
      role,
      updatedAt,
    });
  }

  public markRemoved(removedAt: Date): CampaignMember {
    return new CampaignMember({
      ...this.toProps(),
      status: MemberStatus.create("REMOVED"),
      updatedAt: removedAt,
    });
  }

  public markLeft(leftAt: Date): CampaignMember {
    return new CampaignMember({
      ...this.toProps(),
      status: MemberStatus.create("LEFT"),
      updatedAt: leftAt,
    });
  }

  private toProps(): CampaignMemberProps {
    return {
      id: this.id,
      campaignId: this.campaignId,
      userId: this.userId,
      role: this.role,
      status: this.status,
      nickname: this.nickname,
      joinedAt: this.joinedAt,
      invitedAt: this.invitedAt,
      invitedById: this.invitedById,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
