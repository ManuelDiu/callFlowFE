import styled from "styled-components";
import tw from "twin.macro";
import Input from "../Inputs/Input";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import OneLineError from "../OneLineError/OneLineError";
import { TipoArchivoItem } from "types/tipoArchivo";
import Dropdown from "../Inputs/Dropdown";
import { TipoArchivoOrigen } from "@/enums/TipoArchivoOrigen";
import { CambiarEstadoPostulanteForm, cambiarEstadoPostulanteValidationSchema, CambiarEstadoPostulanteFormFields } from "@/forms/CambiarEstadoPostulanteForm";
import { EstadoPostulanteEnum } from "@/enums/EstadoPostulanteEnum";

interface Props {
  normalErrors?: string[];
  estadoActual?: EstadoPostulanteEnum;
}

const Container = styled.div`
  ${tw`w-full h-auto flex flex-col gap-4 items-center justify-start`}
`;

const ErrorList = styled.div`
  ${tw`w-full h-auto flex flex-col gap-1`}
`;

const ModificarEstadoPostulanteForm = ({
  normalErrors = [],
  estadoActual,
}: Props) => {
  const cambiarEstadoPostulForm = useForm<CambiarEstadoPostulanteForm>({
    resolver: yupResolver(cambiarEstadoPostulanteValidationSchema()),
  });

  const {
    setValue,
    formState: { errors },
  } = useFormContext();

  const formatErrors = errors as any;

  const values = [
    { label: "Cumple requisitos", value: EstadoPostulanteEnum.cumpleRequisito },
    { label: "En duda", value: EstadoPostulanteEnum.enDua },
    { label: "No cumple requisitos", value: EstadoPostulanteEnum.noCumpleRequisito },
  ];
  return (
    <FormProvider {...cambiarEstadoPostulForm}>
      <Container>
        <Dropdown
          label="Nuevo estado"
          isInvalid={!!errors[CambiarEstadoPostulanteFormFields.nuevoEstado]?.message}
          placeholder="Seleccione el nuevo estado para el postulante"
          onChange={(val: any) =>
            setValue(CambiarEstadoPostulanteFormFields.nuevoEstado, val?.value)
          }
          required
          items={values.filter((val) => val.value !== estadoActual )}
          inputFormName={CambiarEstadoPostulanteFormFields.nuevoEstado}
        />
      </Container>
      {normalErrors?.length > 0 && (
        <ErrorList>
          {normalErrors.map((err: string, index) => {
            return <OneLineError key={`error-${index}`} message={err || ""} />;
          })}
        </ErrorList>
      )}
      {Object.keys(formatErrors)?.length > 0 && (
        <ErrorList>
          {Object.keys(formatErrors)?.map((errKey: any, index) => {
            return (
              <OneLineError
                key={`error-${index}`}
                message={formatErrors[errKey]?.message || ""}
              />
            );
          })}
        </ErrorList>
      )}
    </FormProvider>
  );
};

export default ModificarEstadoPostulanteForm;
