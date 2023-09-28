import { gql } from "@apollo/client";

export const listTiposArchivo = gql`
  query {
    listTiposArchivo {
      id
      nombre
      origen
      updatedAt
    }
  }
`;
export const createTipoArchivo = gql`
  mutation createTipoArchivo($data: TipoArchivoItem!) {
    createTipoArchivo(data: $data) {
      message
      ok
    }
  }
`;
export const updateTipoArchivo = gql`
  mutation updateTipoArchivo($data: UpdateTipoArchivoInput!) {
    updateTipoArchivo(data: $data) {
      ok
      message
      tipoArchivo {
        nombre
        origen
      }
    }
  }
`;
export const deleteTipoArchivo = gql`
  mutation deleteTipoArchivo($data: DeleteTipoArchivoInput!) {
    deleteTipoArchivo(data: $data) {
      ok
      message
    }
  }
`;
export const createdTipoArchivoSubscription = gql`
  subscription TipoArchivoCreated {
    tipoArchivoCreated {
      tipoArchivo {
        id
        nombre
        origen
        updatedAt
      }
      operation
    }
  }
`;
