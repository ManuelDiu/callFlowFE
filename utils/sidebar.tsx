import { AiFillHome } from "react-icons/ai";
import { PiClipboardTextDuotone } from "react-icons/pi";
import { MdOutlineCategory } from "react-icons/md";
import { ImInsertTemplate } from "react-icons/im";
import { PiUserDuotone } from "react-icons/pi";
import { PiUsersThreeDuotone } from "react-icons/pi";
import { PiFilePlusLight } from "react-icons/pi";
import { MdOutlineWorkOutline } from "react-icons/md";
import appRoutes from "@/routes/appRoutes";

export const items = [
  { title: "Inicio", icon: <AiFillHome size={24} />, href: appRoutes.home() },
  {
    title: "Llamados",
    icon: <PiClipboardTextDuotone size={24} />,
    href: appRoutes.llamados(),
    validPath: [appRoutes.llamados(), appRoutes.agregarLlamado(), appRoutes.selectTemplate()],
  },
  {
    title: "Plantillas",
    icon: <ImInsertTemplate size={24} />,
    href: appRoutes.templates(),
    validPath: [appRoutes.templates(), appRoutes.agregarTemplate()],
  },
  { title: "Postulantes", icon: <PiUserDuotone size={24} />, href: appRoutes.postulantes() },
  {
    title: "Categorías",
    icon: <MdOutlineCategory size={24} />,
    href: appRoutes.categorias(),
  },
  { title: "Cargos", icon: <MdOutlineWorkOutline size={24} />, href: appRoutes.cargos() },
  {
    title: "Usuarios",
    icon: <PiUsersThreeDuotone size={24} />,
    href: "/usuarios",
    validPath: [appRoutes.usuarios()],
  },
  {
    title: "Tipos de Archivo",
    icon: <PiFilePlusLight size={24} />,
    href: appRoutes.tiposArchivo(),
  },
];
