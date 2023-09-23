import * as yup from "yup"

export const loginValidationSchema = () =>
    yup.object().shape({
        email: yup.string()
            .trim()
            .required("El e-mail es requerido."),
        password: yup.string()
        .trim()
        .required("La contraseña es requerida.")
    });