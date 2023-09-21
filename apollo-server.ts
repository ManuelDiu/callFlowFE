import { HttpLink, createHttpLink } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { handleGetToken } from 'utils/userUtils';
import { setContext } from '@apollo/client/link/context';


const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});

const setAuthorizationHeader = () => {
  const token = handleGetToken();
  return {
      authorization: token ? `${token}` : '',
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


export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'ignore',
    },
    query: {
      errorPolicy: 'ignore',
    },
    mutate: {
      errorPolicy: 'ignore',
    },
  },
});