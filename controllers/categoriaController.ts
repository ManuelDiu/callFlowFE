import { gql } from "@apollo/client";

export const listCategorias = gql`
  query {
    listCategorias {
      id
      nombre
      updatedAt
    }
  }
`;
export const createCategory = gql`
  mutation createCategory($data: CategoriaItem!) {
    createCategory(data: $data) {
      message
      ok
    }
  }
`;
export const updateCategory = gql`
  mutation UpdateCategory($data: UpdateCategoryInput!) {
    updateCategory(data: $data) {
      ok
      categoria {
        nombre
      }
    }
  }
`;
export const deleteCategory = gql`
  mutation deleteCategory($data: DeleteCategoryInput!) {
    deleteCategory(data: $data) {
      ok
    }
  }
`;
export const createdCategorySubscription = gql`
  subscription CategoryCreated {
    categoryCreated {
      categoria {
        id
        nombre
        updatedAt
      }
      operation
    }
  }
`;
