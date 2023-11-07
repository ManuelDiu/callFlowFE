import { Topbar } from "@/components/CheckTokenWrapper/CheckTokenWrapper";
import NotFoundPage from "@/components/NotFoundPage/NotFoundPage";
import Breadcrumb from "@/components/Topbar/Breadcrumb";
import ProfileBar from "@/components/Topbar/ProfileBar";
import { useGlobal } from "@/hooks/useGlobal";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";

import {
  infoPostulanteEnLlamado,
  cambiarEstadoPostulanteLlamado,
  cambiarEstadoPostulanteLlamadoTribunal,
} from "@/controllers/postulanteController";
import { PostulanteLlamadoFull } from "types/postulante";
import Image from "next/image";
import Button from "@/components/Buttons/Button";
import Text from "@/components/Table/components/Text";
import { GoDownload } from "react-icons/go";
import { BsTrash } from "react-icons/bs";
import { getFileType } from "@/utils/utils";
import { FileIcon, defaultStyles } from "react-file-icon";
import { FormProvider, useForm } from "react-hook-form";
import {
  CambiarEstadoPostulanteForm,
  cambiarEstadoPostulanteValidationSchema,
} from "@/forms/CambiarEstadoPostulanteForm";
import { yupResolver } from "@hookform/resolvers/yup";
import Modal from "@/components/Modal/Modal";
import ModificarEstadoPostulanteForm from "@/components/ModificarEstadoPostulanteForm/ModificarEstadoPostulanteForm";
import { EstadoPostulanteEnum } from "@/enums/EstadoPostulanteEnum";
import toast from "react-hot-toast";
import LlamadoInfoCard from "@/components/LlamadoInfoCard/LlamadoInfoCard";
import { Roles } from "@/enums/Roles";
import ModalConfirmation from "@/components/Modal/components/ModalConfirmation";
import AvatarSelector from "@/components/Inputs/AvatarSelector";
import { DEFAULT_USER_IMAGE } from "@/utils/userUtils";
import { AiOutlinePlus } from "react-icons/ai";
import AddFileLlamadoModal from "@/components/AddFileToPostulanteModal/AddFileToPostulanteModal";
import AddFilePostulanteModal from "@/components/AddFileToPostulanteModal/AddFileToPostulanteModal";
import { getLlamadoInfoById } from "@/controllers/llamadoController";
import Input from "@/components/Inputs/Input";
import useDownloadFile from "@/hooks/useDownloadFile";
import { Archivo, ArchivoFirma } from "types/llamado";
import { deleteArchivo } from "@/controllers/archivoController";

const colorVariants: any = {
  [EstadoPostulanteEnum.cumpleRequisito]: tw`bg-green`,
  [EstadoPostulanteEnum.enDua]: tw`bg-yellow-700`,
  [EstadoPostulanteEnum.noCumpleRequisito]: tw`bg-red-600`,
};

const Container = styled.div`
  ${tw`w-full px-5 pb-4 h-auto flex flex-col items-center justify-start gap-4`}
`;

const MainContainer = styled.div`
  ${tw`flex w-full flex-col gap-3 px-5 mb-5 items-center justify-center w-full`}
`;

const Content = styled.div`
  ${tw`flex flex-col items-center justify-start gap-5 md:w-5/6 w-full rounded-3xl overflow-hidden`}
`;

const TopSection = styled.section`
  ${tw`flex flex-col items-center justify-center w-full bg-white rounded-3xl shadow-md`}
`;

const BGImage = styled.div`
  ${tw`relative w-full h-36 overflow-hidden`}
`;

const NameAndStats = styled.div`
  ${tw`flex flex-col items-center justify-start w-full my-5 -mt-[100px]`}
`;

const BlurredCircle = styled.div`
  ${tw`flex justify-center items-center min-w-[200px] w-[200px] h-[200px] rounded-full backdrop-blur-3xl`}
`;

const ImageSelectorContainer = styled.div`
  ${tw`relative min-w-[180px] w-[100px] h-[180px]`}
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

const Row = styled.div`
  ${tw`w-full h-auto flex flex-row items-center justify-between flex-wrap`}
`;

const ActionsContainer = styled.div`
  ${tw`w-full h-auto flex gap-2 flex-row items-center justify-end`}
`;

const TagEstado = styled.span<{ estado: EstadoPostulanteEnum }>`
  ${tw`flex text-white py-1 px-2 rounded-xl`}
  ${({ estado }) => colorVariants[estado]}
