import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import GlobalSlice from "./slices/GlobalSlice";
import LlamadoFilterSlice from "./slices/LlamadoFilterSlice";

const store = configureStore({
  reducer: {
    GlobalSlice,
    LlamadoFilterSlice
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;

export default store;
