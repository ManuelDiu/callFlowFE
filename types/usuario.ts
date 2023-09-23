import { ITR } from "@/enums/ITR";
import { Roles } from "@/enums/Roles";

export type UsuarioInfo = {
    email: string;
    name?: string;
    lastname?: string;
    image: string;
    biografia?: string;
    roles: Roles[],
    itr: ITR,
    telefono: string,
}

export type UserList = {
    email: string;
    name?: string;
    lastName?: string,
    imageUrl?: string;
    roles: Roles[];
    itr?: ITR;
    telefono: string,
    llamados: number,
    activo?: boolean,
}
