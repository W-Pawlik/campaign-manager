import { randomUUID } from "node:crypto";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import type { CreateItemTemplateCommand } from "@modules/items/application/commands/CreateItemTemplateCommand";
import type { ItemTemplateDTO } from "@modules/items/application/dto/ItemTemplateDTO";
import type { ItemTemplateRepository } from "@modules/items/application/ports/ItemTemplateRepository";
import { mapItemTemplateDtoFromDomain } from "@modules/items/application/services/ItemDtoMapper";
import { ItemTemplate } from "@modules/items/domain/entities/ItemTemplate";
import { ItemRarity } from "@modules/items/domain/value-objects/ItemRarity";
import { ItemSource } from "@modules/items/domain/value-objects/ItemSource";
import { ItemType } from "@modules/items/domain/value-objects/ItemType";

export class CreateItemTemplateHandler implements CommandHandler<CreateItemTemplateCommand, ItemTemplateDTO> {
  public constructor(private readonly itemTemplateRepository: ItemTemplateRepository) {}

  public async execute(command: CreateItemTemplateCommand): Promise<ItemTemplateDTO> {
    const createdAt = new Date();
    const template = ItemTemplate.create({
      id: randomUUID(),
      source: ItemSource.custom(),
      externalReferenceId: null,
      name: command.input.name.trim(),
      type: command.input.type === undefined ? ItemType.other() : ItemType.create(command.input.type),
      rarity: command.input.rarity === undefined || command.input.rarity === null ? null : ItemRarity.create(command.input.rarity),
      isMagical: command.input.isMagical ?? false,
      description: command.input.description ?? null,
      properties: command.input.properties ?? null,
      weight: command.input.weight ?? null,
      valueAmount: command.input.valueAmount ?? null,
      valueCurrency: command.input.valueCurrency ?? null,
      createdById: command.input.actorUserId,
      createdAt,
      updatedAt: createdAt,
    });

    await this.itemTemplateRepository.create(template);

    return mapItemTemplateDtoFromDomain(template);
  }
}
