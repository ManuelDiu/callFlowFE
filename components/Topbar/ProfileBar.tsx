import { useState } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import styled from "styled-components";
import tw from "twin.macro";

// Popups
import UserMenu from "@/components/Topbar/UserMenu";
import NotificationMenu from "./NotificationMenu";

// Icons
import { PiBell, PiMoon } from "react-icons/pi";

// Hooks
import { useGlobal } from "@/hooks/useGlobal";
import {
  listarAllHistoriales,
  listarLlamados,
} from "@/controllers/llamadoController";
import { HistorialLlamado, LlamadoList } from "types/llamado";
import { useQuery } from "@apollo/client";
import { UserList } from "types/usuario";
import { listUsers } from "@/controllers/userController";
import UserInfoLine from "../Table/components/UserInfoLine";
import Link from "next/link";
import appRoutes from "@/routes/appRoutes";
import ITRBubble from "../Table/components/ITRBubble";

const MainBarContainer = styled.div(() => [
  tw`flex justify-between items-center md:w-96 w-full h-16 px-4 py-1 rounded-[30px] bg-white`,
]);

const ButtonsContainer = styled.div(() => [tw`flex items-center gap-2`]);

const InputContainer = styled.div`
  ${tw`w-full flex z-[50] flex-grow h-auto relative`}
`;

const ResultsContainer = styled.div`
  ${tw`absolute bg-white w-[300px] max-h-[300px] overflow-auto top-full p-4 rounded-lg shadow-sm border border-gray-300 `}
`;

const ProfileButtonContainer = styled.div(() => [
  tw`items-center relative w-[35px] min-w-[35px] h-[35px] rounded-full `,
]);

const ProfileBar: NextPage = () => {
  const { userInfo } = useGlobal();
  const [searchbarContent, setSearchbarContent] = useState("");
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [hasNotifications, setHasNotifications] = useState<boolean>(true);
  const [showNotificationMenu, setShowNotificationMenu] = useState<boolean>(
    false
  );
  const { data } = useQuery<{
    listarLlamados: LlamadoList[];
  }>(listarLlamados, {
    variables: {},
  });

  const { data: listUsuarios } = useQuery<{ listUsuarios: UserList[] }>(
    listUsers
  );

  const llamados = data?.listarLlamados || [];
  const usuarios = listUsuarios?.listUsuarios || [];

  const hasSearchbarContent =
    searchbarContent !== null && searchbarContent !== "";

  const results = hasSearchbarContent
    ? [
        ...llamados?.filter((item) =>
          item?.nombre?.toLowerCase().includes(searchbarContent?.toLowerCase())
        ),
        ...usuarios?.filter(
          (user) =>
            user?.name
              ?.toLowerCase()
              ?.includes(searchbarContent?.toLowerCase()) ||
            user?.lastName
              ?.toLowerCase()
              ?.includes(searchbarContent?.toLowerCase())
        ),
      ]
    : [];

  const [focus, setFocus] = useState(false);
  const closeOpenedMenus = () => {
    if (showNotificationMenu) closeNotificationMenu();
    if (showUserMenu) closeUserMenu();
  };
  const openNotificationMenu = () => {
    closeOpenedMenus();
    setShowNotificationMenu(true);
  };
  const closeNotificationMenu = () => {
    setShowNotificationMenu(false);
  };
  const openUserMenu = () => {
    closeOpenedMenus();
    setShowUserMenu(true);
  };
  const closeUserMenu = () => {
    setShowUserMenu(false);
  };

  const handleSearchbarChange = (event: any) => {
    setSearchbarContent(event.target.value);
  };
  return (
    <MainBarContainer>
      <InputContainer>
        <input
          type="text"
          placeholder="Buscar llamados y usuarios"
          className="text-slate-700 w-full px-3 py-2 bg-[#F4F7FE] rounded-l-full rounded-r-full focus:ring-textogris ring-2 ring-transparent outline-none transition-all"
          value={searchbarContent}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onChange={handleSearchbarChange}
        />
        {hasSearchbarContent && (
          <ResultsContainer className="animationModal">
            {(!searchbarContent || searchbarContent === "") && (
              <span className="text-black-700 text-center w-full font-semibold">
                Busca llamados y usuarios
              </span>
            )}

            {hasSearchbarContent &&
              results?.map((res: any, index) => {
                const isLlamado = res?.__typename === "LlamadoList";

                if (isLlamado) {
                  return (
                    <Link
                      key={`llamado-${index}`}
                      href={appRoutes.llamadoInfo(res?.id)}
                    >
                      <div className="w-full gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all hover:bg-gray-100 h-auto flex flex-row items-center justify-start">
                        <span className="text-base font-medium text-gray-800">
                          {res?.nombre}
                        </span>
                        <ITRBubble itr={res?.itr} />
                      </div>
                    </Link>
                  );
                } else {
                  return (
                    <Link
                      href={appRoutes.userProfilePage(res?.id)}
                      key={`userInfoLine-${index}`}
                    >
                      <div>
                        <UserInfoLine
                          className="shadow-md w-full rounded-2xl p-4 cursor-pointer"
                          key={`userInfoLine-${index}`}
                          userImage={res?.imageUrl}
                          userName={res?.name}
                          userlastName={res?.lastName}
                        />
                      </div>
                    </Link>
                  );
                }
              })}

              {
                results?.length === 0 && <span>Sin resultados</span>
              }
          </ResultsContainer>
        )}
      </InputContainer>
      <ButtonsContainer>
        <div className="relative w-full">
          <button
            className={`flex justify-end p-2 rounded-full transition-all ${
              showNotificationMenu && " bg-principal"
            }`}
            onClick={(e) => {
              e.preventDefault();
              showNotificationMenu
                ? closeNotificationMenu()
                : openNotificationMenu();
            }}
          >
            {hasNotifications && (
              <div
                className={`absolute bg-principal w-[8px] h-[8px] rounded-full transition-all ${
                  showNotificationMenu && " bg-white"
                }`}
              />
            )}
            <PiBell
              size={22}
              className={`"w-max text-textogris transition-all ${
                showNotificationMenu && " text-white"
              }`}
            />
          </button>
          <NotificationMenu showNotificationMenu={showNotificationMenu} />
        </div>
        <button
          className={"p-2 rounded-full"}
          onClick={(e) => {
            e.preventDefault();
            /* showNotificationMenu
              ? closeNotificationMenu()
              : openNotificationMenu(); */
          }}
        >
          <PiMoon size={23} className="w-max text-textogris" />
        </button>
        <ProfileButtonContainer>
          <button
            onClick={(e) => {
              e.preventDefault();
              showUserMenu ? closeUserMenu() : openUserMenu();
            }}
          >
            <Image
              alt="Imágen del usuario logueado."
              src={userInfo?.imageUrl || ""}
              layout="fill"
              className="rounded-full h-auto border-none"
            />
          </button>
        </ProfileButtonContainer>
        <UserMenu showUserMenu={showUserMenu} />
      </ButtonsContainer>
    </MainBarContainer>
  );
};

export default ProfileBar;
