import Head from "next/head";
import "../styles/globals.css";
import type { AppProps } from "next/app";

import { AiFillHome } from "react-icons/ai";
import { PiClipboardTextDuotone } from "react-icons/pi";
import { MdOutlineCategory } from "react-icons/md";
import { ImInsertTemplate } from "react-icons/im";
import { PiUserDuotone } from "react-icons/pi";
import { PiUsersThreeDuotone } from "react-icons/pi";
import { PiFilePlusLight } from "react-icons/pi";
import { MdOutlineWorkOutline } from "react-icons/md";
import appRoutes from "../routes/appRoutes";

import { useRouter } from "next/router";
import { ApolloProvider, gql, useMutation } from "@apollo/client";
import { client } from "../apollo-server";
import Sidebar from "@/components/Sidebar";
import { useEffect } from "react";
import { Provider } from "react-redux";
import store from "@/store/store";
import CheckTokenWrapper from "@/components/CheckTokenWrapper/CheckTokenWrapper";
import { public_routes } from "utils/routes";

const items = [
  { title: "Inicio", icon: <AiFillHome size={24} />, href: "/" },
  {
    title: "Llamados",
    icon: <PiClipboardTextDuotone size={24} />,
    href: "/about",
  },
  { title: "Plantillas", icon: <ImInsertTemplate size={24} />, href: "/about" },
  { title: "Postulantes", icon: <PiUserDuotone size={24} />, href: "/about" },
  {
    title: "Categorías",
    icon: <MdOutlineCategory size={24} />,
    href: "/about",
  },
  { title: "Cargos", icon: <MdOutlineWorkOutline size={24} />, href: "/about" },
  {
    title: "Usuarios",
    icon: <PiUsersThreeDuotone size={24} />,
    href: "/about",
  },
  {
    title: "Tipos de Archivo",
    icon: <PiFilePlusLight size={24} />,
    href: "/about",
  },
];

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();

  const isPublicPath = public_routes.includes(pathname);

  return (
    <main className="min-h-screen flex flex-col font-primaria">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="flex h-full min-h-screen">
          <Sidebar items={items} />
          <div className="bg-gray-100 flex-grow">
          <ApolloProvider client={client}>
            <Provider store={store}>
              <CheckTokenWrapper>
                <Component {...pageProps} />
              </CheckTokenWrapper>
            </Provider>
          </ApolloProvider>
        </div>
      </div>
    </main>
  );
}

export default MyApp;
