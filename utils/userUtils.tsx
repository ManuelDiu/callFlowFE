import { ColumnItem } from "types/table";
import { AiOutlineInfoCircle, AiOutlineTag } from "react-icons/ai";
import { BiUserCheck } from "react-icons/bi";
import { HiOutlineMail, HiOutlineLocationMarker } from "react-icons/hi";
import { BsBriefcase } from "react-icons/bs";
import { Solicitante, UserList } from "types/usuario";
import UserInfoLine from "@/components/Table/components/UserInfoLine";
import { DropDownItem } from "./utils";

export const DEFAULT_TOKEN_SESSION_KEY = "auth_token";

export const handleStorageToken = (token: string) => {
  sessionStorage.setItem(DEFAULT_TOKEN_SESSION_KEY, token);
};

export const DEFAULT_USER_IMAGE =
  "https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg";

export const handleGetToken = (): string => {
  if (typeof window === "undefined") {
    return "";
  } else {
    return sessionStorage.getItem(DEFAULT_TOKEN_SESSION_KEY) || "";
  }
};

export const handleRemoveToken = () => {
  sessionStorage.removeItem(DEFAULT_TOKEN_SESSION_KEY);
};

export const Columns: ColumnItem[] = [
  {
    title: "Nombre",
    icon: <AiOutlineInfoCircle color="#A3AED0" size={20} />,
    key: "name",
  },
  {
    title: "Email",
    icon: <HiOutlineMail color="#A3AED0" size={20} />,
    key: "email",
  },
  {
    title: "Activo",
    icon: <BiUserCheck color="#A3AED0" size={20} />,
    key: "activo",
  },
  {
    title: "Roles",
    icon: <AiOutlineTag color="#A3AED0" size={20} />,
    key: "roles",
  },
  {
    title: "Llamados",
    icon: <BsBriefcase color="#A3AED0" size={20} />,
    key: "llamados",
  },
  {
    title: "ITR",
    icon: <HiOutlineLocationMarker color="#A3AED0" size={20} />,
    key: "itr",
  },
  {
    title: "",
    icon: "",
    key: "actions",
  },
];

export const formatSolicitantes = (solicitantes: Solicitante[] = []): DropDownItem[] => {
  return solicitantes?.map((solicitante) => {
    return {
      label: (
        <UserInfoLine
          userImage={solicitante.imageUrl}
          userName={solicitante.name}
          userlastName={solicitante.lastName}
        />
      ),
      value: solicitante?.id,
    };
  });
};


export const formatListMiembrosTribunal = (
  tribunales: UserList[] = []
): DropDownItem[] => {
  return tribunales?.map((tribunal) => {
    return {
      label: (
        <UserInfoLine
          className="m-2!"
          userImage={tribunal?.imageUrl}
          userName={`${tribunal?.name} ${tribunal.lastName}`}
          userlastName={tribunal?.documento}
        />
      ),
      value: tribunal.id,
    };
  });
};
