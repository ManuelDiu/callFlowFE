import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";

type SidebarItem = {
  title: string;
  icon: JSX.Element;
  href: string;
};

type SidebarProps = {
  items: SidebarItem[];
};

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  const router = useRouter();

  return (
    <nav className="h-screen w-72 bg-white">
      <div className="flex justify-center w-full my-14 text-3xl">
        <span className="font-medium text-black">
          CALL <span className="font-black text-principal">FLOW</span>
        </span>
      </div>
      <ul className="flex flex-col gap-3">
        {items.map((item, index) => (
          <li key={index}>
            <Link href={item.href}>
                <a className="flex items-center h-12 justify-between space-x-2 pl-8 hover:bg-gray-100 hover:cursor-pointer transition-all duration-300 ease-in-out">
                  <div className="flex items-center justify-center gap-3">
                    <div
                      className={`flex items-center justify-center w-8 h-8 ${
                        router.pathname === item.href
                          ? "text-principal"
                          : "text-textogris"
                      }`}
                    >
                      {item.icon}
                    </div>
                    <span
                      className={`font-semibold select-none ${
                        router.pathname === item.href
                          ? "text-texto"
                          : "text-textogris"
                      }`}
                    >
                      {item.title}
                    </span>
                  </div>
                  <div
                    className={`rounded-3xl right-0 w-[6px] h-full ${
                      router.pathname === item.href ? "bg-principal" : ""
                    }`}
                  ></div>
                </a>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
