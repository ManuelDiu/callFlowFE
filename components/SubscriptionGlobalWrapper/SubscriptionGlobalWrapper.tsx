import useGlobalLlamadosSubscription from "@/hooks/useGlobalLlamadosSubscription";

const SubscriptionGlobalWrapper = ({ children }: any) => {
  useGlobalLlamadosSubscription();


  return children;
};

export default SubscriptionGlobalWrapper;
