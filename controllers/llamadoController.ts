import { gql } from "@apollo/client";

export const listarLlamados = gql`
  query listarLlamados($filters: ListarLlamadoInputQuery) {
    listarLlamados(filters: $filters) {
      id
      ultimaModificacion
      ref
      postulantes
      progreso
      itr
      nombre
      cupos
      estado
      cargo {
        nombre
      }
    }
  }
`;

export const listLlamadosByUser = gql`
  query ListarLlamadosByUser($userId: Int!) {
    listarLlamadosByUser(userId: $userId) {
      id
      nombre
      estado
      ultimaModificacion
      ref
      cupos
      cargo {
        id
        nombre
        tips
        updatedAt
      }
      postulantes
      progreso
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
        estadoActual {
          id
          nombre
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
            id
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
        id
        extension
        firmas {
          usuario {
            name
            lastName
            imageUrl
            id
          }
          firmado
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

export const getEtapaActualPostInLlamado = gql`
  query getEtapaActualPostInLlamado($llamadoId: Int!, $postulanteId: Int!) {
    getEtapaActualPostInLlamado(
      llamadoId: $llamadoId
      postulanteId: $postulanteId
    ) {
      currentEtapa {
        id
        nombre
        plazoDias
        total
        puntajeMin
        currentEtapa
        cantEtapas
        subetapas {
          id
          nombre
          subtotal
          puntajeMaximo
          requisitos {
            id
            nombre
            puntajeSugerido
            puntaje
            excluyente
          }
        }
      }
      allEtapas {
        id
        nombre
        plazoDias
        total
        puntajeMin
        currentEtapa
        cantEtapas
        subetapas {
          id
          nombre
          subtotal
          puntajeMaximo
          requisitos {
            id
            nombre
            puntajeSugerido
            puntaje
            excluyente
          }
        }
      }
    }
  }
`;

export const avanzarEtapaPostulanteInLlamado = gql`
  mutation avanzarEtapaPostulanteInLlamado($data: AvanzarEtapaInput) {
    avanzarEtapaPostulanteInLlamado(data: $data) {
      ok
      message
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

export const puntajesLlamado = gql`
  query ($llamadoId: Int) {
    listarPuntajesPostulantes(llamadoId: $llamadoId) {
      postulanteId
      requisitos {
        puntaje
        requisitoId
      }
    }
  }
`;

export const cambiarMiembroTribunal = gql`
  mutation ($data: CambiarTribunalInput) {
    cambiarMiembroTribunal(data: $data) {
      message
      ok
    }
  }
`;

export const getEstadisticas = gql`
  query ($itr: String, $meses: String) {
    listarEstadisticas(itr: $itr, meses: $meses) {
      llamadosEnProceso
      llamadosFinalizados
      llamadosRecientes {
        ultimaModificacion
        ref
        progreso
        postulantes
        nombre
        id
        estado
        cupos
        cargo {
          nombre
          id
        }
      }
      nuevosPostulantes
      postulantesRecientes {
        nombres
        id
        documento
        apellidos
        createdAt
      }
      cantidadCargos {
        nombre
        cantidad
      }
    }
  }
`;
