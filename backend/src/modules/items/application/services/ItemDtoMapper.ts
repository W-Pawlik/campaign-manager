import type { InventoryItemDTO } from "@modules/items/application/dto/InventoryItemDTO";
import type { ItemTemplateDTO } from "@modules/items/application/dto/ItemTemplateDTO";
import type { InventoryItem } from "@modules/items/domain/entities/InventoryItem";
import type { ItemTemplate } from "@modules/items/domain/entities/ItemTemplate";

export function mapItemTemplateDtoFromDomain(template: ItemTemplate): ItemTemplateDTO {
  return {
    id: template.id,
    source: template.source.value,
    externalReferenceId: template.externalReferenceId,
    name: template.name,
    type: template.type.value,
    rarity: template.rarity?.value ?? null,
    isMagical: template.isMagical,
    description: template.description,
    properties: template.properties,
    weight: template.weight,
    valueAmount: template.valueAmount,
    valueCurrency: template.valueCurrency,
    createdById: template.createdById,
    createdAt: template.createdAt.toISOString(),
    updatedAt: template.updatedAt.toISOString(),
  };
}

export function mapInventoryItemDtoFromDomain(item: InventoryItem): InventoryItemDTO {
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
    customProperties: item.customProperties,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    deletedAt: item.deletedAt?.toISOString() ?? null,
  };
}
