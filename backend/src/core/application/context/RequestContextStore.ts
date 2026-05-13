import type { RequestContext } from "@core/application/context/RequestContext";

export interface RequestContextStore {
  run<T>(context: RequestContext, callback: () => T): T;
  get(): RequestContext | undefined;
  set(partial: Partial<RequestContext>): void;
}