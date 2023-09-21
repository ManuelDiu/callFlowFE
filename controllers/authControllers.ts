import { gql } from "@apollo/client";

export const loginGraph = gql`
  mutation Login($data: LoginCredentials!) {
    login(data: $data) {
      ok
      message
      token
    }
  }
`;

export const checkToken = gql`
  mutation GetUserInfo($token: String) {
    checkToken(token: $token) {
      biografia
      email
      roles
      itr
      telefono
      name
    }
  }
`;
