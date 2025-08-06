import { combineReducers, configureStore } from "@reduxjs/toolkit";

import authReducer from "./slice/auth.slice";
import feedbackReducer from "./slice/feedback.slice";
import searchUserReducer from "./slice/user.slice";

import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
  blacklist: ["feedback"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  feedback: feedbackReducer,
  searchUser: searchUserReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware(getDefaultMiddleware) {
      return getDefaultMiddleware({
        serializableCheck: false,
      });
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
