import { configureStore, combineReducers } from "@reduxjs/toolkit";
import apiSlices from "./apiSlices";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import authReducer from "./slices/authSices";
import postReducer from "./slices/postSlices";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// ! nanti kasih typenya
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  [apiSlices.reducerPath]: apiSlices.reducer,
  auth: persistReducer(persistConfig, authReducer), // ! persist auth saja
  post: postReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlices.middleware);
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
setupListeners(store.dispatch);

export const persistor = persistStore(store);
export default store;
