import type { PrismaClient } from "@prisma/client";
import type { ItemTemplateRepository } from "@modules/items/application/ports/ItemTemplateRepository";
import type { ItemTemplate } from "@modules/items/domain/entities/ItemTemplate";
import type { ItemMapper, ItemTemplatePersistenceRecord } from "@modules/items/infrastructure/persistence/ItemMapper";

interface ItemTemplateDelegate {
  findFirst(args: unknown): Promise<ItemTemplatePersistenceRecord | null>;
  create(args: unknown): Promise<unknown>;
}

export class PrismaItemTemplateRepository implements ItemTemplateRepository {
  public constructor(
    private readonly prismaClient: PrismaClient,
    private readonly mapper: ItemMapper,
  ) {}

  public async findById(templateId: string): Promise<ItemTemplate | null> {
    const itemTemplateClient = this.prismaClient as PrismaClient & { itemTemplate: ItemTemplateDelegate };
    const template = await itemTemplateClient.itemTemplate.findFirst({
      where: { id: templateId },
    });

    return template === null ? null : this.mapper.toTemplateDomain(template);
  }

  public async create(template: ItemTemplate): Promise<void> {
    const itemTemplateClient = this.prismaClient as PrismaClient & { itemTemplate: ItemTemplateDelegate };
    await itemTemplateClient.itemTemplate.create({
      data: this.mapper.templateToPersistenceCreate(template),
    });
  }
}
