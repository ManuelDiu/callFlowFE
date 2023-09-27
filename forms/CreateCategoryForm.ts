import * as yup from "yup";

export type CreateCategoryForm = {
  nombre: string;
};

export const categoryValidationSchema = () =>
  yup.object().shape({
    nombre: yup.string().trim().required("Un nombre es requerido."),
  });
