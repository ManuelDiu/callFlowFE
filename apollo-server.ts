import { ApolloLink, HttpLink, createHttpLink, from, split } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { handleGetToken } from "utils/userUtils";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

const setAuthorizationHeader = () => {
  const token = handleGetToken();
  return {
    authorization: token ? `${token}` : "",
  };
};

// Crea un enlace de contexto para establecer el encabezado de autorización en todas las solicitudes
const authLink = setContext((_, { headers = {} }) => {
  const authorizationHeader = setAuthorizationHeader();
  return {
    headers: {
      ...authorizationHeader,
      ...headers,
    },
  };
});

const hasSubscriptionOperation = ({ query: { definitions } }: any) =>
  definitions.some(
    ({ kind, operation }: any) =>
      kind === 'OperationDefinition' && operation === 'subscription',
  )

const link = typeof window !== "undefined" ? ApolloLink.split(
  hasSubscriptionOperation,
  new WebSocketLink({
    uri: "ws://localhost:4000/graphql", // Reemplaza con la URL correcta del servidor WebSocket
    options: {
      reconnect: true, // Reintentar la conexión en caso de desconexión
    },
  }),
  authLink.concat(httpLink),
) : httpLink;

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link,
  defaultOptions: {
    watchQuery: {
      errorPolicy: "ignore",
    },
    query: {
      errorPolicy: "ignore",
    },
    mutate: {
      errorPolicy: "ignore",
    },
  },
});
