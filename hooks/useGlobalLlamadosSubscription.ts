import { useApolloClient, useQuery, useSubscription } from "@apollo/client";
import { useGlobal } from "./useGlobal";
import { LlamadoList, PaginationLlamado } from "types/llamado";
import {
  listarLlamados,
  listarLlamadosPaged,
  llamadoSubscriptionCreated,
} from "@/controllers/llamadoController";
import { useEffect } from "react";
import useLlamadoFilters from "./useLlamadoFilters";

const useGlobalLlamadosSubscription = () => {
  const { offset, currentPage } = useLlamadoFilters();
  const { data: newLlamadoSubscriptionData } = useSubscription(
    llamadoSubscriptionCreated
  );
  const { data, loading: loadingLlamados } = useQuery<{
    listarLlamados: LlamadoList[];
  }>(listarLlamados, {
    fetchPolicy: "cache-and-network",
  });

  const {
    data: llamadosPaged,
    loading: loadingLlamadosPaged,
    refetch,
  } = useQuery<{
    listarLlamadosPaged: PaginationLlamado;
  }>(listarLlamadosPaged, {
    variables: {
      pagination: {
        offset: offset,
        currentPage: currentPage,
      },
    },
  });

  const client = useApolloClient();

  const { handleSetLoading } = useGlobal();

  useEffect(() => {
    handleSetLoading(loadingLlamados || loadingLlamadosPaged);
  }, [loadingLlamados, loadingLlamadosPaged]);

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

  useEffect(() => {
    if (newLlamadoSubscriptionData?.llamadoCreado) {
      const llamadoCreado =
        newLlamadoSubscriptionData?.llamadoCreado as LlamadoList;
      const currentLlamados =
        (llamadosPaged?.listarLlamadosPaged?.llamados as LlamadoList[]) || [];
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
        : (llamadosPaged?.listarLlamadosPaged?.llamados?.length || 0) <= offset ? [
            {
              ...llamadoCreado,
              __typename: "LlamadoList",
            },
            ...(currentLlamados || []),
          ]: currentLlamados;

      client.writeQuery({
        query: listarLlamadosPaged,
        data: {
          listarLlamadosPaged: {
            totalPages: llamadosPaged?.listarLlamadosPaged?.totalPages,
            llamados: newListOfLlamados,
          },
        },
      });
    }
  }, [newLlamadoSubscriptionData?.llamadoCreado]);

  return {};
};

export default useGlobalLlamadosSubscription;
