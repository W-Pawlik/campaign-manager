export const authViewModes = {
  login: "login",
  register: "register",
} as const;

export type AuthViewMode = (typeof authViewModes)[keyof typeof authViewModes];
