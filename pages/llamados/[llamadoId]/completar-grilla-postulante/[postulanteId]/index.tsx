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
  cambiarEstadoPostulanteLlamadoTribunal,
} from "@/controllers/postulanteController";
import { PostulanteLlamadoFull } from "types/postulante";
import Image from "next/image";
import Button from "@/components/Buttons/Button";
import { useForm } from "react-hook-form";
import {
  CambiarEstadoPostulanteForm,
  cambiarEstadoPostulanteValidationSchema,
} from "@/forms/CambiarEstadoPostulanteForm";
import { yupResolver } from "@hookform/resolvers/yup";
import { EstadoPostulanteEnum } from "@/enums/EstadoPostulanteEnum";
import { toast } from "react-toastify";
import { Roles } from "@/enums/Roles";
import ModalConfirmation from "@/components/Modal/components/ModalConfirmation";
import { DEFAULT_USER_IMAGE } from "@/utils/userUtils";
import EtapasList from "@/components/EtapasList/EtapasList";
import { formatEtapas } from "@/utils/llamadoUtils";

const colorVariants: any = {
  [EstadoPostulanteEnum.cumpleRequisito]: tw`bg-green`,
  [EstadoPostulanteEnum.enDua]: tw`bg-yellow-700`,
  [EstadoPostulanteEnum.noCumpleRequisito]: tw`bg-red-600`,
};

const etapas = [
  {
    id: 2,
    total: 100,
    puntajeMin: 30,
    plazoDias: 5,
    nombre: "Etapa 1",
    subetapas: [
      {
        requisitos: [
          {
            puntajeSugerido: 50,
            nombre: "Requisitooo 1",
            excluyente: false,
            __typename: "RequisitoList",
          },
        ],
        puntajeTotal: 0,
        puntajeMaximo: 50,
        nombre: "subetapa 1",
        __typename: "SubEtapaList",
      },
    ],
    __typename: "EtapaList",
  },
];

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

const PostulanteInLlamadoInfo = () => {
  const { userInfo, handleSetLoading } = useGlobal();
  const [showConfirmGuardarModal, setShowConfirmGuardarModal] = useState(false);
  const [showConfirmAvanzarModal, setShowConfirmAvanzarModal] = useState(false);
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
  const [cambiarEstadoPostulanteTribunal] = useMutation(
    cambiarEstadoPostulanteLlamadoTribunal
  );

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

  // TODO: Tomar etapas del back, y eliminar la colección local.
  const formattedEtapas = formatEtapas(etapas);
  const [currentEtapas, setCurrentEtapas] = useState(etapas);

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
          },
        },
      });

      if (resp?.data?.cambiarEstadoPostulanteLlamado?.ok === true) {
        toast.success("Estado transicionado correctamente.", {});
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
          },
        },
      });

      if (resp?.data?.cambiarEstadoPostulanteLlamadoTribunal?.ok === true) {
        toast.success(
          "Solicitud de cambio de estado enviada correctamente.",
          {}
        );
        setShowConfirmGuardarModal(true);
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

  return (
    <Container>
      {showConfirmGuardarModal && (
        <ModalConfirmation
          variant="green"
          textok="Guardar"
          textcancel="Cancelar"
          onSubmit={() => {
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
          <span className="text-texto text-lg font-semibold">Manuel Diu</span>
        </NameAndImage>
        <div className="flex justify-between w-full">
          <div className="flex flex-col self-start">
            <span className="font-black text-2xl text-texto">
              Etapa 1 - Estudio de Méritos
            </span>
            <span className="font-medium text-lg text-textogris">
              Etapa 1 / 3
            </span>
          </div>
          <div className="flex flex-col self-end">
            <span className="text-end font-semibold text-xl text-texto">
              Puntaje Mínimo: <span className="text-red-600">50</span>
            </span>
            <span className="text-end font-semibold text-xl text-texto">
              Puntaje actual del postulante en la etapa:{" "}
              <span className="text-green">45</span>
            </span>
          </div>
        </div>
      </MainContainer>
      <EtapaListContent>
        <EtapasList etapas={formattedEtapas} setEtapas={setCurrentEtapas} />
      </EtapaListContent>
      <SaveButtons>
        <Button
          variant="outline"
          text="Guardar puntajes"
          action={() => setShowConfirmGuardarModal(true)}
        />
        <Button
          variant="fill"
          text="Guardar puntajes y avanzar etapa"
          action={() => setShowConfirmAvanzarModal(true)}
        />
      </SaveButtons>
    </Container>
  );
};

export default PostulanteInLlamadoInfo;
