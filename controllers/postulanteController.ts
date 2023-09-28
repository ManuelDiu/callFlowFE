import { gql } from "@apollo/client";

export const listarPostulantes = gql`
  query {
    listarPostulantes {
      apellidos
      nombres
      id
      documento
    }
  }
`;
