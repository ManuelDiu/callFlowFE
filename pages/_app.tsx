import Head from "next/head";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import "react-toastify/dist/ReactToastify.css";

import { ApolloProvider, useQuery } from "@apollo/client";
import { client } from "../apollo-server";
import { Provider } from "react-redux";
import store from "@/store/store";
import CheckTokenWrapper from "@/components/CheckTokenWrapper/CheckTokenWrapper";
import SubscriptionGlobalWrapper from "@/components/SubscriptionGlobalWrapper/SubscriptionGlobalWrapper";
import { useRouter } from "next/router";
import DisableNumberInputScroll from "@/utils/disableInputScroll";
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();

  return (
    <main className="font-primaria">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <DisableNumberInputScroll />
        <div className="bg-gray-100 w-full">
          <ApolloProvider client={client}>
            <Provider store={store}>
              <CheckTokenWrapper>
                <SubscriptionGlobalWrapper>
                  <Component {...pageProps} />
                </SubscriptionGlobalWrapper>
              </CheckTokenWrapper>
            </Provider>
          </ApolloProvider>
        </div>
    </main>
  );
}

export default MyApp;
