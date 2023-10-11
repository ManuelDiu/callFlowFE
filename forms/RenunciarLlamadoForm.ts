import { ITR } from "@/enums/ITR";
import { Roles } from "@/enums/Roles";
import * as yup from "yup";

export type RenunciarLlamadoForm = {
  motivoRenuncia: string;
};

export enum RenunciarLlamadoFormFields {
    motivoRenuncia = "motivoRenuncia"
}

export const RenunciarLlamadoValidationSchema = () =>
  yup.object().shape({
    motivoRenuncia: yup.string().trim().required("El motivo es requerido."),
  });
