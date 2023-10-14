import { gql } from "@apollo/client";

export const listarLlamados = gql`
  query listarLlamados($filters: ListarLlamadoInputQuery) {
    listarLlamados(filters: $filters) {
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

export const llamadoSubscriptionCreated = gql`
  subscription {
    llamadoCreado {
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

export const disabledLlamados = gql`
  mutation ($llamados: [Int]) {
    deshabilitarLlamados(llamados: $llamados) {
      message
      ok
    }
  }
`;

export const getLlamadoInfoById = gql`
  query ($llamadoId: Int) {
    getLlamadoById(llamadoId: $llamadoId) {
      solicitante {
        telefono
        name
        lastName
        imageUrl
      }
      referencia
      postulantes {
        postulante {
          id
          nombres
          documento
          apellidos
        }
      }
      nombre
      etapaUpdated
      itr
      id
      enviarEmailTodos
      cupos
      cargo {
        tips
        nombre
        id
      }
      cantidadHoras
      historiales {
        usuario {
          telefono
          name
          lastName
          itr
          imageUrl
          id
        }
        cambio {
          cambio
          nombre
          id
        }
        id
        createdAt
        descripcion
      }
      etapas {
        id
        total
        puntajeMin
        plazoDias
        nombre
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
      }
      estadoActual {
        id
        nombre
      }
      etapaActual {
        id
        total
        puntajeMin
        plazoDias
        nombre
      }
      categorias {
        nombre
        id
      }
      archivosFirma {
        nombre
        extension
        tipoArchivo {
          origen
          nombre
        }
        url
      }
      archivos {
        url
        extension
        nombre
        id
        tipoArchivo {
          origen
          nombre
        }
      }
      miembrosTribunal {
        id
        orden
        motivoRenuncia
        tipoMiembro
        usuario {
          name
          lastName
          imageUrl
          id
        }
      }
    }
  }
`;

export const addFileToLlamado = gql`
  mutation ($dataFile: AddFileLlamadoInput) {
    addFileToLlamado(info: $dataFile) {
      message
      ok
    }
  }
`;

export const cambiarEstadoLlamado = gql`
  mutation CambiarEstadoLlamado($info: CambiarEstadoLlamadoInput) {
    cambiarEstadoLlamado(info: $info) {
      ok
      message
    }
  }
`;

export const cambiarCambioLlamado = gql`
  mutation ($info: LlamadoChangeCambioInput) {
    cambiarCambioLlamado(info: $info) {
      message
    }
  }
`;

export const renunciarLlamado = gql`
  mutation ($info: RenunciarLlamadoInput) {
    renunciarLlamado(info: $info) {
      message
      ok
    }
  }
`;
