import styled from "styled-components";
import tw from "twin.macro";
import Input from "../Inputs/Input";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { CreatePostulanteFormFields } from "@/enums/CreatePostulanteFormFields";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import OneLineError from "../OneLineError/OneLineError";
import { PostulanteList } from "types/postulante";
import {
  CreatePostulanteForm,
  postulanteValidationSchema,
} from "@/forms/CreatePostulanteForm";

interface Props {
  normalErrors?: string[];
  selectedPostulante: PostulanteList | undefined;
}

const Container = styled.div`
  ${tw`w-full h-auto flex flex-col gap-4 items-center justify-start`}
`;

const ErrorList = styled.div`
  ${tw`w-full h-auto flex flex-col gap-1`}
`;

const AddPostulanteForm = ({
  normalErrors = [],
  selectedPostulante,
}: Props) => {
  const createPostulanteForm = useForm<CreatePostulanteForm>({
    resolver: yupResolver(postulanteValidationSchema()),
  });

  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    if (selectedPostulante) {
      setValue(CreatePostulanteFormFields.nombres, selectedPostulante.nombres);
      setValue(
        CreatePostulanteFormFields.apellidos,
        selectedPostulante.apellidos
      );
      setValue(
        CreatePostulanteFormFields.documento,
        selectedPostulante.documento
      );
    }
  }, [selectedPostulante]);

  const formatErrors = errors as any;

  return (
    <FormProvider {...createPostulanteForm}>
      <Container>
        <Input
          label="Nombres"
          placeholder="Ingrese nombres"
          type="string"
          register={register}
          required
          isInvalid={!!errors[CreatePostulanteFormFields.nombres]?.message}
          inputFormName={CreatePostulanteFormFields.nombres}
        />
        <Input
          label="Apellidos"
          placeholder="Ingrese apellidos"
          type="string"
          register={register}
          required
          isInvalid={!!errors[CreatePostulanteFormFields.apellidos]?.message}
          inputFormName={CreatePostulanteFormFields.apellidos}
        />
        <Input
          label="Documento"
          placeholder="Ingrese un documento"
          type="string"
          register={register}
          required
          isInvalid={!!errors[CreatePostulanteFormFields.documento]?.message}
          inputFormName={CreatePostulanteFormFields.documento}
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

export default AddPostulanteForm;
