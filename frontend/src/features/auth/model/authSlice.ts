import { createSlice } from "@reduxjs/toolkit";

import { bootstrapAuth, login, logout, register } from "@/features/auth/model/authThunks";
import type { AuthState } from "@/features/auth/model/auth.types";

const initialState: AuthState = {
  currentUser: null,
  errorMessage: null,
  operationStatus: "idle",
  status: "bootstrapping",
};

const sessionExpiredMessage = "Session expired. Log in again to continue.";

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthFeedback(state) {
      state.errorMessage = null;
      state.operationStatus = "idle";
    },
    sessionCleared(state) {
      state.currentUser = null;
      state.errorMessage = sessionExpiredMessage;
      state.operationStatus = "idle";
      state.status = "anonymous";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapAuth.pending, (state) => {
        state.errorMessage = null;
        state.status = "bootstrapping";
      })
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.errorMessage = null;
        state.operationStatus = "idle";
        state.status = "authenticated";
      })
      .addCase(bootstrapAuth.rejected, (state) => {
        state.currentUser = null;
        state.errorMessage = null;
        state.operationStatus = "idle";
        state.status = "anonymous";
      })
      .addCase(login.pending, (state) => {
        state.errorMessage = null;
        state.operationStatus = "submitting";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.errorMessage = null;
        state.operationStatus = "idle";
        state.status = "authenticated";
      })
      .addCase(login.rejected, (state, action) => {
        state.currentUser = null;
        state.errorMessage = action.payload ?? "Unable to log in.";
        state.operationStatus = "idle";
        state.status = "anonymous";
      })
      .addCase(register.pending, (state) => {
        state.errorMessage = null;
        state.operationStatus = "submitting";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.errorMessage = null;
        state.operationStatus = "idle";
        state.status = "authenticated";
      })
      .addCase(register.rejected, (state, action) => {
        state.currentUser = null;
        state.errorMessage = action.payload ?? "Unable to register.";
        state.operationStatus = "idle";
        state.status = "anonymous";
      })
      .addCase(logout.pending, (state) => {
        state.operationStatus = "submitting";
      })
      .addCase(logout.fulfilled, (state) => {
        state.currentUser = null;
        state.errorMessage = null;
        state.operationStatus = "idle";
        state.status = "anonymous";
      });
  },
});

export const { clearAuthFeedback, sessionCleared } = authSlice.actions;
export const authReducer = authSlice.reducer;
