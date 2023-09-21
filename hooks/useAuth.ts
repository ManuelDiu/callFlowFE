import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useGlobalActions } from "@/store/slices/GlobalSlice";

export function useAuth() {
  const { handleSetUserInfo, handleSetToken } = useGlobalActions();
  const { userInfo, token } = useSelector(
    (state: RootState) => state.GlobalSlice
  );

  return {
    userInfo,
    handleSetUserInfo,
    token,
    handleSetToken
  };
}
