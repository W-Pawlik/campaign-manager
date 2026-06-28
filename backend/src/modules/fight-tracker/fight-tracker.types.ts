export const FIGHT_TRACKER_TYPES = {
  FightEncounterRepository: Symbol.for("fightTracker.FightEncounterRepository"),
  FightTrackerReadRepository: Symbol.for("fightTracker.FightTrackerReadRepository"),
  FightEncounterMapper: Symbol.for("fightTracker.FightEncounterMapper"),
  CreateFightEncounterHandler: Symbol.for("fightTracker.CreateFightEncounterHandler"),
  UpdateFightEncounterHandler: Symbol.for("fightTracker.UpdateFightEncounterHandler"),
  DeleteFightEncounterHandler: Symbol.for("fightTracker.DeleteFightEncounterHandler"),
  StartFightEncounterRunHandler: Symbol.for("fightTracker.StartFightEncounterRunHandler"),
  UpdateFightEncounterRunStateHandler: Symbol.for("fightTracker.UpdateFightEncounterRunStateHandler"),
  FinishFightEncounterRunHandler: Symbol.for("fightTracker.FinishFightEncounterRunHandler"),
  GetFightEncounterDetailsHandler: Symbol.for("fightTracker.GetFightEncounterDetailsHandler"),
  ListFightTrackerOverviewHandler: Symbol.for("fightTracker.ListFightTrackerOverviewHandler"),
} as const;
