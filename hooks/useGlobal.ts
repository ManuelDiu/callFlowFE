import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useGlobalActions } from "@/store/slices/GlobalSlice";
import { handleRemoveToken } from "@/utils/userUtils";
import appRoutes from "@/routes/appRoutes";

export function useGlobal() {
  const { handleSetUserInfo, handleSetToken, handleSetLoading } = useGlobalActions();
  const { userInfo, token, loading } = useSelector(
    (state: RootState) => state.GlobalSlice
  );
  const handleLogout = () => {
    handleRemoveToken();
    window.location.href = appRoutes.login();
  };

  return {
    userInfo,
    handleSetUserInfo,
    token,
    loading,
    handleSetToken,
    handleSetLoading,
    handleLogout,
  };
}
