import { createAsyncThunk } from "@reduxjs/toolkit";

import { normalizeApiError } from "@/core/api/apiError";
import { clearAccessToken, setAccessToken } from "@/core/auth/authSession";
import { authApi } from "@/features/auth/api/authApi";
import type { CurrentUser, LoginPayload, RegisterPayload } from "@/features/auth/model/auth.types";

async function resolveAuthenticatedUser(accessToken: string): Promise<CurrentUser> {
  setAccessToken(accessToken);

  return authApi.getCurrentUser();
}

function getErrorMessage(error: unknown): string {
  return normalizeApiError(error).message;
}

export const bootstrapAuth = createAsyncThunk<CurrentUser, void, { rejectValue: string }>(
  "auth/bootstrap",
  async (_, { rejectWithValue }) => {
    try {
      const { accessToken } = await authApi.refreshSession();

      return await resolveAuthenticatedUser(accessToken);
    } catch (error) {
      clearAccessToken();

      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const login = createAsyncThunk<CurrentUser, LoginPayload, { rejectValue: string }>(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const { accessToken } = await authApi.login(payload);

      return await resolveAuthenticatedUser(accessToken);
    } catch (error) {
      clearAccessToken();

      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const register = createAsyncThunk<CurrentUser, RegisterPayload, { rejectValue: string }>(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const { accessToken } = await authApi.register(payload);

      return await resolveAuthenticatedUser(accessToken);
    } catch (error) {
      clearAccessToken();

      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await authApi.logout();
  } finally {
    clearAccessToken();
  }
});
