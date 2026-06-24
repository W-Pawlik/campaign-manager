import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { ForbiddenError, NotFoundError, ValidationError } from "@core/application/errors/AppError";
import type { UpdateItemTemplateCommand } from "@modules/items/application/commands/UpdateItemTemplateCommand";
import type { ItemTemplateDTO } from "@modules/items/application/dto/ItemTemplateDTO";
import type { ItemTemplateRepository } from "@modules/items/application/ports/ItemTemplateRepository";
import { mapItemTemplateDtoFromDomain } from "@modules/items/application/services/ItemDtoMapper";
import { ItemRarity } from "@modules/items/domain/value-objects/ItemRarity";
import { ItemType } from "@modules/items/domain/value-objects/ItemType";

export class UpdateItemTemplateHandler implements CommandHandler<UpdateItemTemplateCommand, ItemTemplateDTO> {
  public constructor(private readonly itemTemplateRepository: ItemTemplateRepository) {}

  public async execute(command: UpdateItemTemplateCommand): Promise<ItemTemplateDTO> {
    if (
      command.input.name === undefined &&
      command.input.type === undefined &&
      command.input.rarity === undefined &&
      command.input.isMagical === undefined &&
      command.input.description === undefined &&
      command.input.properties === undefined &&
      command.input.weight === undefined &&
      command.input.valueAmount === undefined &&
      command.input.valueCurrency === undefined
    ) {
      throw new ValidationError("At least one field must be provided for update");
    }

    const template = await this.itemTemplateRepository.findById(command.input.itemTemplateId);

    if (template === null) {
      throw new NotFoundError("Published item not found");
    }

    if (template.createdById !== command.input.actorUserId) {
      throw new ForbiddenError("Only the item creator can update this published item");
    }

    const updatedTemplate = template.withUpdates({
      ...(command.input.name === undefined ? {} : { name: command.input.name.trim() }),
      ...(command.input.type === undefined ? {} : { type: ItemType.create(command.input.type) }),
      ...(command.input.rarity === undefined
        ? {}
        : { rarity: command.input.rarity === null ? null : ItemRarity.create(command.input.rarity) }),
      ...(command.input.isMagical === undefined ? {} : { isMagical: command.input.isMagical }),
      ...(command.input.description === undefined ? {} : { description: command.input.description }),
      ...(command.input.properties === undefined ? {} : { properties: command.input.properties }),
      ...(command.input.weight === undefined ? {} : { weight: command.input.weight }),
      ...(command.input.valueAmount === undefined ? {} : { valueAmount: command.input.valueAmount }),
      ...(command.input.valueCurrency === undefined ? {} : { valueCurrency: command.input.valueCurrency }),
    });

    await this.itemTemplateRepository.save(updatedTemplate);

    return mapItemTemplateDtoFromDomain(updatedTemplate);
  }
}
