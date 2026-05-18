import type { Container } from "inversify";
import { registerAuthHandlers } from "@modules/auth/auth.handlers";
import { registerUsersHandlers } from "@modules/users/users.handlers";

export function registerHandlers(container: Container): void {
  registerAuthHandlers(container);
  registerUsersHandlers(container);
}
