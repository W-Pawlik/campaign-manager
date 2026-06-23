import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { CampaignCharacterDetails } from "@/features/characters/model/character.types";
import { CharacterAbilityFields } from "@/features/characters/ui/CharacterAbilityFields";
import { CharacterIdentityFields } from "@/features/characters/ui/CharacterIdentityFields";
import { CharacterNarrativeFields } from "@/features/characters/ui/CharacterNarrativeFields";
import type { CharacterFormValues } from "@/features/characters/ui/characterForm.types";

const characterFormSchema = z.object({
  alignment: z.string().max(80).optional(),
  appearance: z.string().max(10000).optional(),
  armorClass: z.number().min(0).max(99).nullable().optional(),
  avatarUrl: z.string().trim().url("Enter a valid URL.").or(z.literal("")).optional(),
  background: z.string().max(255).optional(),
  backstory: z.string().max(10000).optional(),
  bonds: z.string().max(10000).optional(),
  characterClass: z.string().max(120).optional(),
  charisma: z.number().min(1).max(30).nullable().optional(),
  constitution: z.number().min(1).max(30).nullable().optional(),
  currentHitPoints: z.number().min(0).max(999).nullable().optional(),
  dexterity: z.number().min(1).max(30).nullable().optional(),
  flaws: z.string().max(10000).optional(),
  ideals: z.string().max(10000).optional(),
  intelligence: z.number().min(1).max(30).nullable().optional(),
  level: z.number().min(1).max(30).nullable().optional(),
  maxHitPoints: z.number().min(0).max(999).nullable().optional(),
  name: z.string().trim().min(1, "Character name is required.").max(120),
  ownerUserId: z.string().optional(),
  personalityTraits: z.string().max(10000).optional(),
  race: z.string().max(120).optional(),
  status: z.enum(["DRAFT", "ACTIVE", "INACTIVE", "DEAD", "RETIRED", "ARCHIVED"]),
  strength: z.number().min(1).max(30).nullable().optional(),
  subclass: z.string().max(120).optional(),
  type: z.enum(["PLAYER_CHARACTER", "COMPANION", "TEMPORARY"]),
  wisdom: z.number().min(1).max(30).nullable().optional(),
});

type CharacterFormDialogProps = {
  canAssignOwner: boolean;
  initialCharacter?: CampaignCharacterDetails | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: CharacterFormValues) => Promise<void>;
  open: boolean;
};

function toOptionalValue(value?: string | null): string {
  return value ?? "";
}

function toOptionalNumber(value?: number | null): number | null | undefined {
  return value ?? null;
}

