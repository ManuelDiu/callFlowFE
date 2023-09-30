import { gql } from "@apollo/client";

export const listarTemplates = gql`
  query {
    listarTemplates {
      id
      nombre
      activo
      color
      cargo {
        id
        nombre
      }
      etapas
    }
  }
`;

export const templateCreatedSubscription = gql`
  subscription {
    templateCreado {
      id
      nombre
      activo
      color
      cargo {
        id
        nombre
      }
      etapas
    }
  }
`;

export const crearTemplate = gql`
  mutation ($crearTemplateInfo2: CreateTemplateInput) {
    crearTemplate(info: $crearTemplateInfo2) {
      message
      ok
    }
  }
`;

export const deshabilitarTemplates = gql`
  mutation ($templates: [Int]) {
    deshabilitarTemplates(templates: $templates) {
      message
      ok
    }
  }
`;

export const getTemplateById = gql`
  mutation ($templateId: Int!) {
    getTemplateById(templateId: $templateId) {
      nombre
      id
      etapa {
        total
        subetapas {
          requisitos {
            puntajeSugerido
            nombre
            excluyente
          }
          puntajeTotal
          puntajeMaximo
          nombre
        }
        puntajeMin
        nombre
        plazoDias
      }
      color
      cargo {
        id
        nombre
      }
      activo
    }
  }
`;
