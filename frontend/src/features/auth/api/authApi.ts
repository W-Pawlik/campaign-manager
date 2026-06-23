import { apiEndpoints } from "@/core/api/endpoints";
import { authHttpClient, httpClient } from "@/core/api/httpClient";
import type {
  AuthTokensResponse,
  CurrentUser,
  LoginPayload,
  RegisterPayload,
} from "@/features/auth/model/auth.types";

export const authApi = {
  async getCurrentUser(): Promise<CurrentUser> {
    const response = await httpClient.get<CurrentUser>(apiEndpoints.auth.currentUser);

    return response.data;
  },

  async login(payload: LoginPayload): Promise<AuthTokensResponse> {
    const response = await authHttpClient.post<AuthTokensResponse>(apiEndpoints.auth.login, payload);

    return response.data;
  },

  async logout(): Promise<void> {
    await authHttpClient.post(apiEndpoints.auth.logout);
  },

  async refreshSession(): Promise<AuthTokensResponse> {
    const response = await authHttpClient.post<AuthTokensResponse>(apiEndpoints.auth.refreshToken);

    return response.data;
  },

  async register(payload: RegisterPayload): Promise<AuthTokensResponse> {
    const response = await authHttpClient.post<AuthTokensResponse>(
      apiEndpoints.auth.register,
      payload,
    );

    return response.data;
  },
};
