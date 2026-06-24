import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { CampaignMonsterDetails } from "@/features/monsters/model/monster.types";
import { monsterSizeOptions, monsterVisibilityOptions } from "@/features/monsters/model/monster.types";

const monsterFormSchema = z.object({
  alignment: z.string().max(120).optional(),
  armorClass: z.number().min(1).max(99).nullable().optional(),
  challengeRating: z.string().max(32).optional(),
  description: z.string().max(10000).optional(),
  hitPoints: z.number().min(0).max(9999).nullable().optional(),
  name: z.string().trim().min(1, "Monster name is required.").max(200),
  size: z.enum(["TINY", "SMALL", "MEDIUM", "LARGE", "HUGE", "GARGANTUAN", "UNKNOWN"]).nullable().optional(),
  type: z.string().max(120).optional(),
  visibility: z.enum(["PUBLIC", "GM_ONLY"]),
});

export type MonsterFormValues = z.infer<typeof monsterFormSchema>;

type MonsterFormDialogProps = {
  initialMonster?: CampaignMonsterDetails | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: MonsterFormValues) => Promise<void>;
  open: boolean;
};

function toOptionalValue(value?: string | null): string {
  return value ?? "";
}

function toOptionalNumber(value?: number | null): number | null | undefined {
  return value ?? null;
}

export function MonsterFormDialog({
  initialMonster,
  isSubmitting,
  onClose,
  onSubmit,
  open,
}: MonsterFormDialogProps) {
  const { handleSubmit, register, reset } = useForm<MonsterFormValues>({
    defaultValues: {
      alignment: toOptionalValue(initialMonster?.alignment),
      armorClass: toOptionalNumber(initialMonster?.armorClass),
      challengeRating: toOptionalValue(initialMonster?.challengeRating),
      description: toOptionalValue(initialMonster?.description),
      hitPoints: toOptionalNumber(initialMonster?.hitPoints),
      name: initialMonster?.name ?? "",
      size: (initialMonster?.size as MonsterFormValues["size"] | undefined) ?? null,
      type: toOptionalValue(initialMonster?.type),
      visibility: (initialMonster?.visibility as MonsterFormValues["visibility"] | undefined) ?? "GM_ONLY",
    },
    resolver: zodResolver(monsterFormSchema),
  });

  useEffect(() => {
    reset({
      alignment: toOptionalValue(initialMonster?.alignment),
      armorClass: toOptionalNumber(initialMonster?.armorClass),
      challengeRating: toOptionalValue(initialMonster?.challengeRating),
      description: toOptionalValue(initialMonster?.description),
      hitPoints: toOptionalNumber(initialMonster?.hitPoints),
      name: initialMonster?.name ?? "",
      size: (initialMonster?.size as MonsterFormValues["size"] | undefined) ?? null,
      type: toOptionalValue(initialMonster?.type),
      visibility: (initialMonster?.visibility as MonsterFormValues["visibility"] | undefined) ?? "GM_ONLY",
    });
  }, [initialMonster, reset]);

  const handleValidSubmit = handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <Dialog fullWidth maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle>{initialMonster ? "Edit monster" : "Create custom monster"}</DialogTitle>
      <DialogContent dividers>
        <Stack component="form" noValidate onSubmit={handleValidSubmit} spacing={2.5}>
          <TextField label="Name" {...register("name")} />
          <TextField label="Description" minRows={3} multiline {...register("description")} />
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField select label="Size" {...register("size")}>
              <MenuItem value="">No size</MenuItem>
              {monsterSizeOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField label="Type" {...register("type")} />
            <TextField label="Alignment" {...register("alignment")} />
          </Stack>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="Armor class"
              type="number"
              {...register("armorClass", { setValueAs: (value) => (value === "" ? null : Number(value)) })}
            />
            <TextField
              label="Hit points"
              type="number"
              {...register("hitPoints", { setValueAs: (value) => (value === "" ? null : Number(value)) })}
            />
            <TextField label="Challenge rating" {...register("challengeRating")} />
          </Stack>
          <TextField select label="Visibility" {...register("visibility")}>
            {monsterVisibilityOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option.replace("_", " ")}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button disabled={isSubmitting} onClick={() => void handleValidSubmit()} variant="contained">
          {isSubmitting ? <CircularProgress color="inherit" size={20} /> : initialMonster ? "Save changes" : "Create monster"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
