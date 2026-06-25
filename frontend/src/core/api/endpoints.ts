export const apiEndpoints = {
  auth: {
    currentUser: "/auth/me",
    login: "/auth/login",
    logout: "/auth/logout",
    refreshToken: "/auth/refresh-token",
    register: "/auth/register",
  },
  campaigns: {
    base: "/campaigns",
  },
  users: {
    current: "/users/me",
    password: "/users/me/password",
    search: "/users/search",
  },
} as const;
