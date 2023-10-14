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
  guardarPuntajesPostulanteEnLlamado,
} from "@/controllers/postulanteController";
import {
  getEtapaActualPostInLlamado,
  avanzarEtapaPostulanteInLlamado,
} from "@/controllers/llamadoController";
import { PostulanteLlamadoFull } from "types/postulante";
import Image from "next/image";
import Button from "@/components/Buttons/Button";
import { EstadoPostulanteEnum } from "@/enums/EstadoPostulanteEnum";
import { toast } from "react-toastify";
import ModalConfirmation from "@/components/Modal/components/ModalConfirmation";
import { DEFAULT_USER_IMAGE } from "@/utils/userUtils";
import SubEtapaListGrilla from "@/components/EtapasList/SubEtapaList/SubEtapaListGrilla";
import {
  AvanzarEtapaPostulanteData,
  DataGrilla,
  EtapaGrilla,
  RequisitoGrillaInput,
  SubEtapaGrilla,
} from "types/etapa";

const colorVariants: any = {
  [EstadoPostulanteEnum.cumpleRequisito]: tw`bg-green`,
  [EstadoPostulanteEnum.enDua]: tw`bg-yellow-700`,
  [EstadoPostulanteEnum.noCumpleRequisito]: tw`bg-red-600`,
};

const Container = styled.div`
  ${tw`w-full px-5 pb-4 h-auto flex flex-col items-center justify-start gap-4`}
`;

const MainContainer = styled.div`
  ${tw`flex flex-col w-full gap-3 p-5 items-center justify-start bg-white rounded-2xl shadow-md`}
`;

const NameAndImage = styled.div`
  ${tw`flex flex-col items-center justify-start w-full my-2 gap-2`}
`;

const BlurredCircle = styled.div`
  ${tw`flex justify-center items-center min-w-[180px] w-[180px] h-[180px] rounded-full bg-principal/20`}
`;

const ImageContainer = styled.div`
  ${tw`relative min-w-[160px] min-h-[160px] w-[160px] h-[160px]`}
`;

const EtapaListContent = styled.div`
  ${tw`w-full h-auto flex items-center flex-col gap-4 justify-center`}
`;

const SaveButtons = styled.div`
  ${tw`flex justify-around w-full`}
`;

const EtapaContainer = styled.div`
  ${tw`w-full relative pt-8 p-6 h-auto flex flex-col items-center justify-start gap-y-4 bg-white rounded-2xl shadow-md`}
`;

const SectionTitle = styled.h2`
  ${tw`text-2xl w-full text-left font-semibold text-texto`}
`;

enum saveOptions {
  guardar = "GUARDAR",
  guardarYAvanzar = "GUARDAR Y AVANZAR",
}

