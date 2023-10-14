export type Requisito = {
  index?: number;
  nombre: string;
  puntaje: number;
  excluyente: boolean;
};

export type SubEtapa = {
  index?: number;
  nombre: string;
  subtotal: number;
  puntajeMaximo: number;
  requisitos: Requisito[];
};

export type Etapa = {
  index?: number;
  nombre: string;
  plazoDiasMaximo: number;
  puntajeMinimo: number;
  subetapas: SubEtapa[];
};

export type RequisitoGrilla = {
  id?: number;
  nombre: string;
  puntajeSugerido: number;
  puntaje: number;
  excluyente: boolean;
};

export type SubEtapaGrilla = {
  id?: number;
  nombre: string;
  subtotal: number;
  puntajeMaximo: number;
  requisitos: RequisitoGrilla[];
};

export type EtapaGrilla = {
  id?: number;
  nombre: string;
  plazoDias: number;
  total: number;
  currentEtapa: number;
  cantEtapas: number;
  puntajeMin: number;
  subetapas: SubEtapaGrilla[];
};

export type DataGrilla = {
  postulanteId: number;
  llamadoId: number;
  requisitos: RequisitoGrillaInput[];
};

export type RequisitoGrillaInput = {
  id: number;
  nuevoPuntaje: number;
};

export type AvanzarEtapaPostulanteData = {
  postulanteId: number;
  llamadoId: number;
  currentEtapa: number
};