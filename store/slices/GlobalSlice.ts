import { createSlice } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { handleGetToken, handleStorageToken } from "utils/userUtils";

const initialState: {
  userInfo: any;
  token: string | undefined,
  loading: boolean,
} = {
  userInfo: null,
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

  const handleSetToken = (token: string) => {
    handleStorageToken(token);
    dispatch(GlobalSlice.actions.setToken(token));
  };

  const handleSetLoading = (loading: boolean) => {
    dispatch(GlobalSlice.actions.setLoading(loading));
  };

  return {
    handleSetUserInfo,
    handleSetToken,
    handleSetLoading,
  };
};

export default GlobalSlice.reducer;
