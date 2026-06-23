import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { campaignsQueryKeys } from "@/features/campaigns";
import { charactersApi } from "@/features/characters/api/charactersApi";
import type {
  CreateCharacterPayload,
  UpdateCharacterPayload,
} from "@/features/characters/model/character.types";

export const charactersQueryKeys = {
  all: ["characters"] as const,
  details: (campaignId: string, characterId: string) =>
    [...charactersQueryKeys.all, campaignId, characterId] as const,
  list: (campaignId: string) => [...charactersQueryKeys.all, campaignId, "list"] as const,
};

function invalidateCharacterQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  campaignId: string,
  characterId?: string,
) {
  queryClient.invalidateQueries({ queryKey: charactersQueryKeys.list(campaignId) });
  queryClient.invalidateQueries({ queryKey: campaignsQueryKeys.characters(campaignId) });
  queryClient.invalidateQueries({ queryKey: campaignsQueryKeys.details(campaignId) });

  if (characterId) {
    queryClient.invalidateQueries({ queryKey: charactersQueryKeys.details(campaignId, characterId) });
  }
}

export function useCampaignCharactersQuery(campaignId: string | undefined) {
  return useQuery({
    enabled: Boolean(campaignId),
    queryFn: () => charactersApi.listCampaignCharacters(campaignId!),
    queryKey: charactersQueryKeys.list(campaignId ?? "missing"),
  });
}

export function useCharacterDetailsQuery(campaignId: string | undefined, characterId: string | null) {
  return useQuery({
    enabled: Boolean(campaignId && characterId),
    queryFn: () => charactersApi.getCharacterDetails(campaignId!, characterId!),
    queryKey: charactersQueryKeys.details(campaignId ?? "missing", characterId ?? "missing"),
  });
}

export function useCreateCharacterMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCharacterPayload) => charactersApi.createCharacter(campaignId!, payload),
    onSuccess: (character) => {
      if (campaignId) {
        invalidateCharacterQueries(queryClient, campaignId, character.id);
        queryClient.setQueryData(charactersQueryKeys.details(campaignId, character.id), character);
      }
    },
  });
}

export function useUpdateCharacterMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { characterId: string; payload: UpdateCharacterPayload }) =>
      charactersApi.updateCharacter(campaignId!, input.characterId, input.payload),
    onSuccess: (character) => {
      if (campaignId) {
        invalidateCharacterQueries(queryClient, campaignId, character.id);
        queryClient.setQueryData(charactersQueryKeys.details(campaignId, character.id), character);
      }
    },
  });
}

export function useArchiveCharacterMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (characterId: string) => charactersApi.archiveCharacter(campaignId!, characterId),
    onSuccess: (_data, characterId) => {
      if (campaignId) {
        invalidateCharacterQueries(queryClient, campaignId, characterId);
      }
    },
  });
}

export function useDeleteCharacterMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (characterId: string) => charactersApi.deleteCharacter(campaignId!, characterId),
    onSuccess: (_data, characterId) => {
      if (campaignId) {
        invalidateCharacterQueries(queryClient, campaignId, characterId);
      }
    },
  });
}
