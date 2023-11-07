import { createSlice } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

const initialState: {
  offset: number,
  currentPage: number,
  filters: {
    selectedCategorias: any[];
    selectedCargos: any[];
    selectedPostulantes: any[];
    selectedUsuarios: any[];
    selectedEstados: any[];
    selectedITRs: any[];
  };
} = {
  offset: 10,
  currentPage: 1,
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
    changeOffset(state, { payload }) {
      state.offset = payload;
    },
    changeCurrentPage(state, { payload }) {
      state.currentPage = payload;
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

  const handleChangeCurrentpage = (page: number) => {
    dispatch(
      LlamadoFilterSlice.actions.changeCurrentPage(page)
    );
  };

  const handleChangeOffset = (offset: number) => {
    dispatch(
      LlamadoFilterSlice.actions.changeOffset(offset)
    );
  };


  return {
    handleChangeFilter,
    handleChangeCurrentpage,
    handleChangeOffset,
  };
};

export default LlamadoFilterSlice.reducer;
