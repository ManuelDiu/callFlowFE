import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import GlobalSlice from "./slices/GlobalSlice";

const store = configureStore({
  reducer: {
    GlobalSlice,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;

export default store;
