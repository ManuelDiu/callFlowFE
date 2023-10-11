import { gql } from "@apollo/client";

export const crearDisponibilidad = gql`
  mutation ($data: DisponibilidadCreate) {
    crearDisponibilidad(data: $data) {
      message
      ok
    }
  }
`;

export const listarDisponibilidad = gql`
  query ($llamadoId: Int!) {
    listarDisponibilidad(llamadoId: $llamadoId) {
      llamadoId
      id
      horaMin
      horaMax
      fecha
    }
  }
`;

export const borrarDisponibilidad = gql`
  mutation ($disponibilidadId: Int!) {
    borrarDisponibilidad(disponibilidadId: $disponibilidadId) {
      ok
      message
    }
  }
`;
