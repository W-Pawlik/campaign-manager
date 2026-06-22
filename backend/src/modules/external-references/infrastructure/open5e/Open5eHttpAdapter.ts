import { coreConfig } from "@core/config/core.config";
import {
  Open5eInvalidResponseError,
  Open5eRateLimitedError,
  Open5eResourceNotFoundError,
  Open5eTimeoutError,
  Open5eUnavailableError,
  Open5eUnsupportedResourceTypeError,
} from "@modules/external-references/application/errors/Open5eErrors";
import type {
  Open5eClient,
  Open5eGetResourceInput,
  Open5eResourceDetails,
  Open5eSearchInput,
  Open5eSearchResult,
} from "@modules/external-references/application/ports/Open5eClient";
import { EXTERNAL_RESOURCE_TYPE } from "@modules/external-references/domain/value-objects/ExternalResourceType";
import type { Open5eMapper } from "@modules/external-references/infrastructure/open5e/Open5eMapper";

function mapResourceTypeToEndpoint(resourceType: string): string {
  switch (resourceType) {
    case EXTERNAL_RESOURCE_TYPE.CREATURE:
      return "creatures";
    case EXTERNAL_RESOURCE_TYPE.SPELL:
      return "spells";
    case EXTERNAL_RESOURCE_TYPE.MAGIC_ITEM:
      return "magicitems";
    case EXTERNAL_RESOURCE_TYPE.WEAPON:
      return "weapons";
    case EXTERNAL_RESOURCE_TYPE.ARMOR:
      return "armor";
    case EXTERNAL_RESOURCE_TYPE.EQUIPMENT:
      return "items";
    case EXTERNAL_RESOURCE_TYPE.CLASS:
      return "classes";
    case EXTERNAL_RESOURCE_TYPE.SPECIES:
      return "species";
    case EXTERNAL_RESOURCE_TYPE.BACKGROUND:
      return "backgrounds";
    case EXTERNAL_RESOURCE_TYPE.FEAT:
      return "feats";
    case EXTERNAL_RESOURCE_TYPE.RULE:
      return "rules";
    case EXTERNAL_RESOURCE_TYPE.CONDITION:
      return "conditions";
    case EXTERNAL_RESOURCE_TYPE.DOCUMENT:
      return "documents";
    default:
      throw new Open5eUnsupportedResourceTypeError();
  }
}

export class Open5eHttpAdapter implements Open5eClient {
  public constructor(private readonly mapper: Open5eMapper) {}

  public async search(input: Open5eSearchInput): Promise<Open5eSearchResult[]> {
    const searchUrl = new URL("/v2/search/", coreConfig.open5e.apiBaseUrl);

    searchUrl.searchParams.set("query", input.query);
    searchUrl.searchParams.set("limit", (input.limit ?? 20).toString());
    searchUrl.searchParams.set("page", (input.page ?? 1).toString());

    const payload = await this.fetchJson(searchUrl);
    const mappedResults = this.mapper.mapSearchResults(payload);

    if (input.resourceTypes === undefined || input.resourceTypes.length === 0) {
      return mappedResults;
    }

    return mappedResults.filter((result) =>
      input.resourceTypes?.includes(result.resourceType),
    );
  }

  public async getResource(
    input: Open5eGetResourceInput,
  ): Promise<Open5eResourceDetails> {
    const endpoint = mapResourceTypeToEndpoint(input.resourceType);
    const resourceUrl = new URL(`/v2/${endpoint}/`, coreConfig.open5e.apiBaseUrl);

    resourceUrl.searchParams.set("key", input.key);
    resourceUrl.searchParams.set("limit", "1");

    const payload = await this.fetchJson(resourceUrl);

    try {
      return this.mapper.mapResourceDetails(
        input.resourceType,
        payload,
        new URL(`/v2/${endpoint}/`, coreConfig.open5e.apiBaseUrl).toString(),
      );
    } catch (error) {
      if (error instanceof Open5eInvalidResponseError) {
        const count =
          payload !== null &&
          typeof payload === "object" &&
          "count" in payload &&
          typeof payload.count === "number"
            ? payload.count
            : null;

        if (count === 0) {
          throw new Open5eResourceNotFoundError();
        }
      }

      throw error;
    }
  }

  private async fetchJson(url: URL): Promise<unknown> {
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      coreConfig.open5e.timeoutMs,
    );

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        signal: controller.signal,
      });

      if (response.status === 404) {
        throw new Open5eResourceNotFoundError();
      }

      if (response.status === 429) {
        throw new Open5eRateLimitedError();
      }

      if (response.status >= 500) {
        throw new Open5eUnavailableError();
      }

      if (!response.ok) {
        throw new Open5eUnavailableError();
      }

      try {
        return await response.json();
      } catch (error) {
        throw new Open5eInvalidResponseError(error);
      }
    } catch (error) {
      if (
        error instanceof Open5eResourceNotFoundError ||
        error instanceof Open5eRateLimitedError ||
        error instanceof Open5eUnavailableError ||
        error instanceof Open5eUnsupportedResourceTypeError ||
        error instanceof Open5eInvalidResponseError
      ) {
        throw error;
      }

      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Open5eTimeoutError(error);
      }

      throw new Open5eUnavailableError(error);
    } finally {
      clearTimeout(timeout);
    }
  }
}
