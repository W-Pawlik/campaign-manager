import type { Container } from "inversify";
import { registerAuthHandlers } from "@modules/auth/auth.handlers";
import { registerCampaignsHandlers } from "@modules/campaigns/campaigns.handlers";
import { registerCharactersHandlers } from "@modules/characters/characters.handlers";
import { registerUsersHandlers } from "@modules/users/users.handlers";

export function registerHandlers(container: Container): void {
  registerAuthHandlers(container);
  registerUsersHandlers(container);
  registerCampaignsHandlers(container);
  registerCharactersHandlers(container);
}
