import { useLlamadoFilterActions } from "@/store/slices/LlamadoFilterSlice";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const useLlamadoFilters = () => {
  const { filters, offset, currentPage } = useSelector(
    (state: RootState) => state.LlamadoFilterSlice
  );

  const { handleChangeFilter, handleChangeCurrentpage, handleChangeOffset } =
    useLlamadoFilterActions();

  const selectedCategorias = filters?.selectedCategorias;
  const selectedCargos = filters?.selectedCargos;
  const selectedPostulantes = filters?.selectedPostulantes;
  const selectedUsuarios = filters?.selectedUsuarios;
  const selectedEstados = filters?.selectedEstados;
  const selectedITRs = filters?.selectedITRs;

  const formatedSelectedCategorias = filters?.selectedCategorias;
  const formatedSelectedCargos = filters?.selectedCargos;
  const formatedSelectedPostulantes = filters?.selectedPostulantes;
  const formatedSelectedUsuarios = filters?.selectedUsuarios;
  const formatedSelectedEstados = filters?.selectedEstados;
  const formatedSelectedITRs = filters?.selectedITRs;

  const filtersToBackend = {
    selectedCategorias: formatedSelectedCategorias,
    selectedCargos: formatedSelectedCargos,
    selectedPostulantes: formatedSelectedPostulantes,
    selectedUsuarios: formatedSelectedUsuarios,
    selectedEstados: formatedSelectedEstados,
    selectedITRs: formatedSelectedITRs,
  };

  const getFiltrosLength = () => {
    let lenth = 0;
    if (selectedCategorias?.length > 0) {
      lenth += 1;
    }
    if (selectedCargos?.length > 0) {
      lenth += 1;
    }
    if (selectedPostulantes?.length > 0) {
      lenth += 1;
    }
    if (selectedUsuarios?.length > 0) {
      lenth += 1;
    }
    if (selectedEstados?.length > 0) {
      lenth += 1;
    }
    return lenth;
  };

  return {
    selectedCategorias,
    selectedCargos,
    selectedPostulantes,
    selectedUsuarios,
    selectedEstados,
    handleChangeFilter,
    selectedITRs,
    filters,
    handleChangeCurrentpage,
    handleChangeOffset,
    getFiltrosLength,
    filtersToBackend,
    offset,
    currentPage,
  };
};

export default useLlamadoFilters;
