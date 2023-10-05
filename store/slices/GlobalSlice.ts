import { createSlice } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { TemplateList } from "types/template";
import { UserList } from "types/usuario";
import { handleGetToken, handleStorageToken } from "utils/userUtils";

const initialState: {
  userInfo: UserList | null;
  isLoading: boolean,
  token: string | undefined,
  loading: boolean,
  selectedTemplate?: TemplateList | undefined,
} = {
  userInfo: null,
  isLoading: false,
  token: handleGetToken() || "",
  loading: false,
  selectedTemplate: undefined,
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
    },
    setTemplate(state, {payload}) {
      state.selectedTemplate = payload;
    },
    clearTemplate(state) {
      state.selectedTemplate = undefined;
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

  const handleSetTemplate = (template: TemplateList) => {
    dispatch(GlobalSlice.actions.setTemplate(template));
  };

  const handleClearTemplate = () => {
    dispatch(GlobalSlice.actions.clearTemplate());
  };

  return {
    handleSetUserInfo,
    handleSetToken,
    handleSetLoading,
    handleSetTemplate,
    handleClearTemplate,
  };
};

export default GlobalSlice.reducer;
