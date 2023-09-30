import { useApolloClient, useQuery, useSubscription } from "@apollo/client";
import { useGlobal } from "./useGlobal";
import { useEffect } from "react";
import { listarTemplates, templateCreatedSubscription } from "@/controllers/templateController";
import { TemplateList } from "types/template";

const useGlobalTemplateSubscription = () => {
  const { data: newTemplateSubscriptionData } = useSubscription(
    templateCreatedSubscription
  );
  const { data, loading: loadingTemplates } = useQuery<{
    listarTemplates: TemplateList[];
  }>(listarTemplates);

  const client = useApolloClient();

  const { handleSetLoading } = useGlobal();

  useEffect(() => {
    handleSetLoading(loadingTemplates);
  }, [loadingTemplates]);

  useEffect(() => {
    if (newTemplateSubscriptionData?.templateCreado) {
      const templateCreado =
        newTemplateSubscriptionData?.templateCreado as TemplateList;
      const currentTemplates = (data?.listarTemplates as TemplateList[]) || [];
      const alreadyExists = currentTemplates.find((template) => {
        return template?.id === templateCreado?.id;
      });
      const formatTemplates = currentTemplates.map((item) => {
        if (item?.id === templateCreado?.id) {
          return templateCreado;
        } else {
          return item;
        }
      });

      const newListOfTemplates = alreadyExists
        ? formatTemplates
        : [
            {
              ...templateCreado,
              __typename: "TemplateList",
            },
            ...(currentTemplates || []),
          ];

      client.writeQuery({
        query: listarTemplates,
        data: {
          listarTemplates: newListOfTemplates,
        },
      });
    }
  }, [newTemplateSubscriptionData?.templateCreado]);

  return {};
};

export default useGlobalTemplateSubscription;
