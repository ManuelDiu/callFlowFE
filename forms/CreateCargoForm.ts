import * as yup from "yup";

export type CreateCargoForm = {
  nombre: string;
  tips: string;
};

export const cargoValidationSchema = () =>
  yup.object().shape({
    nombre: yup.string().trim().required("Un nombre es requerido."),
    tips: yup.string().trim().required("Al menos un tip es requerido."),
  });
