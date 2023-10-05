import { Topbar } from "@/components/CheckTokenWrapper/CheckTokenWrapper";
import NotFoundPage from "@/components/NotFoundPage/NotFoundPage";
import Breadcrumb from "@/components/Topbar/Breadcrumb";
import ProfileBar from "@/components/Topbar/ProfileBar";
import { useGlobal } from "@/hooks/useGlobal";
import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";

import {
  infoPostulanteEnLlamado,
  cambiarEstadoPostulanteLlamado,
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
import { toast } from "react-toastify";
import LlamadoInfoCard from "@/components/LlamadoInfoCard/LlamadoInfoCard";

const colorVariants: any = {
  [EstadoPostulanteEnum.cumpleRequisito]: tw`bg-green`,
  [EstadoPostulanteEnum.enDua]: tw`bg-yellow-700`,
  [EstadoPostulanteEnum.noCumpleRequisito]: tw`bg-red-600`,
};

const Container = styled.div`
  ${tw`w-full px-5 pb-4 h-auto flex flex-col items-center justify-start gap-4`}
`;

const MainContainer = styled.div`
  ${tw`flex flex-col gap-3 px-5 mb-5 items-center justify-center w-full`}
`;

const Content = styled.div`
  ${tw`flex flex-col items-center justify-start gap-5 w-5/6 rounded-3xl overflow-hidden`}
`;

const TopSection = styled.section`
  ${tw`flex flex-col items-center justify-center w-full bg-white rounded-3xl shadow-md`}
`;

const BGImage = styled.div`
  ${tw`relative w-full h-36 overflow-hidden`}
`;

const NameAndStats = styled.div`
  ${tw`flex flex-col items-center justify-start w-full my-5`}
`;

const LlamadoInfoSection = styled.section`
  ${tw`flex flex-col items-start justify-center w-full px-10 py-6 gap-4 bg-white rounded-3xl shadow-md`}
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

const LlamadoInfo = () => {
  const [showChangeStateModal, setShowChangeStateModal] = useState(false);
  const { query } = useRouter();
  const llamadoId = Number(query?.llamadoId || 0);
  const postulanteId = Number(query?.postulanteId || 0);

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
  const { handleSetLoading } = useGlobal();

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
    handleSetLoading(true);

    if (true) {
      const resp = await cambiarEstadoPostulante({
        variables: {
          data: {
            llamadoId: llamadoId,
            postulanteId: postulanteId,
            nuevoEstado: data?.nuevoEstado,
          },
        },
      });

      if (resp?.data?.cambiarEstadoPostulanteLlamado?.ok === true) {
        toast.success("Estado transicionado correctamente.", {});
        setShowChangeStateModal(false);
      } else {
        resp?.data?.cambiarEstadoPostulanteLlamado.message
          ? toast.error(resp?.data?.cambiarEstadoPostulanteLlamado.message)
          : toast.error("Error al tansicionar de estado.");
      }

      handleSetLoading(false);
    }
  };

  return (
    <Container>
      {/* TODO: Controlar roles para ver si es necesaria la aprobación del cambio, y mostrar otro modal */}
      {showChangeStateModal && (
        <FormProvider {...cambiarEstadoPostulForm}>
          <Modal
            textok={"Cambiar estado"}
            textcancel="Cancelar"
            onSubmit={handleSubmit(handleNext)}
            onCancel={() => setShowChangeStateModal(false)}
            setOpen={setShowChangeStateModal}
            title="Transicionar estado del postulante en el llamado"
            content={
              <FormProvider {...cambiarEstadoPostulForm}>
                <ModificarEstadoPostulanteForm
                  estadoActual={estadoActual as EstadoPostulanteEnum}
                  normalErrors={normalErrors}
                />
              </FormProvider>
            }
            description="Se procederá a crear un nuevo tipo de archivo en el sistema."
          />
        </FormProvider>
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
            <span className="self-start text-xl text-texto font-bold">
              Archivos del postulante en este llamado
            </span>
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
                          //   onClick={() => handleDownload(archivo)}
                        >
                          <GoDownload color="#37B63C" size={20} />
                        </ActionWrapper>
                      </a>
                      <ActionWrapper
                        className="!border-red-500"
                        onClick={() => {
                          //   setOpenConfirmationDelete(true);
                          //   setSelectedArchivoToDelete(archivo);
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
      </MainContainer>
    </Container>
  );
};

export default LlamadoInfo;
