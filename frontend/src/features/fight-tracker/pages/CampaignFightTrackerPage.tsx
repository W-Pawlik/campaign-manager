import { Icon } from "@iconify/react";
import { Alert, Button, Grid, Stack } from "@mui/material";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import {
  useCampaignCharactersQuery,
  useCampaignDetailsQuery,
  useCampaignNpcsQuery,
} from "@/features/campaigns";
import {
  useCreateFightEncounterMutation,
  useDeleteFightEncounterMutation,
  useFightEncounterDetailsQuery,
  useFightTrackerOverviewQuery,
  useFinishFightEncounterMutation,
  useStartFightEncounterMutation,
  useUpdateFightEncounterMutation,
  useUpdateFightRunStateMutation,
} from "@/features/fight-tracker/api/fightTrackerQueries";
import {
  buildImportedCombatant,
  createEncounterState,
  useFightTrackerState,
} from "@/features/fight-tracker/model/useFightTrackerState";
import type {
  FightCombatant,
  FightConditionFormValues,
  FightEncounterSummary,
  QuickAddCombatantValues,
  FightTrackerState,
} from "@/features/fight-tracker/model/fightTracker.types";
import { FightTrackerCombatantDialog } from "@/features/fight-tracker/ui/FightTrackerCombatantDialog";
import { FightTrackerConditionDialog } from "@/features/fight-tracker/ui/FightTrackerConditionDialog";
import { FightTrackerConditionsCard } from "@/features/fight-tracker/ui/FightTrackerConditionsCard";
import { FightTrackerControlsCard } from "@/features/fight-tracker/ui/FightTrackerControlsCard";
import { FightTrackerCreateEncounterDialog } from "@/features/fight-tracker/ui/FightTrackerCreateEncounterDialog";
import { FightTrackerDeleteEncounterDialog } from "@/features/fight-tracker/ui/FightTrackerDeleteEncounterDialog";
import { FightTrackerEndEncounterDialog } from "@/features/fight-tracker/ui/FightTrackerEndEncounterDialog";
import { FightTrackerHeader } from "@/features/fight-tracker/ui/FightTrackerHeader";
import { FightTrackerHub } from "@/features/fight-tracker/ui/FightTrackerHub";
import { FightTrackerImportDialog } from "@/features/fight-tracker/ui/FightTrackerImportDialog";
import { FightTrackerLogCard } from "@/features/fight-tracker/ui/FightTrackerLogCard";
import { FightTrackerParticipantsCard } from "@/features/fight-tracker/ui/FightTrackerParticipantsCard";
import { FightTrackerQuickAddDialog } from "@/features/fight-tracker/ui/FightTrackerQuickAddDialog";
import { FightTrackerSummaryDialog } from "@/features/fight-tracker/ui/FightTrackerSummaryDialog";
import { FightTrackerTurnOrderCard } from "@/features/fight-tracker/ui/FightTrackerTurnOrderCard";
import { useCampaignMonstersQuery } from "@/features/monsters";
import { ErrorState, LoadingScreen } from "@/shared/components";

function canManageFight(role: string | undefined): boolean {
  return role === "OWNER" || role === "GM" || role === "CO_GM";
}

function countConditions(state: FightTrackerState): number {
  return (
    state.globalConditions.length +
    state.combatants.reduce((sum, combatant) => sum + combatant.conditions.length, 0)
  );
}

