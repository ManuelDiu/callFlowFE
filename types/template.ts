import { Cargo } from "./cargo";

export type TemplateList = {
  id?: number;
  nombre: string;
  color: string;
  cargo: Cargo;
  etapas?: number;
  activo?: boolean;
};

export type RequisitoList = {
  nombre: string;
  puntajeSugerido: number;
  excluyente: boolean;
};

export type SubEtapaList = {
  nombre: string;
  puntajeTotal: number;
  puntajeMaximo: number;
  requisitos: RequisitoList[];
};

export type EtapaList = {
  id?: number;
  nombre: string;
  plazoDias: number;
  puntajeMin: number;
  total: number;
  subetapas: SubEtapaList[];
};

export type TemplateInfo = {
  id: number;
  nombre: string;
  cargo: Cargo;
  etapa: EtapaList[];
  color: string;
  activo: boolean;
};
