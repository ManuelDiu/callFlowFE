import { ITR } from "@/enums/ITR";
import { Roles } from "@/enums/Roles";
import * as yup from "yup";

export type ModifyProfileInfoForm = {
  name: string;
  lastName: string;
  documento: string;
  telefono: string;
  email: string;
  roles: Roles[];
  itr: any;
  biografia?: string;
};

export enum ModifyProfileInfoFormFields {
  name = "name",
  lastName = "lastName",
  documento = "documento",
  telefono = "telefono",
  email = "email",
  roles = "roles",
  itr = "itr",
  biografia = "biografia",
}


export const defaultValues = {
  name: "",
  lastName: "",
  documento: "",
  telefono: "",
  email: "",
  roles: [],
  itr: ITR.este,
  biografia: "",
};

export const createModifyProfileInfoValidationSchema = () =>
  yup.object().shape({
    name: yup.string().trim().required("El nombre es requerido."),
    lastName: yup.string().trim().required("El apellido es requerido."),
    documento: yup.string().trim().required("El documento es requerido."),
    telefono: yup.string().trim().required("El teléfono es requerido."),
    email: yup
      .string()
      .email("Correo inválido")
      .trim()
      .required("El email es requerido."),
    roles: yup.array().required("Los roles son requeridos."),
    itr: yup
      .string()
      .oneOf(["Suroeste", "Norte", "Este", "Centro_Sur"])
      .trim()
      .required("El ITR es requerido."),
    biografia: yup.string().trim(),
  });
