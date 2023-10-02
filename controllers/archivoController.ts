import { gql } from "@apollo/client";

export const deleteArchivo = gql`
  mutation ($archivoId: Int) {
    deleteArchivo(archivoId: $archivoId) {
      ok
      message
    }
  }
`;
