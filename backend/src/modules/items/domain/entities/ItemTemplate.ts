import { ValidationError } from "@core/application/errors/AppError";
import type { ItemRarity } from "@modules/items/domain/value-objects/ItemRarity";
import type { ItemSource } from "@modules/items/domain/value-objects/ItemSource";
import type { ItemType } from "@modules/items/domain/value-objects/ItemType";

export interface ItemTemplateProps {
  id: string;
  source: ItemSource;
  externalReferenceId: string | null;
  name: string;
  type: ItemType;
  rarity: ItemRarity | null;
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

export type UpdateItemTemplateParams = Omit<
  Partial<ItemTemplateProps>,
  "id" | "source" | "externalReferenceId" | "createdById" | "createdAt" | "updatedAt"
>;

export class ItemTemplate {
  public readonly id: string;
  public readonly source: ItemSource;
  public readonly externalReferenceId: string | null;
  public readonly name: string;
  public readonly type: ItemType;
  public readonly rarity: ItemRarity | null;
  public readonly isMagical: boolean;
  public readonly description: string | null;
  public readonly properties: unknown | null;
  public readonly weight: number | null;
  public readonly valueAmount: number | null;
  public readonly valueCurrency: string | null;
  public readonly createdById: string | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  private constructor(props: ItemTemplateProps) {
    this.id = props.id;
    this.source = props.source;
    this.externalReferenceId = props.externalReferenceId;
    this.name = props.name;
    this.type = props.type;
    this.rarity = props.rarity;
    this.isMagical = props.isMagical;
    this.description = props.description;
    this.properties = props.properties;
    this.weight = props.weight;
    this.valueAmount = props.valueAmount;
    this.valueCurrency = props.valueCurrency;
    this.createdById = props.createdById;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public static create(props: ItemTemplateProps): ItemTemplate {
    ItemTemplate.validate(props);

    return new ItemTemplate(props);
  }

  public withUpdates(params: UpdateItemTemplateParams): ItemTemplate {
    return ItemTemplate.create({
      ...this.toProps(),
      ...params,
      updatedAt: new Date(),
    });
  }

  private static validate(props: ItemTemplateProps): void {
    const trimmedName = props.name.trim();

    if (trimmedName.length < 1 || trimmedName.length > 200) {
      throw new ValidationError("Item template name must be between 1 and 200 characters");
    }

    if (props.weight !== null && props.weight < 0) {
      throw new ValidationError("Item template weight cannot be negative");
    }

    if (props.valueAmount !== null && props.valueAmount < 0) {
      throw new ValidationError("Item template value cannot be negative");
    }
  }

  private toProps(): ItemTemplateProps {
    return {
      id: this.id,
      source: this.source,
      externalReferenceId: this.externalReferenceId,
      name: this.name,
      type: this.type,
      rarity: this.rarity,
      isMagical: this.isMagical,
      description: this.description,
      properties: this.properties,
      weight: this.weight,
      valueAmount: this.valueAmount,
      valueCurrency: this.valueCurrency,
      createdById: this.createdById,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
