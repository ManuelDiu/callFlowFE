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
import 'react-toastify/dist/ReactToastify.css';

import { ApolloProvider } from "@apollo/client";
import { client } from "../apollo-server";
import { Provider } from "react-redux";
import store from "@/store/store";
import CheckTokenWrapper from "@/components/CheckTokenWrapper/CheckTokenWrapper";

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <main className="min-h-screen flex flex-col font-primaria">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="flex h-full min-h-screen">
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
