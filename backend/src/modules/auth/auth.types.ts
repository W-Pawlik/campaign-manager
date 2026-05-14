export const AUTH_TYPES = {
  AuthRepository: Symbol.for("auth.AuthRepository"),
  UserSessionRepository: Symbol.for("auth.UserSessionRepository"),
  PasswordHasher: Symbol.for("auth.PasswordHasher"),
  TokenService: Symbol.for("auth.TokenService"),
  AuthTokensIssuer: Symbol.for("auth.AuthTokensIssuer"),
  RegisterUserHandler: Symbol.for("auth.RegisterUserHandler"),
  LoginUserHandler: Symbol.for("auth.LoginUserHandler"),
  RefreshTokenHandler: Symbol.for("auth.RefreshTokenHandler"),
  LogoutHandler: Symbol.for("auth.LogoutHandler"),
  GetCurrentUserHandler: Symbol.for("auth.GetCurrentUserHandler"),
} as const;
