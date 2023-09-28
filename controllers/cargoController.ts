import { gql } from "@apollo/client";

export const listarCargosList = gql`
  query {
    listarCargos {
      id
      nombre
    }
  }
`;
