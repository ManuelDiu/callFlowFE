import { ColumnItem } from "types/table";
import {
  AiOutlineCalendar,
  AiOutlineInfoCircle,
  AiOutlinePercentage,
} from "react-icons/ai";
import { TbStatusChange } from "react-icons/tb";
import Text from "@/components/Table/components/Text";
import { EstadoLlamadoEnum } from "@/enums/EstadoLlamadoEnum";
import ProgressBar from "@/components/ProgressBar";
export const chartData = [
  ["Cargo", "Cantidad de Llamados"],
  ["Pasante", 11],
  ["Director", 2],
  ["Coordinardor", 3],
  ["Técnico Redes", 2],
  ["Profesor", 7],
];

export const chartOptions = {
  is3D: true,
};

export const cols: ColumnItem[] = [
  {
    title: "Nombre",
    icon: <AiOutlineInfoCircle color="#A3AED0" size={20} />,
    key: "nombre",
  },
  {
    title: "Estado",
    icon: <TbStatusChange color="#A3AED0" size={20} />,
    key: "estado",
  },
  {
    title: "Fecha Últ. Modificación",
    icon: <AiOutlineCalendar color="#A3AED0" size={20} />,
    key: "ultimaModificacion",
  },
  {
    title: "Progreso",
    icon: <AiOutlinePercentage color="#A3AED0" size={20} />,
    key: "progreso",
  },
];


export const postulantesRecientes = [
  {
    name: <Text text={"Manuel Diu"} className={"font-normal !text-lg "} />,
    createdAt: (
      <Text
        text={"25/09/2023"}
        className={"pl-1 font-normal !text-textogris  "}
      />
    ),
  },
  {
    name: (
      <Text text={"Maximiliano Olivera"} className={"font-normal !text-lg "} />
    ),
    createdAt: (
      <Text
        text={"20/09/2023"}
        className={"pl-1 font-normal !text-textogris  "}
      />
    ),
  },
  {
    name: <Text text={"Franco Rada"} className={"font-normal !text-lg "} />,
    createdAt: (
      <Text
        text={"18/09/2023"}
        className={"pl-1 font-normal !text-textogris  "}
      />
    ),
  },
  {
    name: <Text text={"Agustina Diaz"} className={"font-normal !text-lg "} />,
    createdAt: (
      <Text
        text={"10/09/2023"}
        className={"pl-1 font-normal !text-textogris  "}
      />
    ),
  },
  {
    name: <Text text={"Felipe Alvarez"} className={"font-normal !text-lg "} />,
    createdAt: (
      <Text
        text={"02/08/2023"}
        className={"pl-1 font-normal !text-textogris  "}
      />
    ),
  },
];