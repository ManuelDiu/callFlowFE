import { checkToken } from "@/controllers/authControllers";
import appRoutes from "@/routes/appRoutes";
import { useMutation } from "@apollo/client";
import { useGlobal } from "@/hooks/useGlobal";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { UsuarioInfo } from "types/usuario";
import { public_routes, tribunal_routes } from "@/utils/routes";
import Sidebar from "../Sidebar";
import { items, itemsTribunalOrCordinador } from "@/utils/sidebar";
import styled from "styled-components";
import tw from "twin.macro";
import Spinner from "../Spinner/Spinner";
import { Roles } from "@/enums/Roles";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import { useWindowDimensions } from "@/hooks/useWindowDimensions";
import { Toaster } from "react-hot-toast";

interface Props {
  children: any;
}

const MainContent = styled.div`
  ${tw`w-screen h-auto min-w-full min-h-full flex flex-row items-start justify-start`}
`;

const ContentPage = styled.div<{ withPadding: boolean }>`
  ${tw`w-full h-auto flex flex-col flex-grow`}
  ${({ withPadding }) => withPadding && tw`mt-[80px]`}
`;

export const Topbar = styled.div`
  ${tw`flex md:flex-row flex-col gap-2 justify-between py-5 w-full h-max`}
`;

let isChecking = false;

const CheckTokenWrapper = ({ children }: Props) => {
  const { token, handleSetUserInfo, userInfo, loading, handleSetLoading } =
    useGlobal();
  const [checking, setChecking] = useState<boolean>(true);
  const [getUserInfo, { loading: loadingUserInfo }] = useMutation(checkToken);
  const { pathname, push } = useRouter();
  const isPublicPath = public_routes.includes(pathname);
  const [invalidPath, setIsInvalidPath] = useState(false);
  const isAdmin = userInfo?.roles?.includes(Roles.admin);
  const isTribunal = userInfo?.roles?.includes(Roles.tribunal);
  const isCordinador = userInfo?.roles?.includes(Roles.cordinador);
  const { isMobile } = useWindowDimensions();

  const handleCheckToken = async () => {
    setChecking(true);
    if (isChecking) {
      return;
    }
    isChecking = true;
    const resp = await getUserInfo({
      variables: {
        token: token,
      },
    });
    if (!resp?.data?.checkToken) {
      // no authenticated
      if (!isPublicPath) {
        await push(appRoutes.login());
      }
      setChecking(false);
      isChecking = false;
    } else {
      const userInfo = resp?.data?.checkToken as UsuarioInfo;
      handleSetUserInfo(userInfo);
      if (isPublicPath) {
        await push(appRoutes.home());
      }
      setChecking(false);
      isChecking = false;
    }
  };

  useEffect(() => {
    if (!loading && !userInfo) {
      handleCheckToken();
    }
  }, [userInfo, token]);

  useEffect(() => {
    handleSetLoading(checking || loadingUserInfo);
  }, [checking, loadingUserInfo]);

  useEffect(() => {
    if ((isTribunal || isCordinador) && !isAdmin) {
      const isValidPath = tribunal_routes.includes(pathname);
      setIsInvalidPath(!isValidPath);
    } else {
      setIsInvalidPath(false);
    }
  }, [pathname, isTribunal, isCordinador]);

  if (checking) {
    return null;
  }

  return (
    <MainContent data-testid="CheckTokenWrapper">
      {loading && <Spinner />}

      {!isPublicPath && (
        <Sidebar items={isAdmin ? items : itemsTribunalOrCordinador} />
      )}
      <div className="z-[9999999]">
        <Toaster containerClassName="z-[]" />
      </div>
      <ContentPage withPadding={!isPublicPath && isMobile}>
        {invalidPath ? <NotFoundPage /> : children}
      </ContentPage>
    </MainContent>
  );
};

export default CheckTokenWrapper;
