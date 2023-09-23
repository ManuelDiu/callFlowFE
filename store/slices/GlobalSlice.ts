import { createSlice } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { handleGetToken, handleStorageToken } from "utils/userUtils";

const initialState: {
  userInfo: any;
  isLoading: boolean,
  token: string | undefined,
  loading: boolean,
} = {
  userInfo: null,
  isLoading: false,
  token: handleGetToken() || "",
  loading: false,
};

export const GlobalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setUserInfo(state, { payload }) {
      state.userInfo = payload;
    },
    setIsLoading(state, { payload }) {
      state.isLoading = payload;
    },
    setToken(state, { payload }) {
      state.token = payload;
    },
    setLoading(state, {payload}) {
      state.loading = payload;
    }
  },
  extraReducers: {},
});

export const useGlobalActions = () => {
  const dispatch = useDispatch();

  const handleSetUserInfo = (userInfo: any) => {
    dispatch(GlobalSlice.actions.setUserInfo(userInfo));
  };

  const handleSetLoading = (isLoading: boolean) => {
    dispatch(GlobalSlice.actions.setIsLoading(isLoading));
  };

  const handleSetToken = (token: string) => {
    handleStorageToken(token);
    dispatch(GlobalSlice.actions.setToken(token));
  };

  const handleSetLoading = (loading: boolean) => {
    dispatch(GlobalSlice.actions.setLoading(loading));
  };

  return {
    handleSetUserInfo,
    handleSetLoading,
    handleSetToken,
    handleSetLoading,
  };
};

export default GlobalSlice.reducer;
