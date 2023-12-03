import { EstadoLlamadoEnum } from "@/enums/EstadoLlamadoEnum";
import { Cargo } from "./cargo";
import { UserList } from "./usuario";
import { TipoMiembro } from "@/enums/TipoMiembro";
import { ITR } from "@/enums/ITR";
import { PostulanteList } from "./postulante";
import { CategoriaItem } from "./categoria";
import { EtapaList } from "./template";
import { DEFAULT_USER_IMAGE } from "@/utils/userUtils";

export type LlamadoList = {
  id: number;
  nombre: string;
  estado: EstadoLlamadoEnum;
  ultimaModificacion: string;
  ref: string;
  cupos: number;
  cargo: Cargo;
  itr: String;
  postulantes: number;
  progreso: number;
};

export type PaginationLlamado = {
  llamados: LlamadoList[],
  totalPages: number,
}

export type Cambio = {
  cambio: boolean;
  nombre: EstadoLlamadoEnum;
  id: number;
};

export type HistorialLlamado = {
  id: number;
  descripcion: string;
  usuario: UserList;
  createdAt?: string;
  llamado: LlamadoList;
  cambio?: Cambio;
};

export type Archivo = {
  id: number;
  nombre: string;
  url: string;
  extension: string;
  tipoArchivo: {
    id: string;
    nombre: string;
  };
};

export type Firmas = {
  usuario: UserList;
  firmado: boolean;
};

export type ArchivoFirma = {
  nombre: string;
  id: number;
  extension: string;
  urlOriginal: string;
  url: string;
  tipoArchivoFirma: String;
  firmas: Firmas[];
};

export type TribunalLlamado = {
  usuario: UserList;
  id: number;
  orden: number;
  motivoRenuncia: string;
  tipoMiembro: TipoMiembro;
};

export type PostulanteEstado = {
  id: number;
  nombre: string;
};

export type LlamadoPostulante = {
  postulante: PostulanteList;
  estadoActual: PostulanteEstado;
};

export type AgregarPostulanteALlamadoData = {
  llamadoId: number;
  postulanteId: number;
};

export type FullLlamadoInfo = {
  id: number;
  nombre: string;
  referencia: string;
  cantidadHoras: number;
  etapaUpdated?: string;
  cupos: number;
  enviarEmailTodos: Boolean;
  solicitante: UserList;
  itr: ITR;
  estadoActual: {
    id: string;
    nombre: string;
  };
  miembrosTribunal: [TribunalLlamado];
  cargo: Cargo;
  postulantes: LlamadoPostulante[];
  categorias: CategoriaItem[];
  historiales: HistorialLlamado[];
  archivos: Archivo[];
  archivosFirma: ArchivoFirma[];
  etapas: EtapaList[];
  etapaActual: EtapaList;
};

export const DEFAULT_BADGES_WITH_DIAS_PLAZO = [
  EstadoLlamadoEnum.entrevistas,
  EstadoLlamadoEnum.psicotecnicoCompartido,
  EstadoLlamadoEnum.psicotecnicoSolicitado,
  EstadoLlamadoEnum.pendienteHacerFirma,
  EstadoLlamadoEnum.pendienteHacerActa,
];

// export const handleGetBadgeColor = (estado: EstadoLlamadoEnum, plazoDias: number) => {

//   if (DEFAULT_BADGES_WITH_DIAS_PLAZO.includes(llamado))
// }

export type CantidadCargo = {
  nombre: string;
  cantidad: number;
};

export type EstadisticasGet = {
  llamadosEnProceso: number;
  llamadosFinalizados: number;
  nuevosPostulantes: number;
  llamadosRecientes: LlamadoList[];
  postulantesRecientes: PostulanteList[];
  cantidadCargos: CantidadCargo[];
};
