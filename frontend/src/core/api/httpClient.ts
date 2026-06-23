import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

import { env } from "@/app/config/env";
import { apiEndpoints } from "@/core/api/endpoints";
import { normalizeApiError } from "@/core/api/apiError";
import { clearAuthSession, getAccessToken, setAccessToken } from "@/core/auth/authSession";

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type RefreshTokenResponse = {
  accessToken: string;
};

const nonRefreshablePaths = new Set<string>([
  apiEndpoints.auth.login,
  apiEndpoints.auth.logout,
  apiEndpoints.auth.refreshToken,
  apiEndpoints.auth.register,
]);

let refreshAccessTokenPromise: Promise<string> | null = null;

function createHttpClient(): AxiosInstance {
  return axios.create({
    baseURL: env.apiBaseUrl,
    timeout: 15_000,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function shouldAttemptRefresh(requestUrl?: string): boolean {
  if (!requestUrl) {
    return false;
  }

  return !nonRefreshablePaths.has(requestUrl);
}

function attachAuthorizationHeader(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const accessToken = getAccessToken();

  if (!accessToken) {
    return config;
  }

  config.headers.set("Authorization", `Bearer ${accessToken}`);

  return config;
}

async function refreshAccessToken(): Promise<string> {
  if (!refreshAccessTokenPromise) {
    refreshAccessTokenPromise = authHttpClient
      .post<RefreshTokenResponse>(apiEndpoints.auth.refreshToken)
      .then((response) => {
        const nextAccessToken = response.data.accessToken;

        setAccessToken(nextAccessToken);

        return nextAccessToken;
      })
      .finally(() => {
        refreshAccessTokenPromise = null;
      });
  }

  return refreshAccessTokenPromise;
}

export const authHttpClient = createHttpClient();

export const httpClient = createHttpClient();

httpClient.interceptors.request.use(attachAuthorizationHeader);

httpClient.interceptors.response.use(undefined, async (error: unknown) => {
  if (!(error instanceof AxiosError)) {
    return Promise.reject(normalizeApiError(error));
  }

  const requestConfig = error.config as RetriableRequestConfig | undefined;

  if (
    error.response?.status === 401 &&
    requestConfig &&
    !requestConfig._retry &&
    shouldAttemptRefresh(requestConfig.url)
  ) {
    requestConfig._retry = true;

    try {
      const nextAccessToken = await refreshAccessToken();

      requestConfig.headers.set("Authorization", `Bearer ${nextAccessToken}`);

      return httpClient(requestConfig);
    } catch (refreshError) {
      clearAuthSession();

      return Promise.reject(normalizeApiError(refreshError));
    }
  }

  return Promise.reject(normalizeApiError(error));
});
