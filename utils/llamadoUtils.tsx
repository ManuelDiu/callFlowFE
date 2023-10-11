import {
  AiOutlineInfoCircle,
  AiOutlineSync,
  AiOutlineCalendar,
} from "react-icons/ai";
import { ColumnItem } from "types/table";
import { HiOutlineKey } from "react-icons/hi";
import { MdNumbers, MdOutlineWorkOutline } from "react-icons/md";
import { PiUsersThreeBold } from "react-icons/pi";
import { GiProgression } from "react-icons/gi";
import { LlamadoList, LlamadoPostulante, TribunalLlamado } from "types/llamado";
import Text from "@/components/Table/components/Text";
import moment from "moment";
import LlamadoEstadoBubble from "@/components/LlamadoEstadoBubble/LlamadoEstadoBubble";
import LlamadoProgress from "@/components/LlamadoProgress/LlamadoProgress";
import appRoutes from "@/routes/appRoutes";
import { EstadoLlamadoEnum } from "@/enums/EstadoLlamadoEnum";
import { EtapaList } from "types/template";
import { PostulanteList } from "types/postulante";
import { DEFAULT_USER_IMAGE } from "./userUtils";
import { TipoArchivoItem } from "types/tipoArchivo";

export const ORDER_LLAMADO_STATUS = [
  EstadoLlamadoEnum.creado,
  EstadoLlamadoEnum.enRelevamiento,
  EstadoLlamadoEnum.listoParaEstudioMerito,
  EstadoLlamadoEnum.enEstudioMerito,
  EstadoLlamadoEnum.listoParaEntrevistas,
  EstadoLlamadoEnum.enEntrevias,
  EstadoLlamadoEnum.listoParaPsicotecnico,
  EstadoLlamadoEnum.enPsicotecnico,
  EstadoLlamadoEnum.listoParaFirmarGrilla,
  EstadoLlamadoEnum.enProcesoDeFrimaGrilla,
  EstadoLlamadoEnum.listoParaFirmarActaFinal,
  EstadoLlamadoEnum.enProcesoDeFrimaActaFinal,
  EstadoLlamadoEnum.finalizado,
];

export const Columns: ColumnItem[] = [
  {
    title: "Nombre",
    icon: <AiOutlineInfoCircle color="#A3AED0" size={20} />,
    key: "nombre",
  },
  {
    title: "Estado",
    icon: <AiOutlineSync color="#A3AED0" size={20} />,
    key: "estado",
    customWidth: "20%",
  },
  {
    title: "Ultima Modif.",
    icon: <AiOutlineCalendar color="#A3AED0" size={20} />,
    key: "ultimaModificacion",
  },
  {
    title: "Ref.",
    icon: <HiOutlineKey color="#A3AED0" size={20} />,
    key: "ref",
  },
  {
    title: "Cupos",
    icon: <MdNumbers color="#A3AED0" size={20} />,
    key: "cupos",
  },
  {
    title: "Cargo",
    icon: <MdOutlineWorkOutline color="#A3AED0" size={20} />,
    key: "cargo",
  },
  {
    title: "Postulantes",
    icon: <PiUsersThreeBold color="#A3AED0" size={20} />,
    key: "postulantes",
  },
  {
    title: "Progreso",
    icon: <GiProgression color="#A3AED0" size={20} />,
    key: "progreso",
    customWidth: "20%",
  },
];

export const formatLlamadosToTable = (llamados: LlamadoList[] = []) => {
  const newOrder = [...llamados].sort((itemA: LlamadoList, itemB: LlamadoList) => {
    if (itemA?.estado === EstadoLlamadoEnum.eliminado && itemB?.estado !== EstadoLlamadoEnum.eliminado) {
      return 1;
    } else {
      return -1;
    }
  })

  return newOrder?.map((llamado) => {
    return {
      id: llamado?.id,
      nombre: <Text text={llamado?.nombre} />,
      estado: <LlamadoEstadoBubble estado={llamado?.estado} />,
      ultimaModificacion: <Text text={moment(llamado?.ultimaModificacion).format("DD, MMM, YYYY") } />,
      ref: <Text text={llamado?.ref} />,
      cupos: <Text text={llamado?.cupos?.toString() || "0"} />,
      cargo: <Text text={llamado?.cargo?.nombre} />,
      postulantes: <Text text={llamado?.postulantes?.toString() || "0"} />,
      progreso: <LlamadoProgress progress={llamado?.progreso || 0} />,
      href: appRoutes.llamadoInfoPage(llamado?.id)
    };
  });
};


export const formatEtapas = (etapas: EtapaList[]) => {
  const formatEtapas = etapas?.map((etapa, indexE) => {
    return {
      index: indexE,
      nombre: etapa?.nombre,
      plazoDiasMaximo: etapa?.plazoDias,
      puntajeMinimo: etapa?.puntajeMin,
      subetapas: etapa?.subetapas?.map((subetapa, indexSub) => {
        return {
          index: indexSub,
          nombre: subetapa?.nombre,
          subtotal: subetapa?.puntajeTotal,
          puntajeMaximo: subetapa?.puntajeMaximo,
          requisitos: subetapa?.requisitos?.map((req, indexReq) => {
            return {
              index: indexReq,
              nombre: req?.nombre,
              puntaje: req?.puntajeSugerido,
              excluyente: req?.excluyente,
            };
          }),
        };
      }),
    };
  });
  return formatEtapas;
}

export const formatPostulantes = (postulantes: LlamadoPostulante[]) => {
  return postulantes?.map((postulante, index) => {
    console.log("postulante", postulante)
    return {
      index: index,
      imageUrl: DEFAULT_USER_IMAGE,
      name: `${postulante.postulante.nombres} ${postulante.postulante.apellidos}`,
      lastName: postulante.postulante.documento,
    };
  });
};

export const formatTribunales = (tribunales: TribunalLlamado[]) => {
  return tribunales?.map((tribunal, index) => {
    return {
      index: index,
      imageUrl: tribunal?.usuario?.imageUrl || DEFAULT_USER_IMAGE,
      name: `${tribunal?.usuario?.name} ${tribunal?.usuario?.lastName}`,
      lastName: `Tribunal - ${tribunal.orden} ${tribunal.tipoMiembro}`,
      label: tribunal?.motivoRenuncia !== "" && <div style={{ background: "rgb(248 113 113 / var(--tw-bg-opacity))"}} className="px-3 font-medium py-2 rounded-full text-white shadow-sm">
        Renincio
      </div>
    };
  });
};


export const formatFileTypeToDropdown = (fileTypes: TipoArchivoItem[]) => {
  return fileTypes?.map((fileType) => {
    return {
      label: fileType.nombre,
      value: fileType.id
    }
  })
}
