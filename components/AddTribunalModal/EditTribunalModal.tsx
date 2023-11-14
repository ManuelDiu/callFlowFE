import styled from "styled-components";
import Modal from "../Modal/Modal";
import tw from "twin.macro";
import Link from "next/link";
import appRoutes from "@/routes/appRoutes";
import Dropdown from "../Inputs/Dropdown";
import { useEffect, useState } from "react";
import { formatPostulantesToDropdown } from "@/utils/postulantes";
import { useMutation, useQuery } from "@apollo/client";
import { listarPostulantes } from "@/controllers/postulanteController";
import { useGlobal } from "@/hooks/useGlobal";
import { PostulanteList } from "types/postulante";
import OneLineError from "../OneLineError/OneLineError";
import { SortUserInfo, TribunalInfo, UserList } from "types/usuario";
import {
  DEFAULT_USER_IMAGE,
  formatListMiembrosTribunal,
} from "@/utils/userUtils";
import { listarMiembrosTribunal } from "@/controllers/userController";
import Input from "../Inputs/Input";
import { TipoMiembro } from "@/enums/TipoMiembro";
import toast from "react-hot-toast";
import { cambiarMiembroTribunal, getLlamadoInfoById } from "@/controllers/llamadoController";

interface Props {
  setOpen: any;
  selectedUser: any;
  llamadoId: any;
}

const Container = styled.div`
  ${tw`w-full h-auto flex flex-col gap-2 items-center justify-start`}
`;

const SuggestText = styled.span`
  ${tw`w-full h-auto text-left text-sm text-textoGray`}
`;

const ErrorContainer = styled.span`
  ${tw`w-full h-auto flex flex-row items-center justify-start`}
`;

const EditTribunalModal = ({ setOpen, selectedUser, llamadoId }: Props) => {
  const [selectedTribunal, setSelectedTribunal] = useState<number>();
  const [type, setType] = useState<TipoMiembro | null>(
    selectedUser?.tipoMiembro
  );
  const [order, setOrder] = useState<number>(selectedUser?.orden);
  const [handleCambiarTribunal] = useMutation(cambiarMiembroTribunal);

  const { handleSetLoading } = useGlobal();
  const { data: tribunalesData, loading: loadingTribunales } = useQuery<{
    listarMiembrosTribunal: UserList[];
  }>(listarMiembrosTribunal);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    handleSetLoading(loadingTribunales);
  }, [loadingTribunales]);

  const handleNext = async () => {
    if (!type) {
      setError("Debes seleccionar un tipo");
      return;
    }
    if (!order || order === 0) {
      setError("Debes ingresar un orden valido");
      return;
    }

    handleSetLoading(true);
    try {
      const dataToSend = {
        id: selectedUser?.id,
        tipoMiembro: type,
        orden: Number(order || 0),
      };
      const resp = await handleCambiarTribunal({
        variables: {
          data: dataToSend,
        },
        refetchQueries: [
          {
            query: getLlamadoInfoById,
            variables: {
              llamadoId: Number(llamadoId),
            },
          },
        ],
      });
      if (resp?.data?.cambiarMiembroTribunal?.ok) {
        toast.success("Se actualizo la informacion del tribunal");
        setOpen(false);
      } else {
        toast.error("Error al actualizar la informacion del tribunal");
      }

    } catch (error) {
      toast.error("Error al editar tribunal");
    } finally {
      handleSetLoading(false);
    }
  };

  const handleRenderContent = () => {
    return (
      <Container data-testid="Container" className="">
        {selectedUser?.id && (
          <Dropdown
            listenDefaultValue
            disabled
            defaultValue={[selectedUser?.id]}
            label="Miembros del tribunal"
            //   isInvalid={}
            placeholder="Seleccione un miembro del tribunal"
            onChange={(val: any) => setSelectedTribunal(val?.value)}
            required
            items={formatListMiembrosTribunal(
              tribunalesData?.listarMiembrosTribunal
            )}
            //   inputFormName={crearLlamadoFormFields.solicitante}
          />
        )}
        <Dropdown
          defaultValue={[selectedUser?.tipoMiembro || ""]}
          label="Tipo de miembro"
          //   isInvalid={}
          placeholder="Seleccione un tipo de miembro del tribunal"
          onChange={(val: any) => setType(val?.value)}
          required
          items={[
            {
              label: "Titular",
              value: TipoMiembro.titular,
            },
            {
              label: "Suplente",
              value: TipoMiembro.suplente,
            },
          ]}
          //   inputFormName={crearLlamadoFormFields.solicitante}
        />
        <Input
          label="Orden"
          placeholder="Ingrese un orden"
          type="number"
          min={1}
          required
          value={order}
          onChange={(val: any) => setOrder(val?.target?.value || 0)}
        />
        <ErrorContainer>
          {error && <OneLineError message={error} />}
        </ErrorContainer>
        <SuggestText>
          No existe el miembro del tribunal que deseas agregar?{" "}
          <Link href={appRoutes.usuarios()}>
            <span className="text-principal cursor-pointer">
              Agrega uno nuevo
            </span>
          </Link>
        </SuggestText>
      </Container>
    );
  };

  return (
    <Modal
      textok={"Editar"}
      description="Permite agregar nuevos postulantes en un llamado, ya sea un nuevo postulante o uno ya existente en el sistema"
      textcancel="Cancelar"
      onSubmit={() => handleNext()}
      onCancel={() => setOpen(false)}
      setOpen={setOpen}
      content={handleRenderContent()}
      title="Agregar miembro del tribunal"
      className="!mt-[20%]"
    />
  );
};

export default EditTribunalModal;
