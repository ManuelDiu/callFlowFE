import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useGlobalActions } from "@/store/slices/GlobalSlice";
import { handleRemoveToken } from "@/utils/userUtils";
import appRoutes from "@/routes/appRoutes";
import { Roles } from "@/enums/Roles";

export function useGlobal() {
  const { handleSetUserInfo, handleSetToken, handleSetLoading, handleSetTemplate, handleClearTemplate } = useGlobalActions();
  const { userInfo, token, loading, selectedTemplate } = useSelector(
    (state: RootState) => state.GlobalSlice
  );
  const handleLogout = () => {
    handleRemoveToken();
    window.location.href = appRoutes.login();
  };
  const isAdmin = userInfo?.roles?.includes(Roles.admin);
  const isSolicitante = userInfo?.roles?.includes(Roles.cordinador);
  const isTribunal = userInfo?.roles?.includes(Roles.tribunal);

  return {
    userInfo,
    handleSetUserInfo,
    token,
    loading,
    handleSetToken,
    handleSetLoading,
    handleLogout,
    selectedTemplate,
    handleSetTemplate,
    handleClearTemplate,
    isAdmin,
    isSolicitante,
    isTribunal
  };
}
