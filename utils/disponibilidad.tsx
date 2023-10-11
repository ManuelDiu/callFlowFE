

import { TemplateList } from "types/template";
import Text from "@/components/Table/components/Text";
import { ColumnItem } from "types/table";
import { BiTime } from "react-icons/bi";
import { DisponibilidadList } from "types/disponibilidad";
import { CiCalendarDate } from "react-icons/ci"

export const formatDisponibilidadColumns = (disponibilidades: DisponibilidadList[] = []) => {
  return disponibilidades?.map((disp) => {
    return {
      fecha: <Text text={disp?.fecha} />,
      hora: <Text text={`${disp?.horaMin} - ${disp?.horaMax}`} />,
      id: disp?.id,
    };
  });
};

export const Columns: ColumnItem[] = [
  {
    title: "Fecha",
    icon: <CiCalendarDate color="#A3AED0" size={20} />,
    key: "fecha",
  },
  {
    title: "Hora",
    icon: <BiTime color="#A3AED0" size={20} />,
    key: "hora",
  },
  {
    title: "Acciones",
    icon: null,
    key: "actions",
  },
];
