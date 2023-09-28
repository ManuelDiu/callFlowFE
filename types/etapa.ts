export type Requisito = {
  index?: number,
  nombre: string;
  puntaje: number;
  excluyente: boolean;
};

export type SubEtapa = {
  index?: number,
  nombre: string;
  subtotal: number;
  puntajeMaximo: number;
  requisitos: Requisito[];
};

export type Etapa = {
  index?: number,
  nombre: string;
  plazoDiasMaximo: number;
  puntajeMinimo: number;
  subetapas: SubEtapa[];
};
