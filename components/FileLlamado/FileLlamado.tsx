import styled from "styled-components";
import tw from "twin.macro";
import Button from "../Buttons/Button";
import { AiOutlinePlus } from "react-icons/ai";
import { Archivo, FullLlamadoInfo } from "types/llamado";
import { useState } from "react";
import AddFileLlamadoModal from "../AddFileLlamadoModal/AddFileLlamadoModal";
import { FileIcon, defaultStyles } from "react-file-icon";
import { GoDownload } from "react-icons/go";
import useDownloadFile from "@/hooks/useDownloadFile";
import { useGlobal } from "@/hooks/useGlobal";
import { getFileType } from "@/utils/utils";
import { BsTrash } from "react-icons/bs";
import ModalConfirmation from "@/components/Modal/components/ModalConfirmation";
import { useApolloClient, useMutation } from "@apollo/client";
import { deleteArchivo } from "@/controllers/archivoController";
import { toast } from "react-toastify";
import { getLlamadoInfoById } from "@/controllers/llamadoController";
import Text from "../Table/components/Text";

const Container = styled.div`
  ${tw`w-full h-auto flex flex-col items-start justify-start gap-10`}
`;

const Title = styled.div`
  ${tw`text-texto font-bold text-2xl`}
`;

const Subtitle = styled.div`
  ${tw`text-texto font-semibold text-lg`}
`;

const Row = styled.div`
  ${tw`w-full h-auto flex flex-row items-center justify-between flex-wrap`}
`;

const ActionsContainer = styled.div`
  ${tw`w-full h-auto flex gap-2 flex-row items-center justify-end`}
`;

const List = styled.div`
  ${tw`w-full h-auto flex gap-4 flex-row items-center justify-start flex-wrap`}
`;

const ArchivoItem = styled.div`
  ${tw`w-[320px] h-auto bg-white p-5 rounded-2xl shadow-md flex flex-col items-start justify-start gap-2 border border-gray-100`}
`;

const InfoList = styled.div`
  ${tw`flex flex-col items-start justify-start gap-1`}
`;

const ArchivoKey = styled.span`
  ${tw`font-bold max-w-full overflow-hidden truncate text-base text-gray-800`}
`;

const ArchivoText = styled.span`
  ${tw`font-semibold max-w-full overflow-hidden truncate text-sm text-gray-900`}
`;

const ActionWrapper = styled.div`
  ${tw`rounded-full w-auto h-auto p-1 border-2 cursor-pointer transition-all transform hover:scale-[1.2] border-texto flex items-center justify-center`}
`;

interface Props {
  llamadoInfo: FullLlamadoInfo;
}

