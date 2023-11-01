import styled from "styled-components";
import tw from "twin.macro";
import Button from "../Buttons/Button";
import { AiOutlinePlus } from "react-icons/ai";
import { Archivo, ArchivoFirma, FullLlamadoInfo } from "types/llamado";
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
import FirmarArchivoModal from "./components/FirmarArchivoModal";
import VerFirmasArchivoModal from "./components/VerFirmasPersonas";
import AddActaFinalLlamado from "./components/AddActaFinalLlamado";
import { TipoArchivoFirma } from "@/enums/TipoArchivoFirma";
import { TipoMiembro } from "@/enums/TipoMiembro";

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
  ${tw`w-full h-auto mt-2 flex gap-2 flex-row items-center justify-end`}
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
  const { userInfo } = useGlobal();
  const [openModalAdd, setOpenModalAdd] = useState<boolean>();
  const [openAddActa, setOpenAddActa] = useState<boolean>();
  const archivos = llamadoInfo?.archivos;
  const archivosFirma = llamadoInfo?.archivosFirma;
  const { downloadFile } = useDownloadFile();
  const client = useApolloClient();
  const [selectedFileToFirmar, setSelectedFileToFirmar] = useState<
    ArchivoFirma
  >();
  const { handleSetLoading, isAdmin } = useGlobal();
  const [openConfirmationDelete, setOpenConfirmationDelete] = useState<
    boolean
  >();
  const [selectedArchivoToDelete, setSelectedArchivoToDelete] = useState<
    Archivo | ArchivoFirma
  >();
  const [selectedFileToView, setSelectedFileToView] = useState<ArchivoFirma>();
  const [handleDeleteArchivo] = useMutation(deleteArchivo);

  const handleDownload = async (item: Archivo | ArchivoFirma) => {
    handleSetLoading(true);
    await downloadFile(item.url, item.extension, item?.nombre);
    handleSetLoading(false);
  };

  const isMiembro =
    typeof llamadoInfo?.miembrosTribunal?.find(
      (item) =>
        item?.usuario?.id === userInfo?.id &&
        item?.tipoMiembro === TipoMiembro.titular
    ) !== "undefined";

  const openFirmarArchivoModal =
    selectedFileToFirmar !== undefined && selectedFileToFirmar !== null;
  const hasArchivoToSee =
    selectedFileToView !== undefined && selectedFileToView !== null;

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
              archivosFirma: llamadoInfo?.archivosFirma?.filter(
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
        <div className="flex gap-2 md:flex-row flex-col md:my-0 my-4 flex-grow items-center justify-end">
          {isAdmin && (
            <Button
              action={() => setOpenModalAdd(!openModalAdd)}
              icon={<AiOutlinePlus color="white" size={20} />}
              variant="fill"
              text="Agregar archivo"
            />
          )}
          {isAdmin && (
            <Button
              action={() => {
                const existsActaFinal = llamadoInfo?.archivosFirma?.find(
                  (archivo) => archivo?.nombre === TipoArchivoFirma.actaFinal
                );
                if (existsActaFinal) {
                  toast.error(
                    "Ya existe un acta final para este llamado, elimínala y génerala nuevamente."
                  );
                } else {
                  const grillaLlamado = llamadoInfo?.archivosFirma?.find(
                    (archivo) => archivo?.nombre === TipoArchivoFirma.grilla
                  );

                  if (
                    !grillaLlamado ||
                    grillaLlamado?.firmas?.length !==
                      llamadoInfo?.miembrosTribunal?.length
                  ) {
                    toast.error(
                      "Asegúrate de que la grilla tenga todas las firmas para proceder a la creación del acta final."
                    );
                  } else {
                    setOpenAddActa(!openAddActa);
                  }
                }
              }}
              icon={<AiOutlinePlus color="#4318FF" size={20} />}
              variant="outline"
              text="Agregar Acta Final"
            />
          )}
        </div>
      </Row>

      <Subtitle>
        Archivos con firma
        <div className="w-full h-auto text-sm flex flex-col my-2 text-left text-textogris">
          <span>¿Como firmar un archivo de tipo firma?</span>
          <span>- Descarga la ultima version en el icono de descargar</span>
          <span>
            - Presiona el boton <span className="text-principal">Firmar</span>
          </span>
          <span>- Sube la nueva version de tu archivo firmado</span>
        </div>
      </Subtitle>
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
                  <ArchivoKey>Firmas actuales:</ArchivoKey>
                  <ArchivoText>
                    {archivo?.firmas?.length || 0} /{" "}
                    {llamadoInfo?.miembrosTribunal?.length}
                  </ArchivoText>
                </InfoList>
              </Row>
              <ActionsContainer>
                <div className="w-full flex-grow h-auto items-center justify-start">
                  <span
                    onClick={() => setSelectedFileToView(archivo)}
                    className="text-principal underline text-sm cursor-pointer font-medium"
                  >
                    Ver firmas
                  </span>
                </div>

                {isMiembro && (
                  <Button
                    action={() => setSelectedFileToFirmar(archivo)}
                    icon={<AiOutlinePlus color="white" size={20} />}
                    variant="fill"
                    sizeVariant="fit"
                    text="Firmar"
                  />
                )}
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
      {openFirmarArchivoModal && (
        <FirmarArchivoModal
          archivo={selectedFileToFirmar}
          onClose={() => setSelectedFileToFirmar(undefined)}
          llamadoInfo={llamadoInfo}
        />
      )}

      {hasArchivoToSee && (
        <VerFirmasArchivoModal
          archivo={selectedFileToView}
          onClose={() => setSelectedFileToView(undefined)}
          llamadoInfo={llamadoInfo}
        />
      )}
      {openModalAdd && (
        <AddFileLlamadoModal archivos={archivos} setOpen={setOpenModalAdd} />
      )}

      {openAddActa && (
        <AddActaFinalLlamado
          onClose={() => setOpenAddActa(false)}
          llamadoInfo={llamadoInfo}
        />
      )}
    </Container>
  );
};

export default FileLlamado;
