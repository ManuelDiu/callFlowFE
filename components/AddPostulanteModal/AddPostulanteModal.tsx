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
import { SortUserInfo } from "types/usuario";
import { DEFAULT_USER_IMAGE } from "@/utils/userUtils";

interface Props {
  setOpen: any;
  addPostulanteToList: (data: SortUserInfo) => void;
  selectedUsers: SortUserInfo[];
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

const AddPostulanteModal = ({
  setOpen,
  addPostulanteToList,
  selectedUsers,
}: Props) => {
  const [selectedPostulante, setSelectedPostulante] = useState<number>();
  const { handleSetLoading } = useGlobal();
  const { data: postulanteData, loading: loadingPostulantes } = useQuery<{
    listarPostulantes: PostulanteList[];
  }>(listarPostulantes);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    handleSetLoading(loadingPostulantes);
  }, [loadingPostulantes]);

  const handleNext = () => {
    if (selectedPostulante) {
      const alreadyExists = selectedUsers?.find(
        (usr) => usr?.id === selectedPostulante
      );
      if (alreadyExists) {
        setError("Este usuario ya es un postulante del llamado");
        return;
      }
      const postulanteInfo = postulanteData?.listarPostulantes?.find(
        (item) => item?.id === selectedPostulante
      );
      setError(null);
      if (selectedPostulante) {
        const itemToAdd: SortUserInfo = {
          id: postulanteInfo?.id || 0,
          name: `${postulanteInfo?.nombres} ${postulanteInfo?.apellidos}`,
          lastName: "Postulante",
          imageUrl: DEFAULT_USER_IMAGE,
        };
        addPostulanteToList(itemToAdd);
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
          label="Postulante"
          //   isInvalid={}
          placeholder="Seleccione un postulante"
          onChange={(val: any) => setSelectedPostulante(val?.value)}
          required
          items={formatPostulantesToDropdown(postulanteData?.listarPostulantes)}
          //   inputFormName={crearLlamadoFormFields.solicitante}
        />
        <ErrorContainer>
          {error && <OneLineError message={error} />}
        </ErrorContainer>
        <SuggestText>
          No existe el posulante que deseas agregar?{" "}
          <Link href={appRoutes.postulantes()}>
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
      title="Agregar postulante"
      className="!overflow-visible"
    />
  );
};

export default AddPostulanteModal;
