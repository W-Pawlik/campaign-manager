export const USERS_TYPES = {
  UserRepository: Symbol.for("users.UserRepository"),
  UserProfileRepository: Symbol.for("users.UserProfileRepository"),
  UserMapper: Symbol.for("users.UserMapper"),
  UserProfileMapper: Symbol.for("users.UserProfileMapper"),
  UserCampaignOwnershipChecker: Symbol.for("users.UserCampaignOwnershipChecker"),
  GetCurrentUserProfileHandler: Symbol.for("users.GetCurrentUserProfileHandler"),
  SearchUsersHandler: Symbol.for("users.SearchUsersHandler"),
  UpdateCurrentUserProfileHandler: Symbol.for("users.UpdateCurrentUserProfileHandler"),
  ChangeCurrentUserPasswordHandler: Symbol.for("users.ChangeCurrentUserPasswordHandler"),
  DeleteCurrentUserAccountHandler: Symbol.for("users.DeleteCurrentUserAccountHandler"),
} as const;
