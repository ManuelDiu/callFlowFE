import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useGlobalActions } from "@/store/slices/GlobalSlice";

export function useGlobal() {
  const { handleSetUserInfo, handleSetToken, handleSetLoading } = useGlobalActions();
  const { userInfo, token, loading } = useSelector(
    (state: RootState) => state.GlobalSlice
  );

  return {
    userInfo,
    handleSetUserInfo,
    token,
    loading,
    handleSetToken,
    handleSetLoading,
  };
}
