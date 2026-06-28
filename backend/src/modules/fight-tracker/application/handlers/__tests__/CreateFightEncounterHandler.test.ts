import { describe, expect, it, vi } from "vitest";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CreateFightEncounterCommand } from "@modules/fight-tracker/application/commands/CreateFightEncounterCommand";
import { CreateFightEncounterHandler } from "@modules/fight-tracker/application/handlers/CreateFightEncounterHandler";
import type { FightEncounterRepository } from "@modules/fight-tracker/application/ports/FightEncounterRepository";
import type { FightTrackerReadRepository } from "@modules/fight-tracker/application/ports/FightTrackerReadRepository";

describe("CreateFightEncounterHandler", () => {
  it("creates a prepared encounter and returns its details", async () => {
    const encounterRepository: FightEncounterRepository = {
      createEncounter: vi.fn(async () => undefined),
      findEncounterById: vi.fn(async () => null),
      saveEncounter: vi.fn(async () => undefined),
      archiveEncounter: vi.fn(async () => undefined),
      createRun: vi.fn(async () => undefined),
      findActiveRunByEncounterId: vi.fn(async () => null),
      findRunById: vi.fn(async () => null),
      saveRun: vi.fn(async () => undefined),
    };
    const readRepository: FightTrackerReadRepository = {
      getOverview: vi.fn(async () => ({ encounters: [], history: [] })),
      getEncounterDetails: vi.fn(async () => ({
        id: "encounter-1",
        campaignId: "campaign-1",
        name: "Bridge ambush",
        environmentName: "Broken bridge",
        environmentDetails: "High wind and bad footing.",
        combatantCount: 3,
        conditionCount: 1,
        preparationData: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        activeRun: null,
        history: [],
      })),
    };
    const accessService = {
      requireMembership: vi.fn(),
      requirePermission: vi.fn(async () => ({
        campaign: {} as never,
        member: {} as never,
        role: {} as never,
      })),
    } as unknown as CampaignAccessApplicationService;

    const handler = new CreateFightEncounterHandler(
      encounterRepository,
      readRepository,
      accessService,
    );

    const result = await handler.execute(
      new CreateFightEncounterCommand({
        campaignId: "campaign-1",
        actorUserId: "user-1",
        name: " Bridge ambush ",
        environmentName: " Broken bridge ",
        environmentDetails: " High wind and bad footing. ",
        combatantCount: 3,
        conditionCount: 1,
      }),
    );

    expect(accessService.requirePermission).toHaveBeenCalled();
    expect(encounterRepository.createEncounter).toHaveBeenCalledTimes(1);
    expect(result.name).toBe("Bridge ambush");
  });
});
