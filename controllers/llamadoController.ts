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

export const createLlamado = gql`
  mutation CrearLlamado($crearLlamadoInfo2: CreateLlamadoInput) {
    crearLlamado(info: $crearLlamadoInfo2) {
      ok
      message
    }
  }
`;
