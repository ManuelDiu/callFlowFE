import * as yup from "yup"

export const resetPasswordValidation = () =>
    yup.object().shape({
        password: yup.string()
            .trim()
            .min(8,"La password debe tener al menos 8 caracteres")
            .required("La password es requerida"),
        confirmPassword: yup.string()
            .trim()
            .min(8,"La password debe tener al menos 8 caracteres")
            .required("La password es requerida"),
    });