const FileLlamado = ({ llamadoInfo }: Props) => {
  const [openModalAdd, setOpenModalAdd] = useState<boolean>();
  const archivos = llamadoInfo?.archivos;
  const archivosFirma = llamadoInfo?.archivosFirma;
  const { downloadFile } = useDownloadFile();
  const client = useApolloClient();
  const { handleSetLoading, isAdmin } = useGlobal();
  const [openConfirmationDelete, setOpenConfirmationDelete] =
    useState<boolean>();
  const [selectedArchivoToDelete, setSelectedArchivoToDelete] =
    useState<Archivo>();
  const [handleDeleteArchivo] = useMutation(deleteArchivo);

  const handleDownload = async (item: Archivo) => {
    handleSetLoading(true);
    await downloadFile(item.url, item.extension, item.nombre);
    handleSetLoading(false);
  };

  const deleteFile = async () => {
    try {
      const resp = await handleDeleteArchivo({
        variables: {
          archivoId: selectedArchivoToDelete?.id,
        },
        // refetchQueries: [{ query: getLlamadoInfoById, variables: {
        //   llamadoId: llamadoInfo?.id,
        // } }]
      });
      if (resp?.data?.deleteArchivo?.ok === true) {
        toast.success("Archivo eliminado correctamente");

        client.writeQuery({
          query: getLlamadoInfoById,
          data: {
            getLlamadoById: {
              ...llamadoInfo,
              archivos: llamadoInfo?.archivos?.filter(
                (file) => file?.id !== selectedArchivoToDelete?.id
              ),
            },
          },
        });
      } else {
        toast.error("Error al eliminar archivo");
      }
      setOpenConfirmationDelete(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <Row>
        <Title>Archivos llamado</Title>
        {isAdmin && (
          <Button
            action={() => setOpenModalAdd(!openModalAdd)}
            icon={<AiOutlinePlus color="white" size={20} />}
            variant="fill"
            text="Agregar archivo"
          />
        )}
      </Row>

      <Subtitle>Archivos con firma</Subtitle>
      <List>
        {archivosFirma?.length === 0 && (
          <Text
            className="!text-base"
            text="Ooops!... No encontramos ninguna archivo con firma para este llamado"
          />
        )}
        {archivosFirma?.map((archivo) => {
          return (
            <ArchivoItem key={archivo?.id}>
              <Row className="!justify-start !gap-2">
                <div className="w-[80px] h-[90px]">
                  <FileIcon
                    extension={getFileType(archivo)}
                    {...(defaultStyles as any)[getFileType(archivo)]}
                  />
                </div>

                <InfoList>
                  <ArchivoKey>Nombre:</ArchivoKey>
                  <ArchivoText>{archivo?.nombre}</ArchivoText>
                  <ArchivoKey>Firmas:</ArchivoKey>
                  <ArchivoText>5</ArchivoText>
                </InfoList>
              </Row>
              <ActionsContainer>
                <a href={archivo.url} rel="noreferrer" target="_blank">
                  <ActionWrapper
                    className="!border-green"
                    onClick={() => handleDownload(archivo)}
                  >
                    <GoDownload color="#37B63C" size={20} />
                  </ActionWrapper>
                </a>
                <ActionWrapper
                  className="!border-red-500"
                  onClick={() => {
                    setOpenConfirmationDelete(true);
                    setSelectedArchivoToDelete(archivo);
                  }}
                >
                  <BsTrash color="red" size={20} />
                </ActionWrapper>
              </ActionsContainer>
            </ArchivoItem>
          );
        })}
      </List>

      <Subtitle>Archivos</Subtitle>
      <List>
        {archivos?.length === 0 && (
          <Text
            className="!text-base"
            text="Ooops!... No encontramos ninguna archivo para este llamado"
          />
        )}
        {archivos?.map((archivo) => {
          return (
            <ArchivoItem key={archivo?.id}>
              <Row className="!justify-start !gap-2">
                <div className="w-[80px] h-[90px]">
                  <FileIcon
                    extension={getFileType(archivo)}
                    {...(defaultStyles as any)[getFileType(archivo)]}
                  />
                </div>

                <InfoList>
                  <ArchivoKey>Nombre:</ArchivoKey>
                  <ArchivoText>{archivo?.nombre}</ArchivoText>
                  <ArchivoKey>Tipo Archivo:</ArchivoKey>
                  <ArchivoText>{archivo?.tipoArchivo.nombre}</ArchivoText>
                </InfoList>
              </Row>
              <ActionsContainer>
                <a href={archivo.url} rel="noreferrer" target="_blank">
                  <ActionWrapper
                    className="!border-green"
                    onClick={() => handleDownload(archivo)}
                  >
                    <GoDownload color="#37B63C" size={20} />
                  </ActionWrapper>
                </a>
                <ActionWrapper
                  className="!border-red-500"
                  onClick={() => {
                    setOpenConfirmationDelete(true);
                    setSelectedArchivoToDelete(archivo);
                  }}
                >
                  <BsTrash color="red" size={20} />
                </ActionWrapper>
              </ActionsContainer>
            </ArchivoItem>
          );
        })}
      </List>

      {openConfirmationDelete && (
        <ModalConfirmation
          variant="red"
          textok="Si, eliminar archivo"
          textcancel="Cancelar"
          onSubmit={() => deleteFile()}
          onCancel={() => setOpenConfirmationDelete(false)}
          setOpen={setOpenConfirmationDelete}
          title="Estas seguro que deseas eliminar a este archivo?"
          description="Si eliminas a este archivo, no tendras mas acceso al mismo dentro del sistema"
        />
      )}
      {openModalAdd && (
        <AddFileLlamadoModal archivos={archivos} setOpen={setOpenModalAdd} />
      )}
    </Container>
  );
};

export default FileLlamado;
