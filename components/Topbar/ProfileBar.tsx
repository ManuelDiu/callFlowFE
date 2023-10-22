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

const MainBarContainer = styled.div(() => [
  tw`flex justify-between items-center md:w-96 w-full h-16 px-4 py-1 rounded-[30px] bg-white`,
]);

const ButtonsContainer = styled.div(() => [tw`flex items-center gap-2`]);

const ProfileButtonContainer = styled.div(() => [
  tw`items-center relative w-[35px] h-[35px] rounded-full `,
]);

const ProfileBar: NextPage = () => {
  const { userInfo } = useGlobal();
  const [searchbarContent, setSearchbarContent] = useState("");
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [hasNotifications, setHasNotifications] = useState<boolean>(true);
  const [showNotificationMenu, setShowNotificationMenu] = useState<boolean>(
    false
  );
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
      <input
        type="text"
        placeholder="Buscar"
        className="text-slate-700 px-3 py-2 w-7/12 bg-[#F4F7FE] rounded-l-full rounded-r-full focus:ring-textogris ring-2 ring-transparent outline-none transition-all"
        value={searchbarContent}
        onChange={handleSearchbarChange}
      />
      <ButtonsContainer>
        <button
          className={`relative flex justify-end p-2 rounded-full transition-all ${
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
        <NotificationMenu showNotificationMenu={showNotificationMenu} />
        <UserMenu showUserMenu={showUserMenu} />
      </ButtonsContainer>
    </MainBarContainer>
  );
};

export default ProfileBar;
