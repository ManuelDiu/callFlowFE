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

export const resetPassword = gql`
  mutation ResetPass($info: ResetPasswordInput!) {
    resetPassword(info: $info) {
      ok
      message
    }
  }
`;


export const forgetPassword = gql`
  mutation ($data: ForgetPasswordInput!) {
    forgetPassword(info: $data) {
      ok
      message
    }
  }
`;