`;

const PostulanteInLlamadoInfo = () => {
  const { downloadFile } = useDownloadFile();
  const { userInfo, handleSetLoading } = useGlobal();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showChangeStateModal, setShowChangeStateModal] = useState(false);
  const [openModalAdd, setOpenModalAdd] = useState<boolean>();
  const [description, setDescription] = useState<string>("");
  const { query } = useRouter();
  const llamadoId = Number(query?.llamadoId || 0);
  const postulanteId = Number(query?.postulanteId || 0);
  const [handleDeleteArchivo] = useMutation(deleteArchivo);

  const { data, loading } = useQuery<{
    infoPostulanteEnLlamado?: PostulanteLlamadoFull;
  }>(infoPostulanteEnLlamado, {
    variables: {
      llamadoId: llamadoId,
      postulanteId: postulanteId,
    },
  });
  const [normalErrors, setNormalErrors] = useState<string[]>([]);
  const [cambiarEstadoPostulante] = useMutation(cambiarEstadoPostulanteLlamado);
  const [cambiarEstadoPostulanteTribunal] = useMutation(
    cambiarEstadoPostulanteLlamadoTribunal
  );
  const [openConfirmationDelete, setOpenConfirmationDelete] = useState<
    boolean
  >();
  const [selectedArchivoToDelete, setSelectedArchivoToDelete] = useState<
    Archivo | ArchivoFirma
  >();
  const client = useApolloClient();

  const cambiarEstadoPostulForm = useForm<CambiarEstadoPostulanteForm>({
    resolver: yupResolver(cambiarEstadoPostulanteValidationSchema()),
  });

  const { handleSubmit, reset } = cambiarEstadoPostulForm;

  const isLoading = loading;
  const postulanteInLlamadoInfo = data?.infoPostulanteEnLlamado;
  const postulanteInfo = data?.infoPostulanteEnLlamado?.postulante;
  const llamadoInfo = data?.infoPostulanteEnLlamado?.llamado;
  const archivos = data?.infoPostulanteEnLlamado?.archivos;
  const estadoActual = postulanteInLlamadoInfo?.estadoActual?.nombre;
  const notExistsPostulanteInLlamado = !postulanteInLlamadoInfo?.id;

  useEffect(() => {
    handleSetLoading(isLoading);
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  if (notExistsPostulanteInLlamado) {
    return <NotFoundPage />;
  }

  const handleNext = async (data: CambiarEstadoPostulanteForm) => {
    let allErrs: string[] = [];
    if (allErrs?.length > 0) {
      setNormalErrors(allErrs);
      return;
    }
    setNormalErrors([]);

    if (userInfo?.roles.find((rol) => rol === Roles.admin)) {
      handleSetLoading(true);
      const resp = await cambiarEstadoPostulante({
        variables: {
          data: {
            llamadoId: llamadoId,
            postulanteId: postulanteId,
            solicitanteId: userInfo?.id,
            nuevoEstado: data?.nuevoEstado,
            descripcion: description,
          },
        },
        refetchQueries: [
          {
            query: infoPostulanteEnLlamado,
            variables: {
              llamadoId: Number(llamadoId),
              postulanteId: Number(postulanteId),
            },
          },
          {
            query: getLlamadoInfoById,
            variables: {
              llamadoId: Number(llamadoId),
            },
          },
        ],
      });

      if (resp?.data?.cambiarEstadoPostulanteLlamado?.ok === true) {
        toast.success("Estado transicionado correctamente.", {});
        setShowChangeStateModal(false);
        reset();
      } else {
        resp?.data?.cambiarEstadoPostulanteLlamado.message
          ? toast.error(resp?.data?.cambiarEstadoPostulanteLlamado.message)
          : toast.error("Error al tansicionar de estado.");
      }

      handleSetLoading(false);
    } else if (userInfo?.roles.find((rol) => rol === Roles.tribunal)) {
      handleSetLoading(true);
      const resp = await cambiarEstadoPostulanteTribunal({
        variables: {
          data: {
            llamadoId: llamadoId,
            postulanteId: postulanteId,
            solicitanteId: userInfo?.id,
            nuevoEstado: data?.nuevoEstado,
            descripcion: description,
          },
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

      if (resp?.data?.cambiarEstadoPostulanteLlamadoTribunal?.ok === true) {
        toast.success(
          "Solicitud de cambio de estado enviada correctamente.",
          {}
        );
        setShowInfoModal(true);
        reset();
      } else {
        resp?.data?.cambiarEstadoPostulanteLlamadoTribunal.message
          ? toast.error(
              resp?.data?.cambiarEstadoPostulanteLlamadoTribunal.message
            )
          : toast.error("Error al solicitar transición de estado.");
      }

      handleSetLoading(false);
    }
  };

  const handleDownload = async (item: Archivo) => {
    handleSetLoading(true);
    await downloadFile(item.url, item.extension, item?.nombre);
    handleSetLoading(false);
  };

  const deleteFile = async () => {
    try {
      const resp = await handleDeleteArchivo({
        variables: {
          archivoId: selectedArchivoToDelete?.id,
        },
        refetchQueries: [
          {
            query: infoPostulanteEnLlamado,
            variables: {
              llamadoId: Number(llamadoId),
              postulanteId: Number(postulanteId),
            },
          },
          {
            query: getLlamadoInfoById,
            variables: {
              llamadoId: Number(llamadoId),
            },
          },
        ],
      });
      if (resp?.data?.deleteArchivo?.ok === true) {
        toast.success("Archivo eliminado correctamente");
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
      {showChangeStateModal && (
        <FormProvider {...cambiarEstadoPostulForm}>
          <Modal
            textok={"Cambiar estado"}
            textcancel="Cancelar"
            onSubmit={handleSubmit(handleNext)}
            onCancel={() => {
              setShowChangeStateModal(false);
              reset();
            }}
            setOpen={setShowChangeStateModal}
            title="Transicionar estado del postulante en el llamado"
            content={
              <FormProvider {...cambiarEstadoPostulForm}>
                <ModificarEstadoPostulanteForm
                  estadoActual={estadoActual as EstadoPostulanteEnum}
                  normalErrors={normalErrors}
                />
                <Input
                  label="Descrpcion del cambio de estado (Opcional)"
                  placeholder="Ingrese una descrpcion del cambio del estado"
                  variante="textarea"
                  required
                  value={description}
                  onChange={(val: any) => setDescription(val?.target?.value)}
                  isInvalid={false}
                  inputFormName={""}
                />
              </FormProvider>
            }
            description={
              "Se transicionará el estado actual del postulante en este llamado, a uno de los que selecciones a continuación."
            }
          />
        </FormProvider>
      )}
      {showInfoModal && (
        <ModalConfirmation
          variant="yellow"
          textok="Entendido"
          textcancel="Cancelar"
          onSubmit={() => {
            setShowInfoModal(false);
            setShowChangeStateModal(false);
          }}
          onCancel={() => setShowInfoModal(false)}
          setOpen={setShowInfoModal}
          title="Esta acción requiere aprobación de CDP"
          description="Recuerda que el cambio de estado será efectivo una vez que CDP lo apruebe."
        />
      )}
      <Topbar>
        <Breadcrumb title={`Información del postulante en el llamado`} />
        <ProfileBar />
      </Topbar>
      <MainContainer>
        <Content>
          <TopSection>
            <BGImage>
              <Image
                src="/img/loginBG.svg"
                alt="backgorund image"
                objectFit="cover"
                layout="fill"
                objectPosition="top"
              />
            </BGImage>
            <NameAndStats>
              <BlurredCircle>
                <ImageSelectorContainer>
                  <Image
                    src={DEFAULT_USER_IMAGE}
                    alt="Imagen posutlante"
                    objectFit="fill"
                    layout="fill"
                  />
                  {/* <AvatarSelector
                    defaultImage={DEFAULT_USER_IMAGE}
                    setFile={setSelectedFile}
                  /> */}
                </ImageSelectorContainer>
              </BlurredCircle>
              <span className="text-2xl font-bold">{`${postulanteInfo?.nombres} ${postulanteInfo?.apellidos}`}</span>
              <span className="text-textogris text-lg font-medium">
                Postulante
              </span>
              <div className="flex flex-col items-center">
                <span className="text-lg font-medium mt-5">
                  Estado actual en este llamado
                </span>
                <TagEstado estado={estadoActual as EstadoPostulanteEnum}>
                  {estadoActual}
                </TagEstado>

                <span className="text-lg font-medium mt-5">
                  Descripción del por que está en este estado:
                </span>
                <span className="md:w-1/2 mt-4 w-full text-center text-sm font-medium">
                  {data?.infoPostulanteEnLlamado?.descripcion || "No tiene"}
                </span>
                <Button
                  text="Transicionar Estado"
                  variant="outline"
                  action={() => setShowChangeStateModal(true)}
                  className="!py-2 !text-base mt-3"
                  sizeVariant="fit"
                />
              </div>
            </NameAndStats>
          </TopSection>
          <LlamadoInfoCard llamadoInfo={llamadoInfo} />
          <div className="flex flex-col gap-2 items-center justify-center w-full">
            <div className="flex justify-between w-full">
              <span className="self-start text-xl text-texto font-bold">
                Archivos del postulante en este llamado
              </span>
              <Button
                action={() => setOpenModalAdd(!openModalAdd)}
                icon={<AiOutlinePlus color="white" size={20} />}
                variant="fill"
                text="Agregar archivo"
              />
            </div>
            {/* TODO: Agregar archivo al postulante front y back */}
            <List>
              {archivos?.length === 0 && (
                <Text
                  className="!text-base"
                  text="Ooops!... Parece que este postulante no cuenta con archivos vinculados a este llamado."
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
          </div>
        </Content>
        {openModalAdd && (
          <AddFilePostulanteModal
            llamadoId={llamadoId}
            postulanteId={postulanteId}
            archivos={archivos || []}
            setOpen={setOpenModalAdd}
          />
        )}
      </MainContainer>
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
    </Container>
  );
};

export default PostulanteInLlamadoInfo;
