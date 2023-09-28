import { TipoArchivoOrigen } from "@/enums/TipoArchivoOrigen";
import * as yup from "yup";

export type CreateTipoArchivoForm = {
  nombre: string;
  origen: any;
};

/* export const tipoArchivoDefaultValues = {
  nombre: "",
  origen: TipoArchivoOrigen.llamado,
}; */

export const tipoArchivoValidationSchema = () =>
  yup.object().shape({
    nombre: yup.string().trim().required("El nombre es requerido."),
    origen: yup
      .string()
      .oneOf(["Postulante", "Llamado"])
      .trim()
      .required("El origen del tipo de archivo es requerido."),
  });
