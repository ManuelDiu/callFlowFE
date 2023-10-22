import { createSlice } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

const initialState: {
  filters: {
    selectedCategorias: any[];
    selectedCargos: any[];
    selectedPostulantes: any[];
    selectedUsuarios: any[];
    selectedEstados: any[];
    selectedITRs: any[];
  };
} = {
  filters: {
    selectedCategorias: [],
    selectedCargos: [],
    selectedPostulantes: [],
    selectedUsuarios: [],
    selectedEstados: [],
    selectedITRs: [],

  },
};

export const LlamadoFilterSlice = createSlice({
  name: "LlamadoFilter",
  initialState,
  reducers: {
    changeFilters(state, { payload }) {
      state.filters = payload;
    },
    changeFilter(state, { payload }) {
      state.filters = {
        ...state?.filters,
        [payload?.key]: payload?.value,
      };
    },
  },
  extraReducers: {},
});

export const useLlamadoFilterActions = () => {
  const dispatch = useDispatch();

  const handleChangeFilter = (key: string, value: any[]) => {
    dispatch(
      LlamadoFilterSlice.actions.changeFilter({
        key,
        value,
      })
    );
  };

  return {
    handleChangeFilter,
  };
};

export default LlamadoFilterSlice.reducer;
