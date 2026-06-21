import { ForbiddenError, ValidationError } from "@core/application/errors/AppError";
import type { InventoryOwnerType } from "@modules/items/domain/value-objects/InventoryOwnerType";
import type { ItemVisibility } from "@modules/items/domain/value-objects/ItemVisibility";

export interface InventoryItemProps {
  id: string;
  campaignId: string;
  itemTemplateId: string | null;
  name: string;
  description: string | null;
  quantity: number;
  charges: number | null;
  maxCharges: number | null;
  isEquipped: boolean;
  isAttuned: boolean;
  isIdentified: boolean;
  ownerType: InventoryOwnerType;
  ownerId: string;
  visibility: ItemVisibility;
  customProperties: unknown | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type UpdateInventoryItemParams = Omit<
  Partial<InventoryItemProps>,
  "id" | "campaignId" | "createdAt" | "updatedAt" | "deletedAt"
>;

export class InventoryItem {
  public readonly id: string;
  public readonly campaignId: string;
  public readonly itemTemplateId: string | null;
  public readonly name: string;
  public readonly description: string | null;
  public readonly quantity: number;
  public readonly charges: number | null;
  public readonly maxCharges: number | null;
  public readonly isEquipped: boolean;
  public readonly isAttuned: boolean;
  public readonly isIdentified: boolean;
  public readonly ownerType: InventoryOwnerType;
  public readonly ownerId: string;
  public readonly visibility: ItemVisibility;
  public readonly customProperties: unknown | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt: Date | null;

  private constructor(props: InventoryItemProps) {
    this.id = props.id;
    this.campaignId = props.campaignId;
    this.itemTemplateId = props.itemTemplateId;
    this.name = props.name;
    this.description = props.description;
    this.quantity = props.quantity;
    this.charges = props.charges;
    this.maxCharges = props.maxCharges;
    this.isEquipped = props.isEquipped;
    this.isAttuned = props.isAttuned;
    this.isIdentified = props.isIdentified;
    this.ownerType = props.ownerType;
    this.ownerId = props.ownerId;
    this.visibility = props.visibility;
    this.customProperties = props.customProperties;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
  }

  public static create(props: InventoryItemProps): InventoryItem {
    InventoryItem.validate(props);

    return new InventoryItem(props);
  }

  public withUpdates(params: UpdateInventoryItemParams): InventoryItem {
    this.ensureEditable();

    return InventoryItem.create({
      ...this.toProps(),
      ...params,
      updatedAt: new Date(),
    });
  }

  public equip(): InventoryItem {
    this.ensureEditable();

    if (this.isEquipped) {
      return this;
    }

    return this.withUpdates({ isEquipped: true });
  }

  public unequip(): InventoryItem {
    this.ensureEditable();

    if (!this.isEquipped) {
      return this;
    }

    return this.withUpdates({ isEquipped: false });
  }

  public transferOwnership(ownerType: InventoryOwnerType, ownerId: string): InventoryItem {
    this.ensureEditable();

    return this.withUpdates({
      ownerType,
      ownerId,
      isEquipped: false,
    });
  }

  public reduceQuantity(quantity: number): InventoryItem {
    this.ensureEditable();

    return this.withUpdates({ quantity: this.quantity - quantity });
  }

  public cloneForTransfer(params: {
    id: string;
    ownerType: InventoryOwnerType;
    ownerId: string;
    quantity: number;
    createdAt: Date;
  }): InventoryItem {
    this.ensureEditable();

    return InventoryItem.create({
      ...this.toProps(),
      id: params.id,
      ownerType: params.ownerType,
      ownerId: params.ownerId,
      quantity: params.quantity,
      isEquipped: false,
      createdAt: params.createdAt,
      updatedAt: params.createdAt,
      deletedAt: null,
    });
  }

  public softDelete(deletedAt: Date): InventoryItem {
    if (this.deletedAt !== null) {
      return this;
    }

    return InventoryItem.create({
      ...this.toProps(),
      updatedAt: deletedAt,
      deletedAt,
    });
  }

  public ensureEditable(): void {
    if (this.deletedAt !== null) {
      throw new ForbiddenError("Deleted inventory item cannot be modified");
    }
  }

  private toProps(): InventoryItemProps {
    return {
      id: this.id,
      campaignId: this.campaignId,
      itemTemplateId: this.itemTemplateId,
      name: this.name,
      description: this.description,
      quantity: this.quantity,
      charges: this.charges,
      maxCharges: this.maxCharges,
      isEquipped: this.isEquipped,
      isAttuned: this.isAttuned,
      isIdentified: this.isIdentified,
      ownerType: this.ownerType,
      ownerId: this.ownerId,
      visibility: this.visibility,
      customProperties: this.customProperties,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  private static validate(props: InventoryItemProps): void {
    const trimmedName = props.name.trim();

    if (trimmedName.length < 1 || trimmedName.length > 200) {
      throw new ValidationError("Inventory item name must be between 1 and 200 characters");
    }

    if (!Number.isInteger(props.quantity) || props.quantity < 0) {
      throw new ValidationError("Inventory item quantity must be a non-negative integer");
    }

    if (props.charges !== null && (!Number.isInteger(props.charges) || props.charges < 0)) {
      throw new ValidationError("Inventory item charges must be a non-negative integer");
    }

    if (props.maxCharges !== null && (!Number.isInteger(props.maxCharges) || props.maxCharges < 0)) {
      throw new ValidationError("Inventory item max charges must be a non-negative integer");
    }

    if (props.charges !== null && props.maxCharges !== null && props.charges > props.maxCharges) {
      throw new ValidationError("Inventory item charges cannot exceed max charges");
    }
  }
}
