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
  postulantes: number;
  progreso: number;
};

export type Cambio = {
  cambio: boolean,
  nombre: EstadoLlamadoEnum,
  id: number,
}

export type HistorialLlamado = {
  id: number;
  descripcion: string;
  usuario: UserList;
  createdAt?: string;
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
}

export type LlamadoPostulante = {
  postulante: PostulanteList
  estadoActual: PostulanteEstado
}

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
  archivosFirma: Archivo[];
  etapas: EtapaList[];
  etapaActual: EtapaList;
};

export const DEFAULT_BADGES_WITH_DIAS_PLAZO = [
  EstadoLlamadoEnum.listoParaEstudioMerito,
  EstadoLlamadoEnum.enEstudioMerito,
  EstadoLlamadoEnum.listoParaEntrevistas,
  EstadoLlamadoEnum.enEntrevias,
  EstadoLlamadoEnum.listoParaPsicotecnico,
  EstadoLlamadoEnum.enPsicotecnico,
];

// export const handleGetBadgeColor = (estado: EstadoLlamadoEnum, plazoDias: number) => {

//   if (DEFAULT_BADGES_WITH_DIAS_PLAZO.includes(llamado))
// }
