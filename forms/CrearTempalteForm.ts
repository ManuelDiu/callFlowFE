import * as yup from "yup";

export type crearTempalteForm = {
  nombre: string;
  cargo: number;
  color: string;
};

export enum crearTemplateFormFields {
  nombre = "nombre",
  cargo = "cargo",
  color = "color",
}

export const crearTemplateValidationSchema = () =>
  yup.object().shape({
    nombre: yup.string().trim().required("El nombre es requerido."),
    cargo: yup.number().required("El cargo es requerido."),
    color: yup.string().trim().required("El color es requerido."),
  });
