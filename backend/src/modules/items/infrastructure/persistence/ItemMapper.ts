import { Prisma } from "@prisma/client";
import { InventoryItem } from "@modules/items/domain/entities/InventoryItem";
import { ItemTemplate } from "@modules/items/domain/entities/ItemTemplate";
import { InventoryOwnerType } from "@modules/items/domain/value-objects/InventoryOwnerType";
import { ItemRarity } from "@modules/items/domain/value-objects/ItemRarity";
import { ItemSource } from "@modules/items/domain/value-objects/ItemSource";
import { ItemType } from "@modules/items/domain/value-objects/ItemType";
import { ItemVisibility } from "@modules/items/domain/value-objects/ItemVisibility";

export interface ItemTemplatePersistenceRecord {
  id: string;
  source: string;
  externalReferenceId: string | null;
  name: string;
  type: string;
  rarity: string | null;
  isMagical: boolean;
  description: string | null;
  properties: unknown | null;
  weight: number | null;
  valueAmount: number | null;
  valueCurrency: string | null;
  createdById: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryItemPersistenceRecord {
  id: string;
  campaignId: string;
  itemTemplateId: string | null;
  source: string;
  externalReferenceId: string | null;
  name: string;
  type: string;
  rarity: string | null;
  isMagical: boolean;
  description: string | null;
  weight: number | null;
  valueAmount: number | null;
  valueCurrency: string | null;
  quantity: number;
  charges: number | null;
  maxCharges: number | null;
  isEquipped: boolean;
  isAttuned: boolean;
  isIdentified: boolean;
  ownerType: string;
  ownerId: string;
  visibility: string;
  customProperties: unknown | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class ItemMapper {
  public toTemplateDomain(record: ItemTemplatePersistenceRecord): ItemTemplate {
    return ItemTemplate.create({
      id: record.id,
      source: ItemSource.create(record.source),
      externalReferenceId: record.externalReferenceId,
      name: record.name,
      type: ItemType.create(record.type),
      rarity: record.rarity === null ? null : ItemRarity.create(record.rarity),
      isMagical: record.isMagical,
      description: record.description,
      properties: record.properties,
      weight: record.weight,
      valueAmount: record.valueAmount,
      valueCurrency: record.valueCurrency,
      createdById: record.createdById,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  public toInventoryDomain(record: InventoryItemPersistenceRecord): InventoryItem {
    return InventoryItem.create({
      id: record.id,
      campaignId: record.campaignId,
      itemTemplateId: record.itemTemplateId,
      source: record.source,
      externalReferenceId: record.externalReferenceId,
      name: record.name,
      type: record.type,
      rarity: record.rarity,
      isMagical: record.isMagical,
      description: record.description,
      weight: record.weight,
      valueAmount: record.valueAmount,
      valueCurrency: record.valueCurrency,
      quantity: record.quantity,
      charges: record.charges,
      maxCharges: record.maxCharges,
      isEquipped: record.isEquipped,
      isAttuned: record.isAttuned,
      isIdentified: record.isIdentified,
      ownerType: InventoryOwnerType.create(record.ownerType),
      ownerId: record.ownerId,
      visibility: ItemVisibility.create(record.visibility),
      customProperties: record.customProperties,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      deletedAt: record.deletedAt,
    });
  }

  public templateToPersistenceCreate(template: ItemTemplate): Record<string, unknown> {
    return {
      id: template.id,
      source: template.source.value,
      externalReferenceId: template.externalReferenceId,
      name: template.name,
      type: template.type.value,
      rarity: template.rarity?.value ?? null,
      isMagical: template.isMagical,
      description: template.description,
      properties: this.toJsonValue(template.properties),
      weight: template.weight,
      valueAmount: template.valueAmount,
      valueCurrency: template.valueCurrency,
      createdById: template.createdById,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
    };
  }

  public inventoryToPersistenceCreate(item: InventoryItem): Record<string, unknown> {
    return {
      id: item.id,
      campaignId: item.campaignId,
      itemTemplateId: item.itemTemplateId,
      source: item.source,
      externalReferenceId: item.externalReferenceId,
      name: item.name,
      type: item.type,
      rarity: item.rarity,
      isMagical: item.isMagical,
      description: item.description,
      weight: item.weight,
      valueAmount: item.valueAmount,
      valueCurrency: item.valueCurrency,
      quantity: item.quantity,
      charges: item.charges,
      maxCharges: item.maxCharges,
      isEquipped: item.isEquipped,
      isAttuned: item.isAttuned,
      isIdentified: item.isIdentified,
      ownerType: item.ownerType.value,
      ownerId: item.ownerId,
      visibility: item.visibility.value,
      customProperties: this.toJsonValue(item.customProperties),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      deletedAt: item.deletedAt,
    };
  }

  public inventoryToPersistenceUpdate(item: InventoryItem): Record<string, unknown> {
    return this.inventoryToPersistenceCreate(item);
  }

  private toJsonValue(value: unknown | null): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput {
    return value === null ? Prisma.JsonNull : (value as Prisma.InputJsonValue);
  }
}
