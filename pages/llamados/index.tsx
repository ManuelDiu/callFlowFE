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
  listarLlamados,
} from "@/controllers/llamadoController";
import { LlamadoList } from "types/llamado";
import { useGlobal } from "@/hooks/useGlobal";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import appRoutes from "@/routes/appRoutes";
import Modal from "@/components/Modal/Modal";
import ModalConfirmation from "@/components/Modal/components/ModalConfirmation";
import { toast } from "react-toastify";

const Container = styled.div`
  ${tw`w-full max-h-full pb-5 h-auto p-5 py-0 flex gap-4 flex-col items-center justify-start`}
`;

const ActionRow = styled.div`
  ${tw`w-full h-auto flex flex-row items-center justify-end gap-4`}
`;

const Llamados: NextPage = () => {
  const { data, loading: loadingLlamados } = useQuery<{
    listarLlamados: LlamadoList[];
  }>(listarLlamados);
  const { handleSetLoading } = useGlobal();
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

  const rows = formatLlamadosToTable(data?.listarLlamados || []);

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
          <Button
            variant="outline"
            icon={<BiTrash size={20} fontWeight={700} color="#4318FF" />}
            text={
              !deleteOpen ? "Habilitar seleccion" : "Deshabilitar seleccion"
            }
            action={() => setDeleteOption(!deleteOpen)}
            className="w-auto"
          />
          <Button
            variant="fill"
            icon={<BiPlus size={20} fontWeight={700} color="white" />}
            text="Agregar Llamado"
            action={() => push(appRoutes.selectTemplate())}
            className="w-auto"
          />
        </ActionRow>
        <Table
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
      </Container>
    </>
  );
};

export default Llamados;
