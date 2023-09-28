import { Etapa } from "types/etapa";

export const emptyRequisito = {
  index: 0,
  nombre: "",
  puntaje: 0,
  excluyente: false,
};

export const emptySubEtapa = {
  index: 0,
  nombre: "",
  subtotal: 0,
  puntajeMaximo: 0,
  requisitos: [emptyRequisito],
};

export const emptyEtapa: Etapa = {
  index: 0,
  nombre: "",
  plazoDiasMaximo: 5,
  puntajeMinimo: 0,
  subetapas: [emptySubEtapa],
};
