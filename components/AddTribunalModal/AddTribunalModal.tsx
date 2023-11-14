import styled from "styled-components";
import Modal from "../Modal/Modal";
import tw from "twin.macro";
import Link from "next/link";
import appRoutes from "@/routes/appRoutes";
import Dropdown from "../Inputs/Dropdown";
import { useEffect, useState } from "react";
import { formatPostulantesToDropdown } from "@/utils/postulantes";
import { useQuery } from "@apollo/client";
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

interface Props {
  setOpen: any;
  addTribunalToList: (data: TribunalInfo) => void;
  selectedTribunales: TribunalInfo[];
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

const AddTribunalModal = ({
  setOpen,
  addTribunalToList,
  selectedTribunales,
}: Props) => {
  const [selectedTribunal, setSelectedTribunal] = useState<number>();
  const [type, setType] = useState<TipoMiembro | null>(null);
  const [order, setOrder] = useState<number>();

  const { handleSetLoading } = useGlobal();
  const { data: tribunalesData, loading: loadingTribunales } = useQuery<{
    listarMiembrosTribunal: UserList[];
  }>(listarMiembrosTribunal);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    handleSetLoading(loadingTribunales);
  }, [loadingTribunales]);

  const handleNext = () => {
    if (!type) {
      setError("Debes seleccionar un tipo");
      return;
    }
    if (!order || order === 0) {
      setError("Debes ingresar un orden valido");
      return;
    }

    const alreadyExistsThisOrderAndType = selectedTribunales?.find((item) => {
        return item?.order === order && item?.type === type
    })

    if (alreadyExistsThisOrderAndType) {
        setError(`Ya existe una tribunal ${type} con el orden ${order}`)
    }

    if (selectedTribunal) {
      const alreadyExists = selectedTribunales?.find(
        (usr) => usr?.id === selectedTribunal
      );
      if (alreadyExists) {
        setError("Este usuario ya es miembro del tribunal");
        return;
      }
      const tribunalInfo = tribunalesData?.listarMiembrosTribunal?.find(
        (item) => item?.id === selectedTribunal
      );
      setError(null);
      if (selectedTribunal) {
        const tribunal: TribunalInfo = {
          id: tribunalInfo?.id || 0,
          name: `${tribunalInfo?.name} ${tribunalInfo?.lastName}`,
          lastName: `Tribunal - ${order} ${type}`,
          imageUrl: tribunalInfo?.imageUrl || DEFAULT_USER_IMAGE,
          order: order,
          type: type,
        };
        addTribunalToList(tribunal);
        setOpen(false);
      } else {
        setError("Usuario invalido");
      }
    } else {
      setError("Debes seleccionar al menos un postulante");
    }
  };

  const handleRenderContent = () => {
    return (
      <Container data-testid="Container" className="">
        <Dropdown
          defaultValue={[]}
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
        <Dropdown
          defaultValue={[]}
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
      textok={"Guardar"}
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

export default AddTribunalModal;