export function CampaignFightTrackerPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const campaignDetailsQuery = useCampaignDetailsQuery(campaignId);
  const overviewQuery = useFightTrackerOverviewQuery(campaignId);
  const charactersQuery = useCampaignCharactersQuery(campaignId);
  const npcsQuery = useCampaignNpcsQuery(campaignId);
  const monstersQuery = useCampaignMonstersQuery(campaignId, {
    includeGlobal: true,
    search: "",
    status: "ACTIVE",
  });
  const [selectedEncounterId, setSelectedEncounterId] = useState<string | null>(null);
  const encounterDetailsQuery = useFightEncounterDetailsQuery(campaignId, selectedEncounterId);
  const createEncounterMutation = useCreateFightEncounterMutation(campaignId);
  const updateEncounterMutation = useUpdateFightEncounterMutation(campaignId, selectedEncounterId);
  const deleteEncounterMutation = useDeleteFightEncounterMutation(campaignId);
  const startEncounterMutation = useStartFightEncounterMutation(campaignId, selectedEncounterId);
  const updateRunStateMutation = useUpdateFightRunStateMutation(campaignId, selectedEncounterId);
  const finishEncounterMutation = useFinishFightEncounterMutation(campaignId, selectedEncounterId);

  const [selectedCombatantId, setSelectedCombatantId] = useState<string | null>(null);
  const [conditionTargetCombatantId, setConditionTargetCombatantId] = useState<string | null>(null);
  const [conditionDialogMode, setConditionDialogMode] = useState<"combatant" | "global" | null>(null);
  const [isQuickAddDialogOpen, setIsQuickAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isCombatantDialogOpen, setIsCombatantDialogOpen] = useState(false);
  const [isCreateEncounterDialogOpen, setIsCreateEncounterDialogOpen] = useState(false);
  const [isEndEncounterDialogOpen, setIsEndEncounterDialogOpen] = useState(false);
  const [isDeleteEncounterDialogOpen, setIsDeleteEncounterDialogOpen] = useState(false);
  const [finishedSummary, setFinishedSummary] = useState<FightEncounterSummary | null>(null);

  const pageError =
    campaignDetailsQuery.error?.message ??
    overviewQuery.error?.message ??
    charactersQuery.error?.message ??
    npcsQuery.error?.message ??
    monstersQuery.error?.message ??
    encounterDetailsQuery.error?.message ??
    null;

  const isLoading =
    campaignDetailsQuery.isLoading ||
    overviewQuery.isLoading ||
    charactersQuery.isLoading ||
    npcsQuery.isLoading ||
    monstersQuery.isLoading ||
    (selectedEncounterId !== null && encounterDetailsQuery.isLoading);

  const encounterDetails = encounterDetailsQuery.data ?? null;
  const managerRole = campaignDetailsQuery.data?.role;
  const canManage = canManageFight(managerRole);

  const tracker = useFightTrackerState({
    encounterDetails,
    onFinishEncounter: ({ durationSeconds, outcomeLabel, summaryData }) => {
      if (!encounterDetails?.activeRun) {
        return;
      }

      setFinishedSummary(summaryData);
      finishEncounterMutation.mutate({
        runId: encounterDetails.activeRun.id,
        roundsCompleted: encounterDetails.activeRun.stateData?.round ?? encounterDetails.activeRun.roundsCompleted,
        durationSeconds,
        outcomeLabel,
        summaryData,
      });
    },
    onPersistPreparedState: (state) => {
      if (!encounterDetails) {
        return;
      }

      updateEncounterMutation.mutate({
        name: encounterDetails.name,
        environmentName: encounterDetails.environmentName,
        environmentDetails: encounterDetails.environmentDetails,
        combatantCount: state.combatants.length,
        conditionCount: countConditions(state),
        preparationData: state,
      });
    },
    onPersistRunState: (state, durationSeconds) => {
      if (!encounterDetails?.activeRun) {
        return;
      }

      updateRunStateMutation.mutate({
        runId: encounterDetails.activeRun.id,
        roundsCompleted: state.round,
        durationSeconds,
        stateData: state,
      });
    },
  });

  const selectedCombatant =
    tracker.state?.combatants.find((combatant) => combatant.id === selectedCombatantId) ??
    tracker.currentCombatant ??
    null;

  const importCandidates = useMemo(() => {
    const characterCandidates: FightCombatant[] = (charactersQuery.data ?? []).map((character) =>
      buildImportedCombatant({
        sourceId: character.id,
        avatarUrl: character.avatarUrl,
        kind: "HERO",
        name: character.name,
        subtitle: `${character.characterClass ?? "Adventurer"}${character.level ? ` - level ${character.level}` : ""}`,
        armorClass: 15,
        hitPoints: Math.max(18, (character.level ?? 3) * 7),
        initiative: 10 + (character.level ?? 0),
        speed: "30 ft",
        tags: ["Campaign", "Character"],
      }),
    );
    const npcCandidates: FightCombatant[] = (npcsQuery.data ?? []).map((npc) =>
      buildImportedCombatant({
        sourceId: npc.id,
        avatarUrl: npc.avatarUrl,
        kind: "NPC",
        name: npc.name,
        subtitle: npc.occupation ?? npc.title ?? "Campaign NPC",
        armorClass: npc.importance === "BOSS" ? 16 : 14,
        hitPoints:
          npc.importance === "BOSS"
            ? 52
            : npc.importance === "MAJOR"
              ? 38
              : npc.importance === "SUPPORTING"
                ? 28
                : 22,
        initiative: npc.importance === "BOSS" ? 14 : 11,
        speed: "30 ft",
        tags: ["Campaign", npc.importance ?? "NPC"],
      }),
    );
    const monsterCandidates: FightCombatant[] = (monstersQuery.data ?? []).map((monster) =>
      buildImportedCombatant({
        sourceId: monster.id,
        kind: "MONSTER",
        name: monster.name,
        subtitle: monster.type ?? monster.source,
        armorClass: monster.armorClass,
        hitPoints: monster.hitPoints,
        initiative: Math.max(4, Math.round((monster.challengeRatingDecimal ?? 1) * 3) + 5),
        speed: monster.size ? `${monster.size.toLowerCase()} stride` : "30 ft",
        tags: ["Campaign", monster.challengeRating ? `CR ${monster.challengeRating}` : "Monster"],
      }),
    );

    return [...characterCandidates, ...npcCandidates, ...monsterCandidates];
  }, [charactersQuery.data, monstersQuery.data, npcsQuery.data]);

  const existingSourceIds = useMemo(
    () =>
      new Set(
        (tracker.state?.combatants ?? [])
          .map((combatant) => combatant.sourceId)
          .filter((value): value is string => value !== null),
      ),
    [tracker.state?.combatants],
  );

  if (isLoading) {
    return <LoadingScreen minHeight="60vh" />;
  }

  if (!campaignId || !campaignDetailsQuery.data || pageError) {
    return (
      <ErrorState
        message={pageError ?? "Fight tracker could not be loaded."}
        onRetry={() => {
          void campaignDetailsQuery.refetch();
          void overviewQuery.refetch();
          void charactersQuery.refetch();
          void npcsQuery.refetch();
          void monstersQuery.refetch();
          void encounterDetailsQuery.refetch();
        }}
        title="Unable to load fight tracker"
      />
    );
  }

  if (selectedEncounterId === null || encounterDetails === null || tracker.state === null) {
    return (
      <>
        <FightTrackerHub
          encounterHistory={overviewQuery.data?.history ?? []}
          onCreateEncounter={() => setIsCreateEncounterDialogOpen(true)}
          onOpenPreparedEncounter={(encounterId) => setSelectedEncounterId(encounterId)}
          preparedEncounters={overviewQuery.data?.encounters ?? []}
        />

        <FightTrackerCreateEncounterDialog
          onClose={() => setIsCreateEncounterDialogOpen(false)}
          onSubmit={(values) => {
            createEncounterMutation.mutate(
              {
                name: values.encounterName,
                environmentName: values.environmentName,
                environmentDetails: values.environmentDetails,
                combatantCount: 0,
                conditionCount: 0,
                preparationData: createEncounterState(values),
              },
              {
                onSuccess: (encounter) => {
                  setSelectedEncounterId(encounter.id);
                  setIsCreateEncounterDialogOpen(false);
                },
              },
            );
          }}
          open={isCreateEncounterDialogOpen}
        />

        <FightTrackerSummaryDialog
          onClose={() => setFinishedSummary(null)}
          open={finishedSummary !== null}
          summary={finishedSummary}
        />
      </>
    );
  }

  const headerAction = (
    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", justifyContent: { md: "flex-end" } }}>
      <Button
        color="inherit"
        onClick={() => setSelectedEncounterId(null)}
        startIcon={<Icon icon="solar:alt-arrow-left-linear" />}
        variant="outlined"
      >
        Back
      </Button>
      {!tracker.isActiveRun ? (
        <Button
          disabled={!canManage || startEncounterMutation.isPending}
          onClick={() => void startEncounterMutation.mutateAsync()}
          startIcon={<Icon icon="solar:play-bold" />}
          variant="contained"
        >
          Start combat
        </Button>
      ) : null}
      <Button
        color="inherit"
        disabled={!canManage || deleteEncounterMutation.isPending || tracker.isActiveRun}
        onClick={() => setIsDeleteEncounterDialogOpen(true)}
        startIcon={<Icon icon="solar:trash-bin-minimalistic-linear" />}
        variant="outlined"
      >
        Delete encounter
      </Button>
    </Stack>
  );

  return (
    <>
      <Stack spacing={3}>
        <FightTrackerHeader
          action={headerAction}
          combatantCount={tracker.state.combatants.length}
          globalConditionsCount={tracker.state.globalConditions.length}
          isActiveRun={tracker.isActiveRun}
          state={tracker.state}
        />

        {!canManage ? (
          <Alert severity="info">
            Only DM roles can change encounter preparation, start combat, and update the live tracker.
          </Alert>
        ) : null}

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, xl: 8 }}>
            <FightTrackerTurnOrderCard
              canManageFight={canManage && tracker.isActiveRun}
              combatants={tracker.state.combatants}
              currentCombatant={tracker.currentCombatant}
              currentIndex={tracker.state.currentIndex}
              filter="ALL"
              hasUndo={tracker.hasUndo}
              isTimerRunning={tracker.isTimerRunning}
              onAdvanceTurn={tracker.advanceTurn}
              onEndEncounter={() => setIsEndEncounterDialogOpen(true)}
              onDeckCombatant={tracker.onDeckCombatant}
              onOpenConditionDialog={() => {
                setConditionTargetCombatantId(tracker.currentCombatant?.id ?? null);
                setConditionDialogMode("combatant");
              }}
              onSelectCombatant={(combatantId) => {
                setSelectedCombatantId(combatantId);
                setIsCombatantDialogOpen(true);
              }}
              onToggleTimer={tracker.toggleTimer}
              onUndo={tracker.revertLastAction}
              timerLabel={tracker.durationLabel}
            />
          </Grid>

          <Grid size={{ xs: 12, xl: 4 }}>
            <FightTrackerControlsCard
              canManageFight={canManage}
              combatants={tracker.state.combatants}
              onOpenImportDialog={() => setIsImportDialogOpen(true)}
              onOpenQuickAddDialog={() => setIsQuickAddDialogOpen(true)}
              onQuickHpApply={tracker.applyHpAdjustment}
            />
          </Grid>

          <Grid size={{ xs: 12, xl: 7 }}>
            <FightTrackerParticipantsCard
              combatants={tracker.state.combatants}
              onAddCombatant={() => setIsQuickAddDialogOpen(true)}
              onAddCondition={(combatantId) => {
                setConditionTargetCombatantId(combatantId);
                setConditionDialogMode("combatant");
              }}
              onRemoveCombatant={tracker.removeCombatant}
              onSelectCombatant={(combatantId) => {
                setSelectedCombatantId(combatantId);
                setIsCombatantDialogOpen(true);
              }}
              onUpdateInitiative={tracker.updateInitiative}
            />
          </Grid>

          <Grid size={{ xs: 12, xl: 5 }}>
            <FightTrackerConditionsCard
              combatants={tracker.state.combatants}
              globalConditions={tracker.state.globalConditions}
              onAddCombatantCondition={() => setConditionDialogMode("combatant")}
              onAddGlobalCondition={() => setConditionDialogMode("global")}
              onRemoveCombatantCondition={(combatantId, conditionId) =>
                tracker.removeCondition(conditionId, combatantId)
              }
              onRemoveGlobalCondition={(conditionId) => tracker.removeCondition(conditionId)}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FightTrackerLogCard log={tracker.state.log} />
          </Grid>
        </Grid>
      </Stack>

      <FightTrackerQuickAddDialog
        onClose={() => setIsQuickAddDialogOpen(false)}
        onSubmit={(values: QuickAddCombatantValues) => {
          tracker.addQuickCombatant(values);
          setIsQuickAddDialogOpen(false);
        }}
        open={isQuickAddDialogOpen}
      />

      <FightTrackerImportDialog
        candidates={importCandidates}
        existingSourceIds={existingSourceIds}
        onAddCombatant={(combatant) => tracker.addCombatant(combatant)}
        onClose={() => setIsImportDialogOpen(false)}
        open={isImportDialogOpen}
      />

      <FightTrackerConditionDialog
        combatants={tracker.state.combatants}
        initialTargetCombatantId={conditionTargetCombatantId}
        mode={conditionDialogMode ?? "combatant"}
        onClose={() => {
          setConditionDialogMode(null);
          setConditionTargetCombatantId(null);
        }}
        onSubmit={(values: FightConditionFormValues) => {
          tracker.addCondition(values);
          setConditionDialogMode(null);
          setConditionTargetCombatantId(null);
        }}
        open={conditionDialogMode !== null}
      />

      <FightTrackerCombatantDialog
        combatant={selectedCombatant}
        onClose={() => setIsCombatantDialogOpen(false)}
        open={isCombatantDialogOpen}
      />

      <FightTrackerEndEncounterDialog
        encounterName={tracker.state.encounterName}
        onClose={() => setIsEndEncounterDialogOpen(false)}
        onConfirm={() => {
          setIsEndEncounterDialogOpen(false);
          tracker.finishEncounter();
        }}
        open={isEndEncounterDialogOpen}
      />

      <FightTrackerDeleteEncounterDialog
        encounterName={tracker.state?.encounterName ?? encounterDetails.name}
        onClose={() => setIsDeleteEncounterDialogOpen(false)}
        onConfirm={() => {
          deleteEncounterMutation.mutate(encounterDetails.id, {
            onSuccess: () => {
              setIsDeleteEncounterDialogOpen(false);
              setSelectedEncounterId(null);
            },
          });
        }}
        open={isDeleteEncounterDialogOpen}
      />

      <FightTrackerCreateEncounterDialog
        onClose={() => setIsCreateEncounterDialogOpen(false)}
        onSubmit={(values) => {
          createEncounterMutation.mutate(
            {
              name: values.encounterName,
              environmentName: values.environmentName,
              environmentDetails: values.environmentDetails,
              combatantCount: 0,
              conditionCount: 0,
              preparationData: createEncounterState(values),
            },
            {
              onSuccess: (encounter) => {
                setSelectedEncounterId(encounter.id);
                setIsCreateEncounterDialogOpen(false);
              },
            },
          );
        }}
        open={isCreateEncounterDialogOpen}
      />

      <FightTrackerSummaryDialog
        onClose={() => setFinishedSummary(null)}
        open={finishedSummary !== null}
        summary={finishedSummary}
      />
    </>
  );
}
