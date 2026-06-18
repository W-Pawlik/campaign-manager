import { combineReducers } from "@reduxjs/toolkit";

import { uiReducer } from "@/app/store/slices/uiSlice";

export const rootReducer = combineReducers({
  ui: uiReducer,
});
