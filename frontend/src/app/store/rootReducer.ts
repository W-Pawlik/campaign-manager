import { combineReducers } from "@reduxjs/toolkit";

import { uiReducer } from "@/app/store/slices/uiSlice";
import { workspaceReducer } from "@/app/store/slices/workspaceSlice";
import { authReducer } from "@/features/auth";

export const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  workspace: workspaceReducer,
});
