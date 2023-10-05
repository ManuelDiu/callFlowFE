import * as yup from "yup";
import { EstadoPostulanteEnum } from "@/enums/EstadoPostulanteEnum";

export type CambiarEstadoPostulanteForm = {
  nuevoEstado: EstadoPostulanteEnum;
};

export enum CambiarEstadoPostulanteFormFields {
  nuevoEstado = "nuevoEstado",
}

export const cambiarEstadoPostulanteValidationSchema = () =>
  yup.object().shape({
    nuevoEstado: yup
      .string()
      .oneOf([EstadoPostulanteEnum.cumpleRequisito, EstadoPostulanteEnum.enDua, EstadoPostulanteEnum.noCumpleRequisito])
      .trim()
      .required("El nuevo estado es requerido."),
  });
