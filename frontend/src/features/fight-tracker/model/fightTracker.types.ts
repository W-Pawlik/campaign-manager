export type FightCombatantKind = "HERO" | "NPC" | "MONSTER" | "QUICK";

export type FightConditionUnit = "ROUNDS" | "TURNS" | "PERMANENT";

export type FightConditionTone =
  | "violet"
  | "emerald"
  | "amber"
  | "blue"
  | "red"
  | "slate";

export type FightTrackerFilter = "ALL" | FightCombatantKind;

export type FightCondition = {
  id: string;
  name: string;
  details: string;
  duration: number | null;
  unit: FightConditionUnit;
  tone: FightConditionTone;
};

export type FightCombatant = {
  id: string;
  sourceId: string | null;
  name: string;
  subtitle: string;
  kind: FightCombatantKind;
  avatarUrl: string | null;
  initiative: number;
  armorClass: number;
  speed: string;
  hitPoints: number;
  maxHitPoints: number;
  tempHitPoints: number;
  notes: string;
  tags: string[];
  conditions: FightCondition[];
};

export type FightLogTone = "neutral" | "damage" | "heal" | "effect" | "system";

export type FightLogEntry = {
  id: string;
  timeLabel: string;
  text: string;
  tone: FightLogTone;
};

export type FightEncounterStatus = "IN_PROGRESS" | "PAUSED";

export type FightTrackerState = {
  id: string;
  encounterName: string;
  encounterStatus: FightEncounterStatus;
  environmentName: string;
  environmentDetails: string;
  round: number;
  startedAtLabel: string;
  durationLabel: string;
  combatants: FightCombatant[];
  currentIndex: number;
  globalConditions: FightCondition[];
  log: FightLogEntry[];
};

export type FightPreparedEncounter = {
  id: string;
  encounterName: string;
  environmentName: string;
  environmentDetails: string;
  combatantCount: number;
  conditionCount: number;
  description: string;
  updatedAtLabel: string;
};

export type FightEncounterHistoryEntry = {
  id: string;
  encounterName: string;
  environmentName: string;
  durationLabel: string;
  roundsCompleted: number;
  combatantCount: number;
  finishedAtLabel: string;
  outcomeLabel: string;
  highlights: string[];
};

export type FightEncounterSummary = FightEncounterHistoryEntry;

export type FightEncounterRun = {
  id: string;
  encounterId: string;
  campaignId: string;
  status: string;
  startedAt: string;
  finishedAt: string | null;
  roundsCompleted: number;
  durationSeconds: number | null;
  outcomeLabel: string | null;
  stateData: FightTrackerState | null;
};

export type FightEncounterDetails = {
  id: string;
  campaignId: string;
  name: string;
  environmentName: string;
  environmentDetails: string;
  combatantCount: number;
  conditionCount: number;
  preparationData: FightTrackerState | null;
  createdAt: string;
  updatedAt: string;
  activeRun: FightEncounterRun | null;
  history: FightEncounterHistoryEntry[];
};

export type FightTrackerOverview = {
  encounters: FightPreparedEncounter[];
  history: FightEncounterHistoryEntry[];
};

export type CreateEncounterValues = {
  encounterName: string;
  environmentName: string;
  environmentDetails: string;
};

export type FightConditionFormValues = {
  targetCombatantId: string | null;
  name: string;
  details: string;
  duration: number | null;
  unit: FightConditionUnit;
  tone: FightConditionTone;
};

export type QuickAddCombatantValues = {
  name: string;
  subtitle: string;
  kind: FightCombatantKind;
  initiative: number;
  armorClass: number;
  speed: string;
  hitPoints: number;
  tempHitPoints: number;
};

export type HpAdjustmentValues = {
  combatantId: string;
  damage: number;
  healing: number;
  tempDelta: number;
};
