import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import styled from "styled-components";
import tw from "twin.macro";
import { useGlobal } from "@/hooks/useGlobal";
import { Roles } from "@/enums/Roles";
import clsx from "clsx";
import { MdKeyboardArrowRight } from "react-icons/md";

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
  tw`flex justify-center w-full my-14 text-3xl`,
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

  return (
    <div
      className={clsx("relative w-auto h-full flex items-start justify-start")}
    >
      <div
        onClick={() => setExpanded(!expanded)}
        className="w-auto cursor-pointer h-auto absolute bg-indigo-100 z-10 top-5 -right-5 p-4 flex items-center justify-start rounded-full shadow-md"
      >
        <MdKeyboardArrowRight
          color="black"
          size={25}
          className={clsx(
            "transition-all transform",
            expanded ? "rotate-0" : "rotate-180"
          )}
        />
      </div>
      <nav
        className={clsx(
          "h-full bg-white mt-0 margin-0",
          !expanded ? "min-w-[120px] w-[120px]" : "min-w-[288px] w-72"
        )}
      >
        <SidebarLogoContainer>
          <span className={clsx(
            "font-medium text-black flex items-center justify-center gap-2",
            expanded ? "text-3xl flex-row" : "text-sm flex-col"
          )}>
            CALL <span className="font-black text-principal">FLOW</span>
          </span>
        </SidebarLogoContainer>
        <ul className="flex flex-col gap-3">
          {items.map((item, index) => (
            <li className={clsx("flex w-full flex-row items-center", expanded ? "justify-start" : "justify-center m-auto")} key={index}>
              <Link href={item.href}>
                <a className={clsx("flex relative w-full items-center h-12 space-x-2 hover:bg-gray-100 hover:cursor-pointer transition-all duration-300 ease-in-out",
                expanded ? "justify-between  pl-8" : "justify-center"
                )}>
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
                    {expanded && <span
                      className={`font-semibold select-none ${
                        item?.validPath?.includes(router.pathname)
                          ? "text-texto"
                          : "text-textogris"
                      }`}
                    >
                      {item.title}
                    </span>}
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
