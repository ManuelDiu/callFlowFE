import { TemplateList } from "types/template";
import Text from "@/components/Table/components/Text";
import { ColumnItem } from "types/table";
import { MdCancel, MdOutlineWorkOutline } from "react-icons/md";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { IoIosColorPalette } from "react-icons/io";
import { BiUserCheck } from "react-icons/bi";
import { GoCheckCircleFill } from "react-icons/go";
import ColorBadge from "@/components/ColorBadge/ColorBadge";

export const formatTemplatesToShow = (templates: TemplateList[] = []) => {
  return templates?.map((template) => {
    return {
      id: template?.id,
      nombre: <Text text={template?.nombre} />,
      cargo: <Text text={template?.cargo?.nombre || "Sin Cargo"} />,
      color: <ColorBadge color={template?.color} />,
      etapas: <Text text={`${template?.etapas?.length || 0}`} />,
      activo: template?.activo ? (
        <GoCheckCircleFill size={20} color="green" />
      ) : (
        <MdCancel size={20} color="red" />
      ),
    };
  });
};

export const Columns: ColumnItem[] = [
  {
    title: "Nombre",
    icon: <AiOutlineInfoCircle color="#A3AED0" size={20} />,
    key: "nombre",
  },
  {
    title: "Cargo",
    icon: <MdOutlineWorkOutline color="#A3AED0" size={20} />,
    key: "cargo",
  },
  {
    title: "Color",
    icon: <IoIosColorPalette color="#A3AED0" size={20} />,
    key: "color",
  },
  {
    title: "Cant. Etapas",
    icon: <AiOutlineInfoCircle color="#A3AED0" size={20} />,
    key: "etapas",
  },
  {
    title: "Activo",
    icon: <BiUserCheck color="#A3AED0" size={20} />,
    key: "activo",
  },
];
