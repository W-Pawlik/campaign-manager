import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Icon } from "@iconify/react";

import MonsterCardBackground from "@/assets/MonsterCardBackground.png";
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
  ownerUserId: z
    .string()
    .trim()
    .uuid("Owner must currently be provided as a valid user ID.")
    .or(z.literal(""))
    .optional(),
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
  submitError?: string | null;
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
  submitError = null,
}: CharacterFormDialogProps) {
  const {
    formState: { errors },
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
      type:
        (initialCharacter?.type as CharacterFormValues["type"] | undefined) ?? "PLAYER_CHARACTER",
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
      type:
        (initialCharacter?.type as CharacterFormValues["type"] | undefined) ?? "PLAYER_CHARACTER",
      wisdom: toOptionalNumber(initialCharacter?.wisdom),
    });
  }, [initialCharacter, reset]);

  const handleValidSubmit = handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      onClose={onClose}
      open={open}
      slotProps={{
        paper: {
          sx: {
            backgroundImage: `linear-gradient(180deg, rgba(250, 244, 232, 0.94) 0%, rgba(239, 227, 201, 0.96) 100%), url(${MonsterCardBackground})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            border: "1px solid rgba(93, 69, 42, 0.52)",
            borderRadius: 3,
            color: "#2d2115",
            overflow: "hidden",
          },
        },
      }}
    >
      <DialogContent
        sx={{
          p: { xs: 2, md: 3 },
          position: "relative",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            color: "#4d3923",
            position: "absolute",
            right: 12,
            top: 12,
            zIndex: 2,
          }}
        >
          <Icon icon="solar:close-circle-linear" style={{ fontSize: 28 }} />
        </IconButton>

        <Stack component="form" noValidate onSubmit={handleValidSubmit} spacing={3}>
          <Stack spacing={0.6}>
            <Typography
              sx={{
                color: "#2f2217",
                fontFamily: '"Georgia", "Times New Roman", serif',
                fontSize: { xs: "2rem", md: "2.6rem" },
                lineHeight: 1,
              }}
            >
              {initialCharacter ? "Edit character" : "Create character"}
            </Typography>
            <Typography color="#5c452a" variant="body2">
              Build the character sheet, core stats, and narrative notes in one place.
            </Typography>
          </Stack>

          {submitError ? <Alert severity="error">{submitError}</Alert> : null}
          <Stack spacing={1}>
            <Typography variant="subtitle1">Identity</Typography>
            <CharacterIdentityFields
              canAssignOwner={canAssignOwner}
              ownerErrorMessage={errors.ownerUserId?.message}
              register={register}
            />
          </Stack>
          <Stack spacing={1}>
            <Typography variant="subtitle1">Core stats</Typography>
            <CharacterAbilityFields register={register} />
          </Stack>
          <Stack spacing={1}>
            <Typography variant="subtitle1">Narrative</Typography>
            <CharacterNarrativeFields register={register} />
          </Stack>

          <Stack
            direction={{ xs: "column-reverse", sm: "row" }}
            spacing={1.5}
            sx={{ justifyContent: "space-between", pt: 1 }}
          >
            <Box />
            <Button
              disabled={isSubmitting}
              onClick={() => void handleValidSubmit()}
              variant="contained"
            >
              {isSubmitting ? (
                <CircularProgress color="inherit" size={20} />
              ) : initialCharacter ? (
                "Save changes"
              ) : (
                "Create character"
              )}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
