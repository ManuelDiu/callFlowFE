import * as yup from "yup";

export type CrearDisponibilidadForm = {
  fecha: string;
  horaMin: string;
  horaMax: string;
};

export enum CrearDisponibilidadFormFields {
  fecha = "fecha",
  horaMin = "horaMin",
  horaMax = "horaMax",
}

const fechaRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
const horaRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

export const CrearDisponibilidadValidation = () =>
  yup.object().shape({
    fecha: yup
      .string()
      .trim()
      .required("La Fecha es requerido.")
      .matches(fechaRegex, {
        message: "Fecha invalida",
      }),
    horaMin: yup
      .string()
      .trim()
      .required("La Hora minima es requerido.")
      .matches(horaRegex, {
        message: "Hora invalida",
      }),
    horaMax: yup
      .string()
      .trim()
      .required("La Hora maxima es requerido.")
      .matches(horaRegex, {
        message: "Hora invalida",
      }),
  });
