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

export const infoPostulanteEnLlamado = gql`
  query infoPostulanteEnLlamado($llamadoId: Int!, $postulanteId: Int!) {
    infoPostulanteEnLlamado(
      llamadoId: $llamadoId
      postulanteId: $postulanteId
    ) {
      id
      descripcion
      postulante {
        id
        nombres
        apellidos
        documento
        updatedAt
      }
      llamado {
        id
        nombre
        referencia
        cantidadHoras
        cupos
        itr
        cargo {
          id
          nombre
          tips
          updatedAt
        }
        updatedAt
      }
      archivos {
        id
        nombre
        url
        extension
        tipoArchivo {
          nombre
          origen
        }
      }
      estadoActual {
        id
        nombre
        updatedAt
      }
      updatedAt
    }
  }
`;

export const getPostulantesByLlamadoId = gql`
  query GetPostulantesByLlamadoId($llamadoId: Int!) {
    getPostulantesByLlamadoId(llamadoId: $llamadoId) {
      postulante {
        id
        nombres
        apellidos
        documento
        updatedAt
      }
      estadoActual {
        id
        nombre
        updatedAt
      }
      etapa {
        id
        nombre
        plazoDias
        puntajeMin
        total
        createdAt
        updatedAt
      }
      updatedAt
    }
  }
`;

export const cambiarEstadoPostulanteLlamado = gql`
  mutation cambiarEstadoPostulanteLlamado(
    $data: CambiarEstadoPostulanteLlamadoInput!
  ) {
    cambiarEstadoPostulanteLlamado(data: $data) {
      ok
      message
    }
  }
`;

export const cambiarEstadoPostulanteLlamadoTribunal = gql`
  mutation cambiarEstadoPostulanteLlamadoTribunal(
    $data: CambiarEstadoPostulanteLlamadoInput!
  ) {
    cambiarEstadoPostulanteLlamadoTribunal(data: $data) {
      ok
      message
    }
  }
`;

export const guardarPuntajesPostulanteEnLlamado = gql`
  mutation guardarPuntajesPostulanteEnLlamado($data: DataGrillaInput!) {
    guardarPuntajesPostulanteEnLlamado(data: $data) {
      message
      ok
    }
  }
`;

export const addFileToPostulante = gql`
  mutation($dataFile: AddFilePostulanteInput) {
    addFileToPostulante(info: $dataFile) {
      message
      ok
    }
  }
`;