import { describe, expect, it } from "vitest";

import { authReducer, sessionCleared } from "@/features/auth/model/authSlice";
import { bootstrapAuth, login, logout } from "@/features/auth/model/authThunks";
import type { CurrentUser } from "@/features/auth/model/auth.types";

const currentUser: CurrentUser = {
  avatarUrl: null,
  createdAt: "2026-06-23T10:00:00.000Z",
  email: "gm@example.com",
  id: "user-1",
  username: "gm_master",
};

describe("authSlice", () => {
  it("transitions to authenticated after a successful bootstrap", () => {
    const state = authReducer(
      undefined,
      bootstrapAuth.fulfilled(currentUser, "request-1", undefined),
    );

    expect(state.status).toBe("authenticated");
    expect(state.currentUser).toEqual(currentUser);
    expect(state.errorMessage).toBeNull();
  });

  it("stores API validation errors after a failed login", () => {
    const state = authReducer(
      undefined,
      login.rejected(new Error("Unauthorized"), "request-1", { email: "", password: "" }, "Invalid email or password"),
    );

    expect(state.status).toBe("anonymous");
    expect(state.errorMessage).toBe("Invalid email or password");
  });

  it("clears the authenticated session on logout and on session expiration", () => {
    const authenticatedState = authReducer(
      undefined,
      login.fulfilled(currentUser, "request-1", {
        email: currentUser.email,
        password: "password123",
      }),
    );

    const loggedOutState = authReducer(authenticatedState, logout.fulfilled(undefined, "request-2", undefined));
    const expiredState = authReducer(authenticatedState, sessionCleared());

    expect(loggedOutState.status).toBe("anonymous");
    expect(loggedOutState.currentUser).toBeNull();
    expect(expiredState.errorMessage).toBe("Session expired. Log in again to continue.");
  });
});
