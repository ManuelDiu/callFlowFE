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
  itr: any;
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
    lastName: yup.string().trim().required("La apellido es requerida."),
    document: yup.string().trim().required("La documento es requerido."),
    telefono: yup.string().trim().required("La telefono es requerida."),
    email: yup.string().email("Correo invalido").trim().required("La email es requerida.")
    
    ,
    roles: yup.array().required("Los roles son requeridos."),
    itr: yup
      .string()
      .oneOf(["Suroeste", "Norte", "Este", "Centro_Sur"])
      .trim()
      .required("El itr es requerido."),
    biografia: yup.string().trim(),
  });
