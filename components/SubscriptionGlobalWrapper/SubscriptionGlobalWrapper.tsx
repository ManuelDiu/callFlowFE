import {
  listarLlamados,
  llamadoSubscriptionCreated,
} from "@/controllers/llamadoController";
import { useGlobal } from "@/hooks/useGlobal";
import { useApolloClient, useQuery, useSubscription } from "@apollo/client";
import { useEffect } from "react";
import { LlamadoList } from "types/llamado";

const SubscriptionGlobalWrapper = ({ children }: any) => {
  const { data: newLlamadoSubscriptionData } = useSubscription(
    llamadoSubscriptionCreated
  );
  const { data, loading: loadingLlamados } = useQuery<{
    listarLlamados: LlamadoList[];
  }>(listarLlamados);

  const client = useApolloClient();

  const { handleSetLoading } = useGlobal();

  useEffect(() => {
    handleSetLoading(loadingLlamados);
  }, [loadingLlamados]);

  useEffect(() => {
    if (newLlamadoSubscriptionData?.llamadoCreado) {
      const llamadoCreado =
        newLlamadoSubscriptionData?.llamadoCreado as LlamadoList;
      const currentLlamados = (data?.listarLlamados as LlamadoList[]) || [];
      const alreadyExists = currentLlamados.find((llamado) => {
        return llamado?.id === llamadoCreado?.id;
      });
      const formatLmamados = currentLlamados.map((item) => {
        if (item?.id === llamadoCreado?.id) {
          return llamadoCreado;
        } else {
          return item;
        }
      });

      const newListOfLlamados = alreadyExists
        ? formatLmamados
        : [
            {
                ...llamadoCreado,
                __typename: "LlamadoList",
              },
            ...(currentLlamados || []),
          ];

      client.writeQuery({
        query: listarLlamados,
        data: {
          listarLlamados: newListOfLlamados,
        },
      });
    }
  }, [newLlamadoSubscriptionData?.llamadoCreado]);

  return children;
};

export default SubscriptionGlobalWrapper;
