import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type WorkspaceState = {
  lastActiveCampaignId: string | null;
};

const initialState: WorkspaceState = {
  lastActiveCampaignId: null,
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    hydrateLastActiveCampaignId(state, action: PayloadAction<string | null>) {
      state.lastActiveCampaignId = action.payload;
    },
    setLastActiveCampaignId(state, action: PayloadAction<string>) {
      state.lastActiveCampaignId = action.payload;
    },
    clearLastActiveCampaignId(state) {
      state.lastActiveCampaignId = null;
    },
  },
});

export const {
  clearLastActiveCampaignId,
  hydrateLastActiveCampaignId,
  setLastActiveCampaignId,
} = workspaceSlice.actions;
export const workspaceReducer = workspaceSlice.reducer;
