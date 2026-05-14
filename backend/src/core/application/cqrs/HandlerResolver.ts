export interface HandlerResolver {
  resolve<T>(token: symbol): T;
}