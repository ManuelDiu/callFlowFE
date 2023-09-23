import { gql } from "@apollo/client";

export const listUsers = gql`
  query {
    listUsuarios {
      email
      imageUrl
      roles
      telefono
      lastName
      llamados
      itr
      name
      activo
    }
  }
`;
