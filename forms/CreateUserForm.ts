import { ITR } from "@/enums/ITR";
import { Roles } from "@/enums/Roles";
import * as yup from "yup";

export type CreateUserForm = {
  name: string;
  lastName: string;
  document: string;
  telefono: string;
  email: string;
  roles: Roles[];
  itr?: any;
  biografia?: string;
};

export const defaultValues = {
  name: "",
  lastName: "",
  document: "",
  telefono: "",
  email: "",
  roles: [],
  itr: ITR.este,
  biografia: "",
};

export const createUserValidationSchema = () =>
  yup.object().shape({
    name: yup.string().trim().required("El nombre es requerido."),
    lastName: yup.string().trim().required("El apellido es requerido."),
    document: yup.string().trim().required("E documento es requerido."),
    telefono: yup.string().trim().required("El teléfono es requerido."),
    email: yup
      .string()
      .email("Correo inválido.")
      .trim()
      .required("El email es requerido."),
    roles: yup.array().required("Los roles son requeridos."),
    itr: yup
      .string()
      .oneOf(["Suroeste", "Norte", "Este", "Centro_Sur", "ULO"]),
    biografia: yup.string().trim(),
  });
