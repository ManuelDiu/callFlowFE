import { ITR } from "@/enums/ITR";
import { Roles } from "@/enums/Roles";
import { TipoMiembro } from "@/enums/TipoMiembro";

export type UsuarioInfo = {
  email: string;
  name?: string;
  lastname?: string;
  image: string;
  biografia?: string;
  roles: Roles[];
  itr: ITR;
  telefono: string;
};

export type UserList = {
  id: number;
  email: string;
  name?: string;
  lastName?: string;
  imageUrl?: string;
  roles: Roles[];
  itr?: ITR;
  telefono: string;
  llamados: number;
  activo?: boolean;
  biografia?: string;
  documento?: string;
};

export type Solicitante = Pick<
  UserList,
  "name" | "lastName" | "imageUrl" | "id"
>;

export type SortUserInfo = {
  imageUrl: string;
  name: string;
  lastName: string;
  id: number;
};

export type TribunalInfo = {
  imageUrl: string;
  name: string;
  lastName: string;
  id: number;
  order: number,
  type: TipoMiembro,
};
