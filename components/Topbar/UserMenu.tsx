import React from "react";
import { useGlobal } from "@/hooks/useGlobal";
import Link from "next/link";
import appRoutes from "@/routes/appRoutes";

type UserMenuProps = {
  showUserMenu: boolean;
};

const UserMenu = ({ showUserMenu }: UserMenuProps) => {
  const { handleLogout } = useGlobal();

  return (
    <>
      <div
        className={
          (showUserMenu ? "block " : "hidden ") +
          "transition-all absolute top-[90px] bg-white text-base z-10 float-right py-2 list-none text-left rounded shadow-lg min-w-48"
        }
      >
        <Link href={appRoutes.home()}>
          <a className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700">
            Mi Perfil
          </a>
        </Link>
        <div className="h-0 my-2 border border-solid border-blueGray-100" />
        <button
          className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
          onClick={() => handleLogout()}
        >
          Cerrar sesión
        </button>
      </div>
    </>
  );
};

export default UserMenu;
