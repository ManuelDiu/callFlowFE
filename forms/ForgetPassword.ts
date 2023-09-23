import * as yup from "yup";

export const forgetPasswordValidation = () =>
  yup.object().shape({
    email: yup
      .string()
      .trim()
      .email("Email invalido")
      .required("El email es requerido"),
  });
