export type AuthStatus = "anonymous" | "authenticated" | "bootstrapping";

export type AuthOperationStatus = "idle" | "submitting";

export type CurrentUser = {
  id: string;
  email: string;
  username: string;
  avatarUrl: string | null;
  createdAt: string;
};

export type AuthTokensResponse = {
  accessToken: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
};

export type AuthState = {
  currentUser: CurrentUser | null;
  errorMessage: string | null;
  operationStatus: AuthOperationStatus;
  status: AuthStatus;
};
