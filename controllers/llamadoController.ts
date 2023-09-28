import { gql } from "@apollo/client";

export const listarLlamados = gql`
  query listarLlamados {
    listarLlamados {
      id
      ultimaModificacion
      ref
      postulantes
      progreso
      nombre
      cupos
      estado
      cargo {
        nombre
      }
    }
  }
`;
