import type { Container } from "inversify";
import { registerAuthHandlers } from "@modules/auth/auth.handlers";
import { registerCampaignsHandlers } from "@modules/campaigns/campaigns.handlers";
import { registerCharactersHandlers } from "@modules/characters/characters.handlers";
import { registerChronicleHandlers } from "@modules/chronicle/chronicle.handlers";
import { registerLocationsHandlers } from "@modules/locations/locations.handlers";
import { registerNotesHandlers } from "@modules/notes/notes.handlers";
import { registerNpcsHandlers } from "@modules/npcs/npcs.handlers";
import { registerQuestsHandlers } from "@modules/quests/quests.handlers";
import { registerSessionsHandlers } from "@modules/sessions/sessions.handlers";
import { registerUsersHandlers } from "@modules/users/users.handlers";

export function registerHandlers(container: Container): void {
  registerAuthHandlers(container);
  registerUsersHandlers(container);
  registerCampaignsHandlers(container);
  registerCharactersHandlers(container);
  registerChronicleHandlers(container);
  registerLocationsHandlers(container);
  registerNotesHandlers(container);
  registerNpcsHandlers(container);
  registerQuestsHandlers(container);
  registerSessionsHandlers(container);
}