const PostulanteInLlamadoInfo = () => {
  const { userInfo, handleSetLoading } = useGlobal();
  const [guardarPuntajes] = useMutation(guardarPuntajesPostulanteEnLlamado);
  const [avanzarEtapaPostulante] = useMutation(avanzarEtapaPostulanteInLlamado);
  const [showConfirmGuardarModal, setShowConfirmGuardarModal] = useState(false);
  const [showConfirmAvanzarModal, setShowConfirmAvanzarModal] = useState(false);
  const [errores, setErrores] = useState<boolean>(false);
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

  const { data: etapaData, loading: etapaDataLoading } = useQuery<{
    getEtapaActualPostInLlamado?: EtapaGrilla;
  }>(getEtapaActualPostInLlamado, {
    variables: {
      llamadoId: llamadoId,
      postulanteId: postulanteId,
    },
  });

  const [subetapas, setSubetapas] = useState<SubEtapaGrilla[] | []>([]);

  const postulanteInLlamadoInfo = data?.infoPostulanteEnLlamado;
  const etapa = etapaData?.getEtapaActualPostInLlamado;

  const notExistsPostulanteInLlamado = !postulanteInLlamadoInfo?.id;

  useEffect(() => {
    if (etapa) {
      setSubetapas(etapa.subetapas);
    }
  }, [etapa]);

  useEffect(() => {
    handleSetLoading(loading || etapaDataLoading);
  }, [loading, etapaDataLoading]);

  if (loading || etapaDataLoading) {
    return null;
  }

  if (notExistsPostulanteInLlamado) {
    return <NotFoundPage />;
  }

  const handleGuardarPuntajes = async (saveOperation: saveOptions) => {
    if (errores) {
      return;
    }
    const dataToSend: DataGrilla = {
      llamadoId: llamadoId,
      postulanteId: postulanteId,
      requisitos:
        subetapas
          ?.map((currSub) =>
            currSub?.requisitos?.map(
              (currReq) =>
                ({
                  id: currReq?.id,
                  nuevoPuntaje: Number(currReq?.puntaje || 0),
                } as RequisitoGrillaInput)
            )
          )
          .flat() || [],
    };
    handleSetLoading(true);
    let options;
    if (saveOperation === saveOptions.guardar) {
      options = {
        variables: {
          data: dataToSend,
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
            query: getEtapaActualPostInLlamado,
            variables: {
              llamadoId: Number(llamadoId),
              postulanteId: Number(postulanteId),
            },
          },
        ],
      };
    } else if (saveOperation === saveOptions.guardarYAvanzar) {
      // Opciones sin refetch ya q hago el refetch en el otro api call.
      options = {
        variables: {
          data: dataToSend,
        },
      };
    }
    const resp = await guardarPuntajes(options);
    if (resp?.data?.guardarPuntajesPostulanteEnLlamado?.ok === true) {
      toast.success(
        "Se guardaron correctamente los puntajes para este postulante en este llamado."
      );
      handleSetLoading(false);
      setShowConfirmGuardarModal(false);
    } else {
      resp?.data?.guardarPuntajesPostulanteEnLlamado.message
        ? toast.error(resp?.data?.guardarPuntajesPostulanteEnLlamado.message)
        : toast.error("Error al intentar guardar los puntajes del postulante.");
      handleSetLoading(false);
      return;
    }

    if (saveOperation === saveOptions.guardarYAvanzar) {
      const dataAvanzar: AvanzarEtapaPostulanteData = {
        llamadoId: llamadoId,
        postulanteId: postulanteId,
        currentEtapa: Number(etapa?.currentEtapa || 0)
      };
      const resp = await avanzarEtapaPostulante({
        variables: {
          data: dataAvanzar,
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
            query: getEtapaActualPostInLlamado,
            variables: {
              llamadoId: Number(llamadoId),
              postulanteId: Number(postulanteId),
            },
          },
        ],
      });
      if (resp?.data?.avanzarEtapaPostulanteInLlamado?.ok === true) {
        toast.success("Se avanzó la etapa del postulante en el llamado.");
        handleSetLoading(false);
        setShowConfirmAvanzarModal(false);
      } else {
        resp?.data?.avanzarEtapaPostulanteInLlamado.message
          ? toast.error(resp?.data?.avanzarEtapaPostulanteInLlamado.message)
          : toast.error(
              "Error al intentar avanzar la etapa del postulante en el llamado."
            );
        handleSetLoading(false);
      }
    }
  };
  return (
    <Container>
      {showConfirmGuardarModal && (
        <ModalConfirmation
          variant="green"
          textok="Guardar"
          textcancel="Cancelar"
          onSubmit={() => {
            handleGuardarPuntajes(saveOptions.guardar);
            setShowConfirmGuardarModal(false);
          }}
          onCancel={() => setShowConfirmGuardarModal(false)}
          setOpen={setShowConfirmGuardarModal}
          title="Estás a punto de guardar puntajes"
          description="Con esta acción, guardarás los puntajes de este postulante en este llamado."
        />
      )}
      {showConfirmAvanzarModal && (
        <ModalConfirmation
          variant="green"
          textok="Guardar"
          textcancel="Cancelar"
          onSubmit={() => {
            handleGuardarPuntajes(saveOptions.guardarYAvanzar);
            setShowConfirmAvanzarModal(false);
          }}
          onCancel={() => setShowConfirmAvanzarModal(false)}
          setOpen={setShowConfirmAvanzarModal}
          title="Estás a punto de guardar puntajes y avanzar etapa"
          description="Con esta acción, guardarás los puntajes del postulante y si es posible, se avanzará una etapa mientras el mismo cumpla con el mínimo puntaje de la actual, y aún haya alguna etapa restante."
        />
      )}
      <Topbar>
        <Breadcrumb title={`Completar grilla para un postulante`} />
        <ProfileBar />
      </Topbar>
      <MainContainer>
        <span className="font-black text-2xl text-texto">Postulante</span>
        <NameAndImage>
          <BlurredCircle className="">
            <ImageContainer>
              <Image
                src={DEFAULT_USER_IMAGE}
                alt="Imagen posutlante"
                objectFit="fill"
                layout="fill"
              />
            </ImageContainer>
          </BlurredCircle>
          <span className="text-texto text-lg font-semibold">{`${postulanteInLlamadoInfo?.postulante?.nombres} ${postulanteInLlamadoInfo?.postulante?.apellidos}`}</span>
        </NameAndImage>
        <div className="flex justify-between w-full">
          <div className="flex flex-col self-start">
            <span className="font-black text-2xl text-texto">
              {etapa?.nombre}
            </span>
            <span className="font-medium text-lg text-textogris">
              {`Etapa ${etapa?.currentEtapa} / ${etapa?.cantEtapas}`}
            </span>
          </div>
          <div className="flex flex-col self-end">
            <span className="text-end font-semibold text-xl text-texto">
              Puntaje Mínimo:
              <span className="text-red-600"> {etapa?.puntajeMin}</span>
            </span>
            <span className="text-end font-semibold text-xl text-texto">
              Puntaje actual del postulante en la etapa:
              <span className="text-green"> {etapa?.total}</span>
            </span>
          </div>
        </div>
      </MainContainer>
      <EtapaListContent>
        <EtapaContainer className="modalOpen group">
          <SectionTitle>Subetapa</SectionTitle>
          <SubEtapaListGrilla
            setSubEtapas={(values: any) => setSubetapas(values)}
            subetapas={subetapas}
            setErrores={setErrores}
          />
        </EtapaContainer>
      </EtapaListContent>
      <SaveButtons>
        <Button
          variant="outline"
          text="Guardar puntajes"
          action={() => setShowConfirmGuardarModal(true)}
          disabled={errores}
          className={errores ? "cursor-not-allowed opacity-40" : ""}
          title={errores ? "Corrige los errores antes de continuar." : ""}
        />
        <Button
          variant="fill"
          text="Guardar puntajes y avanzar etapa"
          action={() => setShowConfirmAvanzarModal(true)}
          disabled={errores}
          className={errores ? "cursor-not-allowed opacity-40" : ""}
          title={errores ? "Corrige los errores antes de continuar." : ""}
        />
      </SaveButtons>
    </Container>
  );
};

export default PostulanteInLlamadoInfo;
