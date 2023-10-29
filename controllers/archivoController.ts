import { gql } from "@apollo/client";

export const deleteArchivo = gql`
  mutation ($archivoId: Int) {
    deleteArchivo(archivoId: $archivoId) {
      ok
      message
    }
  }
`;

export const addArchivoFirmaToLlamado = gql`
  mutation ($dataFile: AddFileLlamadoInputFirma) {
    addArchivoFirmaToLlamado(info: $dataFile) {
      message
      ok
    }
  }
`;


export const firmarArchivo = gql`
  mutation FirmarArchivo($info: FirmarArchivoInput) {
  firmarArchivo(info: $info) {
    ok
    message
  }
}
`;
