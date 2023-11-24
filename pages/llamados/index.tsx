import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import styled from "styled-components";
import tw from "twin.macro";
import { Topbar } from "@/components/CheckTokenWrapper/CheckTokenWrapper";
import Breadcrumb from "@/components/Topbar/Breadcrumb";
import ProfileBar from "@/components/Topbar/ProfileBar";
import Button from "@/components/Buttons/Button";
import { BiPlus, BiTrash } from "react-icons/bi";
import Table from "@/components/Table/Table";
import { Columns, formatLlamadosToTable } from "@/utils/llamadoUtils";
import { useMutation, useQuery } from "@apollo/client";
import {
  disabledLlamados,
  listarLlamadosPaged,
} from "@/controllers/llamadoController";
import { LlamadoList, PaginationLlamado } from "types/llamado";
import { useGlobal } from "@/hooks/useGlobal";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import appRoutes from "@/routes/appRoutes";
import Modal from "@/components/Modal/Modal";
import ModalConfirmation from "@/components/Modal/components/ModalConfirmation";
import toast from "react-hot-toast";
import { AiOutlineFilter } from "react-icons/ai";
import LlamadoFiltro from "@/components/LlamadoFiltro/LlamadoFiltro";
import useLlamadoFilters from "@/hooks/useLlamadoFilters";

const Container = styled.div`
  ${tw`w-full h-auto p-5 py-0 flex gap-4 flex-col items-center justify-start`}
`;

const ActionRow = styled.div`
  ${tw`w-full h-auto flex md:flex-row flex-col md:items-center items-start justify-end gap-4`}
`;

const Llamados: NextPage = () => {
  const { filtersToBackend, getFiltrosLength, offset, currentPage, handleChangeCurrentpage } = useLlamadoFilters();

  const {
    data,
    loading: loadingLlamados,
    refetch,
  } = useQuery<{
    listarLlamadosPaged: PaginationLlamado;
  }>(listarLlamadosPaged, {
    variables: {
      pagination: {
        offset: offset,
        currentPage: currentPage,
      },
    },
    fetchPolicy: "no-cache",
  });
  const totalPages = data?.listarLlamadosPaged?.totalPages;

  const { handleSetLoading, isAdmin } = useGlobal();
  const [openFilters, setOpenFilters] = useState(false);
  const { push } = useRouter();
  const [deleteOpen, setDeleteOption] = useState(false);
  const [openDeleteConfirmModal, setOpenDeleteConfirmModal] = useState(false);
  const [selecteditemsToDelete, setSelectedItemsToDelete] = useState<
    LlamadoList[]
  >([]);
  const [handleDisabledLlamados, { loading: loadingDelete }] =
    useMutation(disabledLlamados);

  useEffect(() => {
    handleSetLoading(loadingLlamados || loadingDelete);
  }, [loadingLlamados, loadingDelete]);

  useEffect(() => {
    setSelectedItemsToDelete([]);
  }, [deleteOpen]);

  const rows = formatLlamadosToTable(data?.listarLlamadosPaged?.llamados || []);

  const handleDelete = async () => {
    const response = await handleDisabledLlamados({
      variables: {
        llamados: selecteditemsToDelete?.map((llamado) => Number(llamado?.id)),
      },
    });
    if (response?.data?.deshabilitarLlamados?.ok) {
      toast.success("Se deshabilitaron los llamados correctamente");
      setDeleteOption(false);
      setOpenDeleteConfirmModal(false);
    } else {
      toast.error(response?.data?.deshabilitarLlamados?.message);
    }
  };

  return (
    <>
      <Head>
        <title>Llamados</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <Container>
        <Topbar>
          <Breadcrumb title="Llamados" />
          <ProfileBar />
        </Topbar>
        <ActionRow>
          {deleteOpen && selecteditemsToDelete?.length > 0 && (
            <Button
              variant="red"
              text={"Borrar seleccionados"}
              action={() => setOpenDeleteConfirmModal(!openDeleteConfirmModal)}
              className="w-auto"
            />
          )}
          {isAdmin && (
            <Button
              variant="outline"
              icon={<BiTrash size={20} fontWeight={700} color="#4318FF" />}
              text={
                !deleteOpen ? "Habilitar selección" : "Deshabilitar selección"
              }
              action={() => setDeleteOption(!deleteOpen)}
              className="w-auto"
            />
          )}
          {isAdmin && (
            <Button
              variant="fill"
              icon={<BiPlus size={20} fontWeight={700} color="white" />}
              text="Agregar Llamado"
              action={() => push(appRoutes.selectTemplate())}
              className="w-auto"
            />
          )}
          <Button
            variant="fill"
            icon={<AiOutlineFilter size={20} fontWeight={700} color="white" />}
            text={`${getFiltrosLength()} Filtros aplicados`}
            action={() => setOpenFilters(!openFilters)}
            className="w-auto"
          />
        </ActionRow>
        <Table
          currentPage={currentPage}
          setCurrentPage={handleChangeCurrentpage}
          withPagination
          offset={offset}
          totalPages={totalPages}
          multiDisabled={deleteOpen}
          title="Llamados"
          cols={Columns}
          data={rows}
          selectedItems={selecteditemsToDelete}
          setSelectedItems={setSelectedItemsToDelete}
        />
        {openDeleteConfirmModal && (
          <ModalConfirmation
            title="Estas seguro que deseas deshabilitar los llamados seleccionados"
            setOpen={setOpenDeleteConfirmModal}
            description="Los llamados seleccionados se deshabilitaran"
            onSubmit={() => handleDelete()}
            onCancel={() => setOpenDeleteConfirmModal(false)}
            textok="Si, deshabilitar"
            variant="red"
            textcancel="Cancelar"
          />
        )}

        {openFilters && (
          <LlamadoFiltro
            refetch={() => {
              refetch({
                pagination: {
                  offset: offset,
                  currentPage: currentPage,
                },
                filters: filtersToBackend,
              });
            }}
            onClear={() => {
              refetch({
                pagination: {
                  offset: offset,
                  currentPage: currentPage,
                },
                filters: {
                  selectedCategorias: [],
                  selectedCargos: [],
                  selectedPostulantes: [],
                  selectedUsuarios: [],
                  selectedEstados: [],
                  selectedITRs: [],
                },
              });
            }}
            setOpen={setOpenFilters}
          />
        )}
      </Container>
    </>
  );
};

export default Llamados;
