import { Topbar } from "@/components/CheckTokenWrapper/CheckTokenWrapper";
import EtapasList from "@/components/EtapasList/EtapasList";
import FileLlamado from "@/components/FileLlamado/FileLlamado";
import GrillaPDF from "@/components/GrillaPDF/GrillaPDF";
import HistorialLlamado from "@/components/HistorialLlamado/HistorialLlamado";
import PostulantesListContent from "@/components/ListOfPostulantes/PostulantesListContent/PostulantesListContent";
import ListOfUsers from "@/components/ListOfUsers/ListOfUsers";
import LlamadoInfoContent from "@/components/LlamadoInfoContent/LlamadoInfoContent";
import NotFoundPage from "@/components/NotFoundPage/NotFoundPage";
import Tabs from "@/components/Tabs/Tabs";
import Breadcrumb from "@/components/Topbar/Breadcrumb";
import ProfileBar from "@/components/Topbar/ProfileBar";
import { getLlamadoInfoById } from "@/controllers/llamadoController";
import { useGlobal } from "@/hooks/useGlobal";
import { formatEtapas, formatPostulantes } from "@/utils/llamadoUtils";
import { TabItem } from "@/utils/utils";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { FullLlamadoInfo } from "types/llamado";
import PostulantesResumen from "@/components/PostulantesResumenContent/PostulantesResumenContent";

const Container = styled.div`
${tw`w-full px-5 pb-4 h-auto flex flex-col items-center justify-start gap-4`}
`;

const EtapaListContent = styled.div`
${tw`w-full h-auto flex items-center flex-col gap-4 justify-center mt-5`}
`;

const LlamadoInfo = () => {
  const { query } = useRouter();
  const llamadoId = Number(query?.llamadoId || 0);
  
  const { data, loading } = useQuery<{ getLlamadoById?: FullLlamadoInfo }>(
    getLlamadoInfoById,
    {
      variables: {
        llamadoId: llamadoId,
      },
    }
  );
  const { handleSetLoading } = useGlobal();

  const isLoading = loading;
  const llamadoInfo = data?.getLlamadoById;
  const notExistsLlamado = !llamadoInfo?.id;

  useEffect(() => {
    handleSetLoading(isLoading);
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  if (notExistsLlamado) {
    return <NotFoundPage />;
  }

  const formattedEtapas = formatEtapas(llamadoInfo?.etapas);

  const items: TabItem[] = [
    {
      index: 1,
      title: "Información del llamado",
      content: <LlamadoInfoContent llamadoInfo={llamadoInfo} />,
    },
    {
      index: 2,
      title: "Historial",
      content: <HistorialLlamado llamadoId={llamadoInfo?.id} historiales={llamadoInfo?.historiales || []} />,
    },
    {
      index: 3,
      title: "Archivos",
      content: <FileLlamado llamadoInfo={llamadoInfo} />,
    },
    {
      index: 4,
      title: "Etapas",
      content: <EtapaListContent>
        <EtapasList isView etapas={formattedEtapas} setEtapas={null} />
      </EtapaListContent>,
    },
    {
      index: 5,
      title: "Postulantes",
      content: <PostulantesListContent
      title="Listado de postulantes"
      llamadoId={llamadoId}
      postulantes={formatPostulantes(llamadoInfo?.postulantes)}
    />,
    },
    {
      index: 6,
      title: "Resumen estado Postulantes",
      content: <PostulantesResumen llamadoInfo={llamadoInfo} />,
    },
  ];

  return (
    <Container>
      <Topbar>
        <Breadcrumb title={llamadoInfo?.nombre} />
        <ProfileBar />
      </Topbar>
      <Tabs items={items} />
    </Container>
  );
};

export default LlamadoInfo;
