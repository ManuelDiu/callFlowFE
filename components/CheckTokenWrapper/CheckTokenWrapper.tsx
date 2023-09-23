import { checkToken } from "@/controllers/authControllers";
import appRoutes from "@/routes/appRoutes";
import { useMutation } from "@apollo/client";
import { useGlobal } from "hooks/useGlobal";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { UsuarioInfo } from "types/usuario";
import { public_routes } from "utils/routes";
import Sidebar from "../Sidebar";
import { items } from "utils/sidebar";
import styled from "styled-components";
import tw from "twin.macro";
import { ToastContainer } from "react-toastify";
import Spinner from "../Spinner/Spinner";
import Breadcrumb from "@/components/Topbar/Breadcrumb";
import ProfileBar from "@/components/Topbar/ProfileBar";

interface Props {
  children: any;
}

const MainContent = styled.div`
  ${tw`w-screen h-screen min-w-full min-h-full flex flex-row items-start justify-start`}
`;

const ContentPage = styled.div`
  ${tw`w-full h-full max-h-full overflow-auto flex-grow`}
`;

const Topbar = styled.div`
  ${tw`flex justify-between p-5 w-full h-max`}
`;

let isChecking = false;

const CheckTokenWrapper = ({ children }: Props) => {
  const { token, handleSetUserInfo, userInfo, loading, handleSetLoading } =
    useGlobal();
  const [checking, setChecking] = useState<boolean>(true);
  const [getUserInfo, { loading: loadingUserInfo }] = useMutation(checkToken);
  const { pathname, push } = useRouter();
  const isPublicPath = public_routes.includes(pathname);

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

  if (checking) {
    return null;
  }

  return (
    <MainContent>
      {loading && <Spinner />}

      {!isPublicPath && <Sidebar items={items} />}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Same as */}
      <ToastContainer />
      <ContentPage>
        {/* {!isPublicPath && (
          <Topbar>
            <Breadcrumb title="asdasd" />
            <ProfileBar />
          </Topbar>
        )} */}
        {children}
      </ContentPage>
    </MainContent>
  );
};

export default CheckTokenWrapper;
