import * as yup from "yup";

export type CreatePostulanteForm = {
  nombres: string;
  apellidos: string;
  documento: string;
};

export const postulanteValidationSchema = () =>
  yup.object().shape({
    nombres: yup.string().trim().required("El nombre es requerido."),
    apellidos: yup.string().trim().required("El apellido es requerido."),
    documento: yup.string().trim().required("El documento es requerido."),
  });
