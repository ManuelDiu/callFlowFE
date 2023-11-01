import { EstadoLlamadoEnum } from "@/enums/EstadoLlamadoEnum";
import { Etapa } from "types/etapa";
import { EtapaList } from "types/template";

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

export const formatEtapasForDropdown = (
  etapas: EtapaList[],
  etapaActual: EtapaList
) => {
  return etapas?.map((item) => {
    return {
      label: item?.nombre,
      value: item?.id,
      customBadge: item?.id === etapaActual?.id && (
        <div
          style={{ background: "#48D656" }}
          className="rounded-lg text-white font-semibold text-sm px-2 py-1 "
        >
          Etapa actual
        </div>
      ),
    };
  });
};

const TRIBUNAL_ESTADOS_CHANGE: EstadoLlamadoEnum[] = [
  EstadoLlamadoEnum.entrevistas,
  EstadoLlamadoEnum.pendienteHacerFirma,
];

export const formatEstadosToLlamado = (
  estados: EstadoLlamadoEnum[],
  estadoActual: EstadoLlamadoEnum,
  isAdmin: boolean
) => {
  const disabledIndex = estados.findIndex((item) => item === estadoActual);

  return estados?.map((item, index) => {
    const isDisabled = isAdmin
      ? index <= disabledIndex
      : !TRIBUNAL_ESTADOS_CHANGE.includes(item) || index <= disabledIndex;;

    return {
      label: item,
      value: item,
      disabled: isDisabled,
      customBadge: item === estadoActual && (
        <div
          style={{ background: "#97b116" }}
          className="rounded-lg text-white font-semibold text-sm px-2 py-1 "
        >
          Estado actual
        </div>
      ),
    };
  });
};
