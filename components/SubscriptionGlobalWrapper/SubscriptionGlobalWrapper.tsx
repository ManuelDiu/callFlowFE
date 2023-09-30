import useGlobalLlamadosSubscription from "@/hooks/useGlobalLlamadosSubscription";
import useGlobalTemplateSubscription from "@/hooks/useGlobalTemplateSubscription";

const SubscriptionGlobalWrapper = ({ children }: any) => {
  useGlobalLlamadosSubscription();
  useGlobalTemplateSubscription();

  return children;
};

export default SubscriptionGlobalWrapper;
