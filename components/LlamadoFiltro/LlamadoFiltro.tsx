import { MdClose } from "react-icons/md";
import styled from "styled-components";
import tw from "twin.macro";
import Button from "../Buttons/Button";
import Dropdown from "../Inputs/Dropdown";
import { ORDER_LLAMADO_STATUS } from "@/utils/llamadoUtils";
import { useEffect, useState } from "react";
import useLlamadoFilters from "@/hooks/useLlamadoFilters";
import { useQuery } from "@apollo/client";
import { CategoriaItem } from "types/categoria";
import { listCategorias } from "@/controllers/categoriaController";
import { listarCargos } from "@/controllers/cargoController";
import { Cargo } from "types/cargo";
import { PostulanteList } from "types/postulante";
import { listarPostulantes } from "@/controllers/postulanteController";
import UserInfoLine from "../Table/components/UserInfoLine";
import { DEFAULT_USER_IMAGE } from "@/utils/userUtils";
import { UserList } from "types/usuario";
import { listUsers } from "@/controllers/userController";
import { useGlobal } from "@/hooks/useGlobal";
import { LlamadoList } from "types/llamado";
import { listarLlamados } from "@/controllers/llamadoController";
import { ITR } from "@/enums/ITR";

const Container = styled.div`
  ${tw`md:w-[400px] px-5 py-16 gap-4 overflow-auto max-h-screen w-full bg-white h-auto z-[50] flex flex-col items-start justify-start absolute top-0 right-0 bg-white shadow-md border-l h-screen border-gray-300`}
`;

const Title = styled.span`
  ${tw`font-semibold text-texto text-3xl`}
`;

const Row = styled.span`
  ${tw`w-full h-auto flex flex-row items-center justify-start gap-2 `}
`;

const Column = styled.span`
  ${tw`py-4 w-full flex flex-col items-center justify-start gap-4`}
`;

interface Props {
  setOpen: any;
  refetch?: any;
}

