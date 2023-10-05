import { gql } from "@apollo/client";

export const listarCargosList = gql`
  query {
    listarCargos {
      id
      nombre
    }
  }
`;

export const listarCargos = gql`
  query {
    listarCargos {
      id
      nombre
      tips
      updatedAt
    }
  }
`;

export const createCargo = gql`
  mutation createCargo($data: CargoItem!) {
    createCargo(data: $data) {
      message
      ok
    }
  }
`;

export const updateCargo = gql`
  mutation updateCargo($data: UpdateCargoInput!) {
    updateCargo(data: $data) {
      ok
      message
      cargo {
        nombre
        tips
      }
    }
  }
`;

export const deleteCargo = gql`
  mutation deleteCargo($data: DeleteCargoInput!) {
    deleteCargo(data: $data) {
      ok
      message
    }
  }
`;

export const createdCargoSubscription = gql`
  subscription CargoCreated {
    cargoCreated {
      cargo {
        id
        nombre
        tips
        updatedAt
      }
      operation
    }
  }
`;
