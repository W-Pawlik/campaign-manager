import { useEffect, useMemo, useState } from "react";

import type {
  CreateEncounterValues,
  FightCombatant,
  FightCombatantKind,
  FightCondition,
  FightConditionFormValues,
  FightConditionUnit,
  FightEncounterDetails,
  FightEncounterSummary,
  FightLogEntry,
  FightTrackerState,
  HpAdjustmentValues,
  QuickAddCombatantValues,
} from "@/features/fight-tracker/model/fightTracker.types";

function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function cloneState<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function parseDurationLabelToSeconds(label: string): number {
  const parts = label.split(":").map((value) => Number(value));

  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) {
    return 0;
  }

  return parts[0] * 3600 + parts[1] * 60 + parts[2];
}

export function formatDurationFromSeconds(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

export function formatDateTimeLabel(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatClockLabel(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function createLogEntry(text: string, tone: FightLogEntry["tone"]): FightLogEntry {
  return {
    id: createId("log"),
    text,
    tone,
    timeLabel: new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date()),
  };
}

function createCondition(values: FightConditionFormValues): FightCondition {
  return {
    id: createId("condition"),
    name: values.name.trim(),
    details: values.details.trim() || "No details added.",
    duration: values.unit === "PERMANENT" ? null : values.duration,
    tone: values.tone,
    unit: values.unit,
  };
}

function normalizeCombatants(combatants: FightCombatant[]): FightCombatant[] {
  return [...combatants].sort((left, right) => {
    if (right.initiative !== left.initiative) {
      return right.initiative - left.initiative;
    }

    return left.name.localeCompare(right.name);
  });
}

function formatKindLabel(kind: FightCombatantKind): string {
  switch (kind) {
    case "HERO":
      return "Hero";
    case "NPC":
      return "NPC";
    case "MONSTER":
      return "Monster";
    default:
      return "Quick add";
  }
}

function tickConditions(
  conditions: FightCondition[],
  unit: FightConditionUnit,
  ownerName: string,
  logs: FightLogEntry[],
): FightCondition[] {
  const nextConditions: FightCondition[] = [];

  conditions.forEach((condition) => {
    if (condition.unit !== unit || condition.duration === null) {
      nextConditions.push(condition);
      return;
    }

    const nextDuration = condition.duration - 1;

    if (nextDuration <= 0) {
      logs.push(createLogEntry(`${condition.name} expires on ${ownerName}.`, "system"));
      return;
    }

    nextConditions.push({
      ...condition,
      duration: nextDuration,
    });
  });

  return nextConditions;
}

export function createEncounterState(values: CreateEncounterValues): FightTrackerState {
  return {
    id: createId("encounter"),
    encounterName: values.encounterName.trim(),
    encounterStatus: "PAUSED",
    environmentName: values.environmentName.trim(),
    environmentDetails: values.environmentDetails.trim(),
    round: 1,
    startedAtLabel: "Not started",
    durationLabel: "00:00:00",
    combatants: [],
    currentIndex: 0,
    globalConditions: [],
    log: [createLogEntry("Encounter prepared and ready to start.", "system")],
  };
}

function isFightTrackerState(value: unknown): value is FightTrackerState {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Partial<FightTrackerState>;

  return (
    typeof record.encounterName === "string" &&
    typeof record.environmentName === "string" &&
    typeof record.environmentDetails === "string" &&
    typeof record.round === "number" &&
    Array.isArray(record.combatants) &&
    Array.isArray(record.globalConditions) &&
    Array.isArray(record.log)
  );
}

function buildTrackerStateFromEncounter(details: FightEncounterDetails): FightTrackerState {
  const source = details.activeRun?.stateData ?? details.preparationData;

  if (isFightTrackerState(source)) {
    return {
      ...cloneState(source),
      id: details.id,
      encounterName: details.name,
      environmentName: details.environmentName,
      environmentDetails: details.environmentDetails,
      encounterStatus: details.activeRun ? "IN_PROGRESS" : "PAUSED",
      startedAtLabel: details.activeRun
        ? `Started ${formatClockLabel(new Date(details.activeRun.startedAt))}`
        : "Not started",
      durationLabel: formatDurationFromSeconds(details.activeRun?.durationSeconds ?? 0),
    };
  }

  return {
    id: details.id,
    encounterName: details.name,
    encounterStatus: details.activeRun ? "IN_PROGRESS" : "PAUSED",
    environmentName: details.environmentName,
    environmentDetails: details.environmentDetails,
    round: details.activeRun?.roundsCompleted && details.activeRun.roundsCompleted > 0
      ? details.activeRun.roundsCompleted
      : 1,
    startedAtLabel: details.activeRun
      ? `Started ${formatClockLabel(new Date(details.activeRun.startedAt))}`
      : "Not started",
    durationLabel: formatDurationFromSeconds(details.activeRun?.durationSeconds ?? 0),
    combatants: [],
    currentIndex: 0,
    globalConditions: [],
    log: [],
  };
}

function buildFinishedSummary(
  encounter: FightTrackerState,
  durationLabel: string,
): FightEncounterSummary {
  const survivingCount = encounter.combatants.filter((combatant) => combatant.hitPoints > 0).length;

  return {
    id: encounter.id,
    encounterName: encounter.encounterName,
    environmentName: encounter.environmentName,
    durationLabel,
    roundsCompleted: encounter.round,
    combatantCount: encounter.combatants.length,
    finishedAtLabel: formatDateTimeLabel(new Date()),
    outcomeLabel:
      survivingCount === encounter.combatants.length
        ? "Encounter complete"
        : `${survivingCount}/${encounter.combatants.length} combatants still standing`,
    highlights: encounter.log.slice(0, 3).map((entry) => entry.text),
  };
}

function makeQuickCombatant(values: QuickAddCombatantValues): FightCombatant {
  return {
    id: createId("combatant"),
    sourceId: null,
    name: values.name.trim(),
    subtitle: values.subtitle.trim() || formatKindLabel(values.kind),
    kind: values.kind,
    avatarUrl: null,
    initiative: values.initiative,
    armorClass: values.armorClass,
    speed: values.speed.trim() || "30 ft",
    hitPoints: values.hitPoints,
    maxHitPoints: values.hitPoints,
    tempHitPoints: values.tempHitPoints,
    notes: "",
    tags: [formatKindLabel(values.kind)],
    conditions: [],
  };
}

export function buildImportedCombatant(input: {
  sourceId: string;
  avatarUrl?: string | null;
  kind: FightCombatantKind;
  name: string;
  subtitle: string;
  armorClass?: number | null;
  hitPoints?: number | null;
  speed?: string | null;
  initiative?: number | null;
  tags?: string[];
}): FightCombatant {
  return {
    id: createId("combatant"),
    sourceId: input.sourceId,
    name: input.name,
    subtitle: input.subtitle,
    kind: input.kind,
    avatarUrl: input.avatarUrl ?? null,
    initiative: input.initiative ?? 10,
    armorClass: input.armorClass ?? 15,
    speed: input.speed ?? "30 ft",
    hitPoints: input.hitPoints ?? 32,
    maxHitPoints: input.hitPoints ?? 32,
    tempHitPoints: 0,
    notes: "",
    tags: input.tags ?? [formatKindLabel(input.kind)],
    conditions: [],
  };
}

type UseFightTrackerStateOptions = {
  encounterDetails: FightEncounterDetails | null;
  onFinishEncounter: (payload: {
    durationSeconds: number;
    outcomeLabel: string;
    summaryData: FightEncounterSummary;
  }) => void;
  onPersistPreparedState: (state: FightTrackerState) => void;
  onPersistRunState: (state: FightTrackerState, durationSeconds: number) => void;
};

export function useFightTrackerState({
  encounterDetails,
  onFinishEncounter,
  onPersistPreparedState,
  onPersistRunState,
}: UseFightTrackerStateOptions) {
  const [state, setState] = useState<FightTrackerState | null>(null);
  const [history, setHistory] = useState<FightTrackerState[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const syncKey = useMemo(() => {
    if (!encounterDetails) {
      return "missing";
    }

    return JSON.stringify({
      activeRunId: encounterDetails.activeRun?.id ?? null,
      durationSeconds: encounterDetails.activeRun?.durationSeconds ?? null,
      encounterId: encounterDetails.id,
      updatedAt: encounterDetails.updatedAt,
    });
  }, [encounterDetails]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!encounterDetails) {
      setState(null);
      setHistory([]);
      setElapsedSeconds(0);
      setIsTimerRunning(false);
      return;
    }

    const nextState = buildTrackerStateFromEncounter(encounterDetails);
    setState(nextState);
    setHistory([]);
    setElapsedSeconds(encounterDetails.activeRun?.durationSeconds ?? parseDurationLabelToSeconds(nextState.durationLabel));
    setIsTimerRunning(false);
  }, [encounterDetails, syncKey]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!isTimerRunning || !state) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setElapsedSeconds((currentValue) => currentValue + 1);
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isTimerRunning, state]);

  const isActiveRun = encounterDetails?.activeRun !== null;

  const persistState = (nextState: FightTrackerState, nextElapsedSeconds = elapsedSeconds) => {
    const stateToPersist = {
      ...cloneState(nextState),
      durationLabel: formatDurationFromSeconds(nextElapsedSeconds),
    };

    if (isActiveRun) {
      onPersistRunState(stateToPersist, nextElapsedSeconds);
      return;
    }

    onPersistPreparedState(stateToPersist);
  };

  const commit = (mutate: (draft: FightTrackerState) => void) => {
    setState((previousState) => {
      if (!previousState) {
        return previousState;
      }

      const snapshot = cloneState(previousState);
      const draft = cloneState(previousState);
      mutate(draft);
      draft.durationLabel = formatDurationFromSeconds(elapsedSeconds);
      setHistory((previousHistory) => [...previousHistory, snapshot]);
      persistState(draft);

      return draft;
    });
  };

  const currentCombatant = state?.combatants[state.currentIndex] ?? null;
  const onDeckCombatant =
    state && state.combatants.length > 1
      ? state.combatants[(state.currentIndex + 1) % state.combatants.length] ?? null
      : null;

  const combatantCounts = useMemo(
    () =>
      (state?.combatants ?? []).reduce(
        (accumulator, combatant) => {
          accumulator[combatant.kind] += 1;
          return accumulator;
        },
        { HERO: 0, NPC: 0, MONSTER: 0, QUICK: 0 } as Record<FightCombatantKind, number>,
      ),
    [state?.combatants],
  );

  const advanceTurn = () => {
    if (!state || state.combatants.length === 0 || !isActiveRun) {
      return;
    }

    commit((draft) => {
      const nextLogs: FightLogEntry[] = [];
      const wrapped = draft.currentIndex >= draft.combatants.length - 1;

      draft.combatants = draft.combatants.map((combatant) => ({
        ...combatant,
        conditions: tickConditions(combatant.conditions, "TURNS", combatant.name, nextLogs),
      }));
      draft.globalConditions = tickConditions(
        draft.globalConditions,
        "TURNS",
        "the battlefield",
        nextLogs,
      );

      if (wrapped) {
        draft.round += 1;
        draft.combatants = draft.combatants.map((combatant) => ({
          ...combatant,
          conditions: tickConditions(combatant.conditions, "ROUNDS", combatant.name, nextLogs),
        }));
        draft.globalConditions = tickConditions(
          draft.globalConditions,
          "ROUNDS",
          "the battlefield",
          nextLogs,
        );
        nextLogs.unshift(createLogEntry(`Round ${draft.round} begins.`, "system"));
      }

      draft.currentIndex = wrapped ? 0 : draft.currentIndex + 1;

      const nextCombatant = draft.combatants[draft.currentIndex];

      if (nextCombatant) {
        nextLogs.push(createLogEntry(`Turn passes to ${nextCombatant.name}.`, "system"));
      }

      draft.log = [...nextLogs, ...draft.log].slice(0, 40);
    });
  };

  const revertLastAction = () => {
    setHistory((previousHistory) => {
      const nextHistory = [...previousHistory];
      const previousState = nextHistory.pop();

      if (previousState) {
        setState(previousState);
        persistState(previousState);
      }

      return nextHistory;
    });
  };

  const finishEncounter = () => {
    if (!state) {
      return null;
    }

    const durationLabel = formatDurationFromSeconds(elapsedSeconds);
    const summary = buildFinishedSummary(state, durationLabel);

    setIsTimerRunning(false);
    onFinishEncounter({
      durationSeconds: elapsedSeconds,
      outcomeLabel: summary.outcomeLabel,
      summaryData: summary,
    });

    return summary;
  };

  const toggleTimer = () => {
    if (!state || !isActiveRun) {
      return;
    }

    setIsTimerRunning((currentValue) => !currentValue);
  };

  const addCombatant = (combatant: FightCombatant) => {
    if (!state) {
      return;
    }

    commit((draft) => {
      const currentCombatantId = draft.combatants[draft.currentIndex]?.id ?? null;
      draft.combatants = normalizeCombatants([...draft.combatants, combatant]);
      draft.currentIndex = Math.max(
        0,
        draft.combatants.findIndex((entry) => entry.id === currentCombatantId),
      );
      draft.log = [
        createLogEntry(`${combatant.name} joins the initiative order.`, "system"),
        ...draft.log,
      ].slice(0, 40);
    });
  };

  const addQuickCombatant = (values: QuickAddCombatantValues) => {
    addCombatant(makeQuickCombatant(values));
  };

  const removeCombatant = (combatantId: string) => {
    if (!state) {
      return;
    }

    commit((draft) => {
      const removedCombatant = draft.combatants.find((combatant) => combatant.id === combatantId);

      draft.combatants = draft.combatants.filter((combatant) => combatant.id !== combatantId);

      if (draft.combatants.length === 0) {
        draft.currentIndex = 0;
      } else if (draft.currentIndex >= draft.combatants.length) {
        draft.currentIndex = draft.combatants.length - 1;
      }

      if (removedCombatant) {
        draft.log = [
          createLogEntry(`${removedCombatant.name} is removed from combat.`, "system"),
          ...draft.log,
        ].slice(0, 40);
      }
    });
  };

  const applyHpAdjustment = (values: HpAdjustmentValues) => {
    if (!state || (values.damage === 0 && values.healing === 0 && values.tempDelta === 0)) {
      return;
    }

    commit((draft) => {
      const combatant = draft.combatants.find((entry) => entry.id === values.combatantId);

      if (!combatant) {
        return;
      }

      if (values.damage > 0) {
        combatant.hitPoints = Math.max(0, combatant.hitPoints - values.damage);
      }

      if (values.healing > 0) {
        combatant.hitPoints = Math.min(combatant.maxHitPoints, combatant.hitPoints + values.healing);
      }

      if (values.tempDelta !== 0) {
        combatant.tempHitPoints = Math.max(0, combatant.tempHitPoints + values.tempDelta);
      }

      const logParts = [
        values.damage > 0 ? `${values.damage} damage` : null,
        values.healing > 0 ? `${values.healing} healing` : null,
        values.tempDelta !== 0 ? `${values.tempDelta > 0 ? "+" : ""}${values.tempDelta} temp HP` : null,
      ].filter((value): value is string => value !== null);

      if (logParts.length > 0) {
        draft.log = [
          createLogEntry(
            `${combatant.name} receives ${logParts.join(", ")} (${combatant.hitPoints}/${combatant.maxHitPoints} HP).`,
            values.damage > values.healing ? "damage" : "heal",
          ),
          ...draft.log,
        ].slice(0, 40);
      }
    });
  };

  const updateInitiative = (combatantId: string, delta: number) => {
    if (!state) {
      return;
    }

    commit((draft) => {
      const currentCombatantId = draft.combatants[draft.currentIndex]?.id ?? null;
      const combatant = draft.combatants.find((entry) => entry.id === combatantId);

      if (!combatant) {
        return;
      }

      combatant.initiative = Math.max(0, combatant.initiative + delta);
      draft.combatants = normalizeCombatants(draft.combatants);
      draft.currentIndex = Math.max(
        0,
        draft.combatants.findIndex((entry) => entry.id === currentCombatantId),
      );
    });
  };

  const addCondition = (values: FightConditionFormValues) => {
    if (!state) {
      return;
    }

    const condition = createCondition(values);

    commit((draft) => {
      if (values.targetCombatantId) {
        const combatant = draft.combatants.find((entry) => entry.id === values.targetCombatantId);

        if (!combatant) {
          return;
        }

        combatant.conditions = [...combatant.conditions, condition];
        draft.log = [
          createLogEntry(
            `${combatant.name} gains ${condition.name}${condition.duration ? ` (${condition.duration} ${condition.unit.toLowerCase()})` : ""}.`,
            "effect",
          ),
          ...draft.log,
        ].slice(0, 40);
        return;
      }

      draft.globalConditions = [...draft.globalConditions, condition];
      draft.log = [createLogEntry(`Battlefield condition ${condition.name} is added.`, "effect"), ...draft.log].slice(
        0,
        40,
      );
    });
  };

  const removeCondition = (conditionId: string, combatantId?: string) => {
    if (!state) {
      return;
    }

    commit((draft) => {
      if (combatantId) {
        const combatant = draft.combatants.find((entry) => entry.id === combatantId);

        if (!combatant) {
          return;
        }

        const removedCondition = combatant.conditions.find((condition) => condition.id === conditionId);
        combatant.conditions = combatant.conditions.filter((condition) => condition.id !== conditionId);

        if (removedCondition) {
          draft.log = [
            createLogEntry(`${removedCondition.name} is removed from ${combatant.name}.`, "system"),
            ...draft.log,
          ].slice(0, 40);
        }

        return;
      }

      const removedCondition = draft.globalConditions.find((condition) => condition.id === conditionId);
      draft.globalConditions = draft.globalConditions.filter((condition) => condition.id !== conditionId);

      if (removedCondition) {
        draft.log = [
          createLogEntry(`Battlefield condition ${removedCondition.name} ends.`, "system"),
          ...draft.log,
        ].slice(0, 40);
      }
    });
  };

  const resolvedState =
    state === null
      ? null
      : {
          ...state,
          durationLabel: formatDurationFromSeconds(elapsedSeconds),
        };

  return {
    addCombatant,
    addCondition,
    addQuickCombatant,
    advanceTurn,
    applyHpAdjustment,
    combatantCounts,
    currentCombatant,
    durationLabel: formatDurationFromSeconds(elapsedSeconds),
    finishEncounter,
    hasUndo: history.length > 0,
    isActiveRun,
    isTimerRunning,
    onDeckCombatant,
    removeCombatant,
    removeCondition,
    revertLastAction,
    state: resolvedState,
    toggleTimer,
    updateInitiative,
  };
}