const LlamadoFiltro = ({ setOpen, refetch }: Props) => {
  const {
    selectedCategorias,
    selectedCargos,
    selectedPostulantes,
    selectedUsuarios,
    selectedEstados,
    selectedITRs,
    handleChangeFilter,
  } = useLlamadoFilters();
  const { handleSetLoading } = useGlobal();

  const { data: postulantesData, loading: loadingPostulantes } = useQuery<{
    listarPostulantes: PostulanteList[];
  }>(listarPostulantes);

  const { data: categoriasData, loading: loadingCategorias } = useQuery<{
    listCategorias: CategoriaItem[];
  }>(listCategorias);

  const { data: cargosData, loading: loadingCargos } = useQuery<{
    listarCargos: Cargo[];
  }>(listarCargos);

  const { data: usuariosData, loading: loadingUsuarios } = useQuery<{
    listUsuarios: UserList[];
  }>(listUsers);

  useEffect(() => {
    handleSetLoading(
      loadingPostulantes ||
        loadingCategorias ||
        loadingCargos ||
        loadingUsuarios
    );
  }, [loadingPostulantes, loadingCategorias, loadingCargos, loadingUsuarios]);

  const cargos = cargosData?.listarCargos;
  const postulantes = postulantesData?.listarPostulantes;
  const categorias = categoriasData?.listCategorias;
  const usuarios = usuariosData?.listUsuarios;


  const applyFilters = () => {
    if (refetch) {
      refetch();
    }
  };

  const cleanFilters = () => {
    handleChangeFilter("selectedCategorias", []);
    handleChangeFilter("selectedCargos", []);
    handleChangeFilter("selectedPostulantes", []);
    handleChangeFilter("selectedUsuarios", []);
    handleChangeFilter("selectedEstados", []);
    applyFilters();
    setOpen(false);
  };

  return (
    <Container className="modalOpen filterOpen">
      <MdClose
        size={30}
        className="absolute right-5 top-5 cursor-pointer"
        color="black"
        onClick={() => setOpen(false)}
      />
      <Title>Filtros para llamados</Title>

      <Row>
        <Button
          className="!py-2"
          text="Aplicar filtros"
          variant="outline"
          action={() => applyFilters()}
        />
        <Button
          className="!py-2"
          text="Limpiar"
          variant="fill"
          action={() => cleanFilters()}
        />
      </Row>

      <Column>
        <Dropdown
          multiSelect
          defaultValue={selectedCategorias}
          label="Categorias"
          //   isInvalid={}
          placeholder="Seleccione una categoria para filtrar"
          onChange={(val: any) => handleChangeFilter("selectedCategorias", val?.map((item: any) => item?.value))}
          required
          items={
            categorias?.map((item) => ({
              label: item?.nombre,
              value: item?.id,
            })) || []
          }
          //   inputFormName={crearLlamadoFormFields.solicitante}
        />

        <Dropdown
          defaultValue={selectedCargos}
          label="Cargos"
          //   isInvalid={}
          placeholder="Seleccione un cargo para filtrar"
          onChange={(val: any) => handleChangeFilter("selectedCargos", val?.map((item: any) => item?.value))}
          required
          multiSelect
          items={
            cargos?.map((item) => ({
              label: item?.nombre,
              value: item?.id,
            })) || []
          }
          //   inputFormName={crearLlamadoFormFields.solicitante}
        />

        <Dropdown
          defaultValue={selectedPostulantes}
          label="Postulantes"
          //   isInvalid={}
          placeholder="Seleccione un postulante para filtrar"
          onChange={(val: any) =>
            handleChangeFilter("selectedPostulantes", val?.map((item: any) => item?.value))
          }
          multiSelect
          required
          items={
            postulantes?.map((item) => {
              return {
                label: (
                  <UserInfoLine
                    userImage={DEFAULT_USER_IMAGE}
                    userName={item?.nombres}
                    userlastName={item?.apellidos}
                  />
                ),
                value: item?.id,
              };
            }) || []
          }
          //   inputFormName={crearLlamadoFormFields.solicitante}
        />

        <Dropdown
          defaultValue={selectedUsuarios}
          label="Tribunales"
          //   isInvalid={}
          placeholder="Seleccione usuarios para filtrar"
          onChange={(val: any) => handleChangeFilter("selectedUsuarios", val?.map((item: any) => item?.value))}
          required
          multiSelect
          items={
            usuarios?.map((item) => {
              return {
                label: (
                  <UserInfoLine
                    userImage={item?.imageUrl || DEFAULT_USER_IMAGE}
                    userName={item?.name}
                    userlastName={item?.lastName}
                  />
                ),
                value: item?.id,
              };
            }) || []
          }
          //   inputFormName={crearLlamadoFormFields.solicitante}
        />

        <Dropdown
          defaultValue={selectedEstados}
          label="Estados"
          multiSelect
          //   isInvalid={}
          placeholder="Seleccione estados para filtrar"
          onChange={(val: any) => handleChangeFilter("selectedEstados", val?.map((item: any) => item?.value))}
          required
          items={ORDER_LLAMADO_STATUS?.map((item) => {
            return {
              label: item,
              value: item,
            };
          })}
          //   inputFormName={crearLlamadoFormFields.solicitante}
        />

<Dropdown
          defaultValue={selectedITRs}
          label="ITRs"
          //   isInvalid={}
          placeholder="Seleccione ITRs para filtrar"
          onChange={(val: any) => handleChangeFilter("selectedITRs", val?.map((item: any) => item?.value))}
          required
          multiSelect
          items={
            [
              {
                label: "Todos",
                value: "Todos",
              },
              {
                label: "Sur oeste",
                value: ITR.suroeste,
              },
              {
                label: "Este",
                value: ITR.este,
              },
              {
                label: "Norte",
                value: ITR.norte,
              },
              {
                label: "Ulo",
                value: ITR.ulo,
              },
              {
                label: "Centro sur",
                value: ITR.centrosur,
              }
            ]
          }
          //   inputFormName={crearLlamadoFormFields.solicitante}
        />

      </Column>
    </Container>
  );
};

export default LlamadoFiltro;
