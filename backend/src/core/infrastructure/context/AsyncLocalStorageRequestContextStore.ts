import { AsyncLocalStorage } from "node:async_hooks";
import type { RequestContext } from "@core/application/context/RequestContext";
import type { RequestContextStore } from "@core/application/context/RequestContextStore";

export class AsyncLocalStorageRequestContextStore implements RequestContextStore {
  private readonly storage = new AsyncLocalStorage<RequestContext>();

  public run<T>(context: RequestContext, callback: () => T): T {
    return this.storage.run(context, callback);
  }

  public get(): RequestContext | undefined {
    return this.storage.getStore();
  }

  public set(partial: Partial<RequestContext>): void {
    const currentContext = this.storage.getStore();

    if (!currentContext) {
      return;
    }

    this.storage.enterWith({
      ...currentContext,
      ...partial,
    });
  }
}