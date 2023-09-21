import { createSlice } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { handleGetToken, handleStorageToken } from "utils/userUtils";

const initialState: {
  userInfo: any;
  token: string | undefined,
} = {
  userInfo: null,
  token: handleGetToken() || "",
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

  return {
    handleSetUserInfo,
    handleSetToken,
  };
};

export default GlobalSlice.reducer;
