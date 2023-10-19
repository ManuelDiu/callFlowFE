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

export const formatLlamadosToTable = (llamados: LlamadoList[] = []) => {
  const newOrder = [...llamados].sort(
    (itemA: LlamadoList, itemB: LlamadoList) => {
      if (
        itemA?.estado === EstadoLlamadoEnum.eliminado &&
        itemB?.estado !== EstadoLlamadoEnum.eliminado
      ) {
        return 1;
      } else {
        return -1;
      }
    }
  );

  return newOrder?.map((llamado) => {
    return {
      id: llamado?.id,
      nombre: <Text text={llamado?.nombre} />,
      estado: <LlamadoEstadoBubble estado={llamado?.estado} />,
      ultimaModificacion: (
        <Text
          text={moment(llamado?.ultimaModificacion).format("DD, MMM, YYYY")}
        />
      ),
      ref: <Text text={llamado?.ref} />,
      cupos: <Text text={llamado?.cupos?.toString() || "0"} />,
      cargo: <Text text={llamado?.cargo?.nombre} />,
      postulantes: <Text text={llamado?.postulantes?.toString() || "0"} />,
      progreso: <LlamadoProgress progress={llamado?.progreso || 0} />,
      href: appRoutes.llamadoInfoPage(llamado?.id),
    };
  });
};

export const formatPostulantes = (postulantes: LlamadoPostulante[]) => {
  return postulantes?.map((postulante, index) => {
    console.log("postulante", postulante);
    return {
      id: postulante.postulante.id,
      index: index,
      imageUrl: DEFAULT_USER_IMAGE,
      name: `${postulante.postulante.nombres} ${postulante.postulante.apellidos}`,
      lastName: postulante.postulante.documento,
    };
  });
};
