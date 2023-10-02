import { Topbar } from "@/components/CheckTokenWrapper/CheckTokenWrapper";
import EtapasList from "@/components/EtapasList/EtapasList";
import FileLlamado from "@/components/FileLlamado/FileLlamado";
import LlamadoInfoContent from "@/components/LlamadoInfoContent/LlamadoInfoContent";
import NotFoundPage from "@/components/NotFoundPage/NotFoundPage";
import Tabs from "@/components/Tabs/Tabs";
import Breadcrumb from "@/components/Topbar/Breadcrumb";
import ProfileBar from "@/components/Topbar/ProfileBar";
import { getLlamadoInfoById } from "@/controllers/llamadoController";
import { useGlobal } from "@/hooks/useGlobal";
import { formatEtapas } from "@/utils/llamadoUtils";
import { TabItem } from "@/utils/utils";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { FullLlamadoInfo } from "types/llamado";

const Container = styled.div`
  ${tw`w-full px-5 pb-4 h-auto flex flex-col items-center justify-start gap-4`}
`;

const EtapaListContent = styled.div`
  ${tw`w-full h-auto flex items-center justify-center mt-5`}
`;

const LlamadoInfo = () => {
  const { query, pathname } = useRouter();
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
  console.log("llamadoInfo arriba", llamadoInfo)
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
      content: null,
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