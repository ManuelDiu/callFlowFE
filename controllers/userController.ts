import { gql } from "@apollo/client";

export const listUsers = gql`
  query {
    listUsuarios {
      id
      email
      imageUrl
      roles
      biografia
      telefono
      lastName
      llamados
      itr
      name
      activo
      documento
    }
  }
`;

export const createUser = gql`
  mutation createUser($createUserData: CrearUsuario!) {
    createUser(data: $createUserData) {
      ok
      message
      token
    }
  }
`;

export const createdUserSubscription = gql`
  subscription {
    userCreated {
      id
      biografia
      email
      imageUrl
      roles
      telefono
      lastName
      llamados
      itr
      name
      activo
      documento
    }
  }
`;

export const deleteUser = gql`
  mutation ($uid: Int) {
    disabledUser(uid: $uid) {
      ok
      message
    }
  }
`;

export const updateUserInfo = gql`
  mutation ($updaetUserInfo: UpdateUser) {
    updateUser(info: $updaetUserInfo) {
      message
      ok
    }
  }
`;

export const listarSolicitantes = gql`
  query {
    listarSolicitantes {
      name
      lastName
      imageUrl
      id
    }
  }
`;

export const listarMiembrosTribunal = gql`
  query {
    listarMiembrosTribunal {
      name
      id
      lastName
      imageUrl
    }
  }
`;
