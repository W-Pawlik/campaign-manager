import type { PrismaClient } from "@prisma/client";
import type { ItemTemplateRepository } from "@modules/items/application/ports/ItemTemplateRepository";
import type {
  ItemTemplatePageResult,
  ListPublishedItemTemplatesFilters,
} from "@modules/items/application/ports/ItemTemplateRepository";
import type { ItemTemplate } from "@modules/items/domain/entities/ItemTemplate";
import type { ItemMapper, ItemTemplatePersistenceRecord } from "@modules/items/infrastructure/persistence/ItemMapper";

interface ItemTemplateDelegate {
  findFirst(args: unknown): Promise<ItemTemplatePersistenceRecord | null>;
  findMany(args: unknown): Promise<ItemTemplatePersistenceRecord[]>;
  count(args: unknown): Promise<number>;
  create(args: unknown): Promise<unknown>;
  update(args: unknown): Promise<unknown>;
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

    return template === null ? null : this.mapper.toTemplateDomain(template as ItemTemplatePersistenceRecord);
  }

  public async listPublished(
    filters: ListPublishedItemTemplatesFilters,
  ): Promise<ItemTemplatePageResult> {
    const itemTemplateClient = this.prismaClient as PrismaClient & { itemTemplate: ItemTemplateDelegate };
    const skip = (filters.page - 1) * filters.limit;
    const where = {
      ...(filters.search === undefined
        ? {}
        : { name: { contains: filters.search, mode: "insensitive" as const } }),
      ...(filters.type === undefined ? {} : { type: filters.type }),
      ...(filters.rarity === undefined ? {} : { rarity: filters.rarity }),
      ...(filters.isMagical === undefined ? {} : { isMagical: filters.isMagical }),
    };

    const [items, total] = await Promise.all([
      itemTemplateClient.itemTemplate.findMany({
        where,
        orderBy: [
          { updatedAt: "desc" },
          { createdAt: "desc" },
        ],
        skip,
        take: filters.limit,
      }),
      itemTemplateClient.itemTemplate.count({ where }),
    ]);

    return {
      items: items.map((item) => this.mapper.toTemplateDomain(item as ItemTemplatePersistenceRecord)),
      limit: filters.limit,
      page: filters.page,
      total,
      hasNext: skip + items.length < total,
    };
  }

  public async create(template: ItemTemplate): Promise<void> {
    const itemTemplateClient = this.prismaClient as PrismaClient & { itemTemplate: ItemTemplateDelegate };
    await itemTemplateClient.itemTemplate.create({
      data: this.mapper.templateToPersistenceCreate(template),
    });
  }

  public async save(template: ItemTemplate): Promise<void> {
    const itemTemplateClient = this.prismaClient as PrismaClient & { itemTemplate: ItemTemplateDelegate };
    await itemTemplateClient.itemTemplate.update({
      where: { id: template.id },
      data: this.mapper.templateToPersistenceCreate(template),
    });
  }
}
