import styled from "styled-components";
import tw from "twin.macro";
import Input from "../Inputs/Input";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { CreateTipoArchivoFormFields } from "@/enums/CreateTipoArchivoFormFields";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import OneLineError from "../OneLineError/OneLineError";
import { TipoArchivoItem } from "types/tipoArchivo";
import {
  CreateTipoArchivoForm,
  tipoArchivoValidationSchema,
} from "@/forms/CreateTipoArchivoForm";
import Dropdown from "../Inputs/Dropdown";
import { TipoArchivoOrigen } from "@/enums/TipoArchivoOrigen";

interface Props {
  normalErrors?: string[];
  selectedTipoArchivo: TipoArchivoItem | undefined;
}

const Container = styled.div`
  ${tw`w-full h-auto flex flex-col gap-4 items-center justify-start`}
`;

const ErrorList = styled.div`
  ${tw`w-full h-auto flex flex-col gap-1`}
`;

const AddTipoArchivoForm = ({
  normalErrors = [],
  selectedTipoArchivo,
}: Props) => {
  const createTipoArchivoForm = useForm<CreateTipoArchivoForm>({
    resolver: yupResolver(tipoArchivoValidationSchema()),
  });

  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    if (selectedTipoArchivo) {
      setValue(CreateTipoArchivoFormFields.nombre, selectedTipoArchivo.nombre);
      setValue(CreateTipoArchivoFormFields.origen, selectedTipoArchivo.origen);
    }
  }, [selectedTipoArchivo]);

  const formatErrors = errors as any;

  return (
    <FormProvider {...createTipoArchivoForm}>
      <Container>
        <Input
          label="Nombre"
          placeholder="Ingrese un nombre para el tipo de archivo"
          type="string"
          register={register}
          required
          isInvalid={!!errors[CreateTipoArchivoFormFields.nombre]?.message}
          inputFormName={CreateTipoArchivoFormFields.nombre}
        />
        <Dropdown
          defaultValue={
            selectedTipoArchivo?.origen ? [selectedTipoArchivo?.origen] : []
          }
          label="Origen"
          isInvalid={!!errors[CreateTipoArchivoFormFields.origen]?.message}
          placeholder="Seleccione el Origen"
          onChange={(val: any) =>
            setValue(CreateTipoArchivoFormFields.origen, val?.value)
          }
          required
          items={[
            { label: "Llamado", value: TipoArchivoOrigen.llamado },
            { label: "Postulante", value: TipoArchivoOrigen.postulante },
          ]}
          inputFormName={CreateTipoArchivoFormFields.origen}
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

export default AddTipoArchivoForm;
