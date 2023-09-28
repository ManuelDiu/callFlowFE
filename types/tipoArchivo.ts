import { TipoArchivoOrigen } from "@/enums/TipoArchivoOrigen";

export type TipoArchivoItem = {
    id?: number;
    nombre: string;
    origen: TipoArchivoOrigen;
    updatedAt: string;
}