export function CharacterFormDialog({
  canAssignOwner,
  initialCharacter,
  isSubmitting,
  onClose,
  onSubmit,
  open,
}: CharacterFormDialogProps) {
  const {
    handleSubmit,
    register,
    reset,
  } = useForm<CharacterFormValues>({
    defaultValues: {
      alignment: toOptionalValue(initialCharacter?.alignment),
      appearance: toOptionalValue(initialCharacter?.appearance),
      armorClass: toOptionalNumber(initialCharacter?.armorClass),
      avatarUrl: toOptionalValue(initialCharacter?.avatarUrl),
      background: toOptionalValue(initialCharacter?.background),
      backstory: toOptionalValue(initialCharacter?.backstory),
      bonds: toOptionalValue(initialCharacter?.bonds),
      characterClass: toOptionalValue(initialCharacter?.characterClass),
      charisma: toOptionalNumber(initialCharacter?.charisma),
      constitution: toOptionalNumber(initialCharacter?.constitution),
      currentHitPoints: toOptionalNumber(initialCharacter?.currentHitPoints),
      dexterity: toOptionalNumber(initialCharacter?.dexterity),
      flaws: toOptionalValue(initialCharacter?.flaws),
      ideals: toOptionalValue(initialCharacter?.ideals),
      intelligence: toOptionalNumber(initialCharacter?.intelligence),
      level: toOptionalNumber(initialCharacter?.level),
      maxHitPoints: toOptionalNumber(initialCharacter?.maxHitPoints),
      name: initialCharacter?.name ?? "",
      ownerUserId: initialCharacter?.ownerUserId ?? "",
      personalityTraits: toOptionalValue(initialCharacter?.personalityTraits),
      race: toOptionalValue(initialCharacter?.race),
      status: (initialCharacter?.status as CharacterFormValues["status"] | undefined) ?? "DRAFT",
      strength: toOptionalNumber(initialCharacter?.strength),
      subclass: toOptionalValue(initialCharacter?.subclass),
      type: (initialCharacter?.type as CharacterFormValues["type"] | undefined) ?? "PLAYER_CHARACTER",
      wisdom: toOptionalNumber(initialCharacter?.wisdom),
    },
    resolver: zodResolver(characterFormSchema),
  });

  useEffect(() => {
    reset({
      alignment: toOptionalValue(initialCharacter?.alignment),
      appearance: toOptionalValue(initialCharacter?.appearance),
      armorClass: toOptionalNumber(initialCharacter?.armorClass),
      avatarUrl: toOptionalValue(initialCharacter?.avatarUrl),
      background: toOptionalValue(initialCharacter?.background),
      backstory: toOptionalValue(initialCharacter?.backstory),
      bonds: toOptionalValue(initialCharacter?.bonds),
      characterClass: toOptionalValue(initialCharacter?.characterClass),
      charisma: toOptionalNumber(initialCharacter?.charisma),
      constitution: toOptionalNumber(initialCharacter?.constitution),
      currentHitPoints: toOptionalNumber(initialCharacter?.currentHitPoints),
      dexterity: toOptionalNumber(initialCharacter?.dexterity),
      flaws: toOptionalValue(initialCharacter?.flaws),
      ideals: toOptionalValue(initialCharacter?.ideals),
      intelligence: toOptionalNumber(initialCharacter?.intelligence),
      level: toOptionalNumber(initialCharacter?.level),
      maxHitPoints: toOptionalNumber(initialCharacter?.maxHitPoints),
      name: initialCharacter?.name ?? "",
      ownerUserId: initialCharacter?.ownerUserId ?? "",
      personalityTraits: toOptionalValue(initialCharacter?.personalityTraits),
      race: toOptionalValue(initialCharacter?.race),
      status: (initialCharacter?.status as CharacterFormValues["status"] | undefined) ?? "DRAFT",
      strength: toOptionalNumber(initialCharacter?.strength),
      subclass: toOptionalValue(initialCharacter?.subclass),
      type: (initialCharacter?.type as CharacterFormValues["type"] | undefined) ?? "PLAYER_CHARACTER",
      wisdom: toOptionalNumber(initialCharacter?.wisdom),
    });
  }, [initialCharacter, reset]);

  const handleValidSubmit = handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <Dialog fullWidth maxWidth="lg" onClose={onClose} open={open}>
      <DialogTitle>{initialCharacter ? "Edit character" : "Create character"}</DialogTitle>
      <DialogContent dividers>
        <Stack component="form" noValidate onSubmit={handleValidSubmit} spacing={3}>
          <Stack spacing={1}>
            <Typography variant="subtitle1">Identity</Typography>
            <CharacterIdentityFields canAssignOwner={canAssignOwner} register={register} />
          </Stack>
          <Stack spacing={1}>
            <Typography variant="subtitle1">Core stats</Typography>
            <CharacterAbilityFields register={register} />
          </Stack>
          <Stack spacing={1}>
            <Typography variant="subtitle1">Narrative</Typography>
            <CharacterNarrativeFields register={register} />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button disabled={isSubmitting} onClick={() => void handleValidSubmit()} variant="contained">
          {isSubmitting ? <CircularProgress color="inherit" size={20} /> : initialCharacter ? "Save changes" : "Create character"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
