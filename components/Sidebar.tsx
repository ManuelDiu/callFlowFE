import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import styled from "styled-components";
import tw from "twin.macro";
import { useGlobal } from "@/hooks/useGlobal";
import { Roles } from "@/enums/Roles";
import clsx from "clsx";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useWindowDimensions } from "../hooks/useWindowDimensions";
import { GiHamburgerMenu } from "react-icons/gi";
import appRoutes from "@/routes/appRoutes";

type SidebarItem = {
  title: string;
  icon: JSX.Element;
  href: string;
  validPath?: string[];
};

type SidebarProps = {
  items: SidebarItem[];
};

type TextVariants = "gris" | "principal" | "secundario";

interface ContainerProps {
  variant?: TextVariants;
}

const containerVariants = {
  gris: tw`text-textogris`,
  principal: tw`text-principal`,
  secundario: tw`text-texto`,
};

const SidebarLogoContainer = styled.div(() => [
  tw`flex md:justify-center cursor-pointer justify-between md:px-0 px-5 md:py-0 py-5 w-full md:my-14 text-3xl`,
]);

const IconContainer = styled.div<ContainerProps>(() => [
  tw`flex items-center justify-center w-8 h-8 `,
  ({ variant = "gris" }) => containerVariants[variant],
]);

const ItemContainer = styled.div(() => [
  tw`flex items-center justify-center gap-3 `,
]);

const CurrentItemIndicator = styled.div(() => [
  tw`rounded-3xl absolute right-0 w-[6px] h-full `,
]);

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  const router = useRouter();
  const { userInfo } = useGlobal();
  const [expanded, setExpanded] = useState(false);
  const { isMobile } = useWindowDimensions();

  useEffect(() => {
    setExpanded(false);
  }, [isMobile, router.pathname]);

  return (
    <div
      className={clsx(
        "transition-all fixed top-0 z-[40] md:w-auto w-screen md:h-screen md:sticky flex items-start justify-start",
        expanded && "h-full"
      )}
    >
      {!isMobile && (
        <div
          onClick={() => setExpanded(!expanded)}
          className="w-auto transition-all cursor-pointer h-auto absolute bg-indigo-50 z-10 top-5 -right-5 p-4 flex items-center justify-start rounded-full shadow-md"
        >
          <MdKeyboardArrowRight
            color="black"
            size={25}
            className={clsx(
              "transition-all transform",
              expanded ? "rotate-180" : "rotate-0"
            )}
          />
        </div>
      )}
      <nav
        className={clsx(
          "h-full bg-white transition-all mt-0 margin-0",
          !isMobile
            ? !expanded
              ? "min-w-[120px] w-[120px]"
              : "min-w-[288px] w-72"
            : !expanded
            ? "w-full h-[80px] flex items-center justify-center"
            : "w-full h-auto"
        )}
      >
        <SidebarLogoContainer>
          <Link href={appRoutes.home()}>
            <span
              className={clsx(
                "font-medium text-black flex items-center justify-center gap-2",
                expanded ? "text-3xl flex-row" : "text-sm flex-col",
                isMobile && "!flex-row !text-[20px]"
              )}
            >
              CALL <span className="font-black text-principal">FLOW</span>
            </span>
          </Link>

          {isMobile && (
            <GiHamburgerMenu
              color="#4318FF"
              className="cursor-pointer"
              onClick={() => setExpanded(!expanded)}
            />
          )}
        </SidebarLogoContainer>
        <ul
          className={clsx(
            "flex flex-col gap-3",
            isMobile && !expanded && "hidden"
          )}
        >
          {items.map((item, index) => (
            <li
              className={clsx(
                "flex w-full flex-row items-center",
                expanded ? "justify-start" : "justify-center m-auto"
              )}
              key={index}
            >
              <Link href={item.href}>
                <a
                  className={clsx(
                    "flex relative w-full items-center h-12 space-x-2 hover:bg-gray-100 hover:cursor-pointer transition-all duration-300 ease-in-out",
                    expanded ? "justify-between  pl-8" : "justify-center"
                  )}
                >
                  <ItemContainer>
                    <IconContainer
                      variant={
                        item?.validPath?.includes(router.pathname)
                          ? "principal"
                          : "gris"
                      }
                    >
                      {item.icon}
                    </IconContainer>
                    {expanded && (
                      <span
                        className={`font-semibold select-none ${
                          item?.validPath?.includes(router.pathname)
                            ? "text-texto"
                            : "text-textogris"
                        }`}
                      >
                        {item.title}
                      </span>
                    )}
                  </ItemContainer>
                  <CurrentItemIndicator
                    className={`${
                      router.pathname === item.href && "bg-principal"
                    }`}
                  ></CurrentItemIndicator>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
