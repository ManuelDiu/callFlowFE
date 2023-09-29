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
import { LlamadoList } from "types/llamado";
import Text from "@/components/Table/components/Text";
import moment from "moment";
import LlamadoEstadoBubble from "@/components/LlamadoEstadoBubble/LlamadoEstadoBubble";
import LlamadoProgress from "@/components/LlamadoProgress/LlamadoProgress";
import appRoutes from "@/routes/appRoutes";
import { EstadoLlamadoEnum } from "@/enums/EstadoLlamadoEnum";

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
      href: appRoutes.llamadoInfo(llamado?.id)
    };
  });
};
