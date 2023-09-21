import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import styled from "styled-components";
import tw from "twin.macro";

type SidebarItem = {
  title: string;
  icon: JSX.Element;
  href: string;
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
  tw`rounded-3xl right-0 w-[6px] h-full `,
]);

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  const router = useRouter();

  return (
    <nav className="h-screen min-w-[288px] w-72 bg-white">
      <SidebarLogoContainer>
        <span className="font-medium text-black">
          CALL <span className="font-black text-principal">FLOW</span>
        </span>
      </SidebarLogoContainer>
      <ul className="flex flex-col gap-3">
        {items.map((item, index) => (
          <li key={index}>
            <Link href={item.href}>
              <a className="flex items-center h-12 justify-between space-x-2 pl-8 hover:bg-gray-100 hover:cursor-pointer transition-all duration-300 ease-in-out">
                <ItemContainer>
                  <IconContainer
                    variant={
                      router.pathname === item.href ? "principal" : "gris"
                    }
                  >
                    {item.icon}
                  </IconContainer>
                  <span
                    className={`font-semibold select-none ${
                      router.pathname === item.href
                        ? "text-texto"
                        : "text-textogris"
                    }`}
                  >
                    {item.title}
                  </span>
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
  );
};

export default Sidebar;
