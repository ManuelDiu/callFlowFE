import { gql } from "@apollo/client";

export const listarPostulantes = gql`
  query {
    listarPostulantes {
      apellidos
      nombres
      id
      documento
      updatedAt
    }
  }
`;

export const createPostulante = gql`
  mutation createPostulante($data: PostulanteItem!) {
    createPostulante(data: $data) {
      message
      ok
    }
  }
`;
export const updatePostulante = gql`
  mutation updatePostulante($data: UpdatePostulanteInput!) {
    updatePostulante(data: $data) {
      ok
      message
      postulante {
        nombres
        apellidos
        documento
      }
    }
  }
`;
export const deletePostulante = gql`
  mutation deletePostulante($data: DeletePostulanteInput!) {
    deletePostulante(data: $data) {
      ok
      message
    }
  }
`;
export const createdPostulanteSubscription = gql`
  subscription PostulanteCreated {
    postulanteCreated {
      postulante {
        id
        nombres
        apellidos
        documento
        updatedAt
      }
      operation
    }
  }
`;