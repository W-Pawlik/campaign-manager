import type { Container } from "inversify";
import { registerAuthHandlers } from "@modules/auth/auth.handlers";

export function registerHandlers(container: Container): void {
  registerAuthHandlers(container);
}
