import * as yup from "yup";

export type crearLlamadoForm = {
  nombre: string;
  referencia: string;
  cantidadHoras: number;
  cupos: number;
  cargo: number;
  itr: string;
  solicitante: number;
  enviarEmailTodos: boolean,
};

export enum crearLlamadoFormFields {
  nombre = "nombre",
  referencia = "referencia",
  cantidadHoras = "cantidadHoras",
  cupos = "cupos",
  cargo = "cargo",
  itr = "itr",
  solicitante = "solicitante",
  enviarEmailTodos = "enviarEmailTodos",
}

export const crearLlamadoValidationSchema = () =>
  yup.object().shape({
    nombre: yup.string().trim().required("El nombre es requerido."),
    referencia: yup.string().trim().required("La referencia es requerida."),
    cantidadHoras: yup
      .number()
      .required("Las cantidad de horas son requeridas."),
    cupos: yup.number().required("Los cupos son requeridos."),
    cargo: yup.number().required("El cargo es requerido."),
    itr: yup.string().trim().required("El ITR es requerido."),
    solicitante: yup.number().required("El solicitante es requerido."),
    enviarEmailTodos: yup.boolean().required("Debes indicar si deseas enviar email a todos")
  });
