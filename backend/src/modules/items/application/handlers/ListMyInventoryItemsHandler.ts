import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import type { CharacterReadRepository } from "@modules/characters/application/ports/CharacterReadRepository";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { InventoryItemDTO } from "@modules/items/application/dto/InventoryItemDTO";
import type { InventoryItemReadRepository } from "@modules/items/application/ports/InventoryItemReadRepository";
import type { ListMyInventoryItemsQuery } from "@modules/items/application/queries/ListMyInventoryItemsQuery";
import { mapInventoryItemDtoFromDomain } from "@modules/items/application/services/ItemDtoMapper";
import { InventoryOwnerType } from "@modules/items/domain/value-objects/InventoryOwnerType";

export class ListMyInventoryItemsHandler implements QueryHandler<ListMyInventoryItemsQuery, InventoryItemDTO[]> {
  public constructor(
    private readonly accessService: CampaignAccessApplicationService,
    private readonly characterReadRepository: CharacterReadRepository,
    private readonly inventoryItemReadRepository: InventoryItemReadRepository,
  ) {}

  public async execute(query: ListMyInventoryItemsQuery): Promise<InventoryItemDTO[]> {
    await this.accessService.requireMembership(query.input.campaignId, query.input.actorUserId);

    const characters = await this.characterReadRepository.listCampaignCharacters(query.input.campaignId);
    const ownedCharacterIds = characters
      .filter((character) => character.ownerUserId === query.input.actorUserId)
      .map((character) => character.id);

    if (ownedCharacterIds.length === 0) {
      return [];
    }

    const items = await Promise.all(
      ownedCharacterIds.map((ownerId) =>
        this.inventoryItemReadRepository.listOwnerInventory(
          query.input.campaignId,
          InventoryOwnerType.create("CHARACTER"),
          ownerId,
        ),
      ),
    );

    return items
      .flat()
      .sort((left, right) => right.updatedAt.getTime() - left.updatedAt.getTime())
      .map((item) => mapInventoryItemDtoFromDomain(item));
  }
}
