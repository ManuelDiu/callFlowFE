import { gql } from "@apollo/client";

export const listCategorias = gql`
  query {
    listCategorias {
      nombre
      updatedAt
    }
  }
`;
