import { Archivo } from "./llamado";

export type PostulanteList = {
  id: number;
  nombres: string;
  apellidos: string;
  documento: string;
  updatedAt: Date;
};

export type CargoData = {
  id: number;
  nombre: string;
  tips?: string;
  updatedAt: Date;
};

export type LlamadoData = {
  id: number;
  nombre: string;
  referencia: string;
  cantidadHoras: number;
  cupos: number;
  itr: string;
  cargo: CargoData;
  updatedAt: Date;
};

export type EstadoData = {
  id: number;
  nombre: string;
  updatedAt: Date;
};

export type PostulanteLlamadoFull = {
  id: number;
  postulante: PostulanteList;
  llamado: LlamadoData;
  archivos: Archivo[];
  estadoActual: EstadoData;
  updatedAt: string;
};
