import { EstadoLlamadoEnum } from "@/enums/EstadoLlamadoEnum";
import { Cargo } from "./cargo";


export type LlamadoList = {
    id: number,
    nombre: string,
    estado: EstadoLlamadoEnum,
    ultimaModificacion: string,
    ref: string,
    cupos: number,
    cargo: Cargo,
    postulantes: number,
    progreso: number,
}